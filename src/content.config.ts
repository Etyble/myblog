import { defineCollection } from "astro:content";
import { z } from "astro/zod";

/**
 * 手写的内容加载器。
 *
 * 为什么不用 `astro/loaders` 的 `glob()`：官方加载器会 import `picomatch`，
 * 而它是个 CommonJS 包。`astro sync` 通过 Vite 的模块运行器执行加载器，
 * picomatch 的 `require()` 在 ESM 环境里求值，直接抛 `require is not defined`，
 * 结果每个集合都变成空的。
 *
 * 本文件只用 `node:` 内置模块，不会走到那条代码路径。
 *
 * 复查条件：上述失败在 astro 7.3.2 与当时安装的 Vite 8 下复现过。若日后升级
 * 修复了该问题，应改回官方 `glob()` 并删除本实现。
 */

/** 去掉 YAML 标量的引号，并从裸值推断布尔与数字。 */
function scalar(value: string): unknown {
  const trimmed = value.trim();
  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));
  if (quoted) return trimmed.slice(1, -1);
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

/**
 * 解析 frontmatter 块，返回 `{ data, body }`。
 * 只处理本项目内容用到的标量与内联数组形式。
 */
function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!field) continue;

    const [, key, rawValue] = field;
    const value = rawValue.trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => scalar(item))
        .filter((item) => item !== "");
    } else if (value === "") {
      data[key] = "";
    } else {
      data[key] = scalar(value);
    }
  }

  return { data, body: raw.slice(match[0].length) };
}

/**
 * 每个内容目录最近一次的同步函数，供文件监听复用。
 * 键为绝对路径目录，值为「用当前上下文重跑一次全量同步」。
 */
const syncByDir = new Map<string, () => Promise<void>>();
/** 已经挂过监听的目录，避免重复 sync 时反复注册事件。 */
const watchedDirs = new Set<string>();

/** 构造一个加载器：递归读取 `base` 下的所有 .md 文件。 */
function markdownDir(base: string) {
  return {
    name: `markdown-dir:${base}`,
    load: async ({
      config,
      parseData,
      generateDigest,
      renderMarkdown,
      store,
      logger,
      watcher,
    }: any) => {
      const { readdir, readFile, stat } = await import("node:fs/promises");
      const { join, relative, sep } = await import("node:path");
      const { fileURLToPath, pathToFileURL } = await import("node:url");

      // 基于项目根目录解析，而不是依赖进程 cwd——dev 与构建运行器的 cwd 未必一致。
      // 用相对路径时集合会悄悄变空，所以先确认目录确实存在。
      const root = fileURLToPath(config.root);
      const dir = join(root, base);
      const toPosix = (value: string) => value.split(sep).join("/");

      const dirExists = await stat(dir).then((s) => s.isDirectory()).catch(() => false);
      if (!dirExists) {
        throw new Error(
          `[${base}] content directory not found: ${dir} (project root: ${root})`,
        );
      }

      async function walk(current: string): Promise<string[]> {
        const found: string[] = [];
        for (const item of await readdir(current, { withFileTypes: true })) {
          const full = join(current, item.name);
          if (item.isDirectory()) found.push(...(await walk(full)));
          else if (item.name.endsWith(".md")) found.push(full);
        }
        return found;
      }

      /** 读取并写入单个文件，返回它的 id。 */
      async function loadFile(file: string): Promise<string> {
        const raw = await readFile(file, "utf-8");
        const { data, body } = parseFrontmatter(raw);
        const id = toPosix(relative(dir, file)).replace(/\.md$/, "");
        // Astro 以项目根目录为基准解析条目的源文件路径。
        const filePath = toPosix(relative(root, file));

        // YAML 里的日期是字符串，而集合 schema 要求 Date。
        for (const [key, value] of Object.entries(data)) {
          if (/date$/i.test(key) && typeof value === "string" && value !== "") {
            const asDate = new Date(value);
            if (!Number.isNaN(asDate.getTime())) data[key] = asDate;
          }
        }

        const parsed = await parseData({ id, data, filePath });

        // 提前渲染：Astro 7 移除了 `entry.render()`，独立的
        // `render(entry)` 读的就是这个 `rendered` 字段。
        const rendered = await renderMarkdown(body, {
          fileURL: pathToFileURL(file),
        });

        store.set({
          id,
          data: parsed,
          body,
          filePath,
          digest: generateDigest(raw),
          rendered,
        });

        return id;
      }

      // 同一时刻只跑一次全量同步；期间又来了变更就再补跑一轮。
      let running = false;
      let pending = false;

      async function runOnce() {
        const files = await walk(dir);
        if (files.length === 0) {
          throw new Error(`[${base}] no .md files found under ${dir}`);
        }

        // 全量同步后仍未出现的条目，说明源文件已被删除。
        const untouched = new Set<string>(store.keys());
        for (const file of files) {
          untouched.delete(await loadFile(file));
        }
        for (const id of untouched) store.delete(id);

        logger.info(
          `loaded ${files.length} entr${files.length === 1 ? "y" : "ies"} from ${base}`,
        );
      }

      const sync = async () => {
        if (running) {
          pending = true;
          return;
        }
        running = true;
        try {
          do {
            pending = false;
            await runOnce();
          } while (pending);
        } finally {
          running = false;
        }
      };

      // 记住最新一次同步函数，供监听器使用（上下文可能每次 sync 都不同）。
      syncByDir.set(dir, sync);

      await sync();

      // dev 模式下接入 Astro 提供的文件监听，否则 .md 改动必须重启 dev 才生效。
      if (!watcher || watchedDirs.has(dir)) return;
      watchedDirs.add(dir);

      const dirPosix = toPosix(dir);
      const isTarget = (changed: unknown): changed is string => {
        if (typeof changed !== "string") return false;
        if (!changed.toLowerCase().endsWith(".md")) return false;
        return toPosix(changed).startsWith(`${dirPosix}/`);
      };

      const reload = async (changed: string) => {
        if (!isTarget(changed)) return;
        const run = syncByDir.get(dir);
        if (!run) return;
        try {
          await run();
          logger.info(`reloaded content: ${toPosix(relative(dir, changed))}`);
        } catch (error) {
          logger.error(
            `failed to reload content: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      };

      watcher.add(dir);
      watcher.on("change", (changed: string) => void reload(changed));
      watcher.on("add", (changed: string) => void reload(changed));
      watcher.on("unlink", (changed: string) => void reload(changed));
    },
  };
}

/** 文章型集合（博客、碎碎念、档案袋）共用的 schema。 */
const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: markdownDir("./src/content/blog"),
  schema: postSchema,
});

const writings = defineCollection({
  loader: markdownDir("./src/content/writings"),
  schema: postSchema,
});

const dossier = defineCollection({
  loader: markdownDir("./src/content/dossier"),
  schema: postSchema,
});

const worldview = defineCollection({
  loader: markdownDir("./src/content/worldview"),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, writings, dossier, worldview };
