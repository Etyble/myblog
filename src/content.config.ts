import { defineCollection } from "astro:content";
import { z } from "astro/zod";

/**
 * Hand-written content loaders.
 *
 * Why not `glob()` from `astro/loaders`: the official glob loader imports
 * `picomatch`, a CommonJS package. `astro sync` runs loaders through Vite's
 * module runner, where picomatch's `require()` is evaluated in an ESM context
 * and throws `require is not defined`, so every collection ends up empty.
 *
 * These loaders use only `node:` builtins, so they never reach that code path.
 */

/** Unquotes a YAML scalar and infers booleans/numbers from bare values. */
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
 * Parses the frontmatter block and returns `{ data, body }`.
 * Handles the scalar and inline-array forms used by this project's content.
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

/** Builds a loader that reads every .md file under `base` recursively. */
function markdownDir(base: string) {
  return {
    name: `markdown-dir:${base}`,
    load: async ({ config, parseData, generateDigest, renderMarkdown, store, logger }: any) => {
      const { readdir, readFile, stat } = await import("node:fs/promises");
      const { join, relative, sep } = await import("node:path");
      const { fileURLToPath, pathToFileURL } = await import("node:url");

      // Resolve against the project root rather than the process cwd — the dev
      // server and the build runner do not necessarily share a cwd. Using a
      // relative path here silently yields an empty collection, so verify the
      // directory is actually there.
      const root = fileURLToPath(config.root);
      const dir = join(root, base);

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

      const files = await walk(dir);
      if (files.length === 0) {
        throw new Error(`[${base}] no .md files found under ${dir}`);
      }
      logger.info(`loaded ${files.length} entr${files.length === 1 ? "y" : "ies"} from ${base}`);

      for (const file of files) {
        const raw = await readFile(file, "utf-8");
        const { data, body } = parseFrontmatter(raw);
        const id = relative(dir, file).split(sep).join("/").replace(/\.md$/, "");
        // Astro resolves the entry's source relative to the project root.
        const filePath = relative(root, file).split(sep).join("/");

        // YAML dates arrive as strings; the collection schemas expect Date.
        for (const [key, value] of Object.entries(data)) {
          if (/date$/i.test(key) && typeof value === "string" && value !== "") {
            const asDate = new Date(value);
            if (!Number.isNaN(asDate.getTime())) data[key] = asDate;
          }
        }

        const parsed = await parseData({ id, data, filePath });

        // Render up front: Astro 7 removed `entry.render()`, and the standalone
        // `render(entry)` reads this `rendered` field.
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
      }
    },
  };
}

const blog = defineCollection({
  loader: markdownDir("./src/content/blog"),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const writings = defineCollection({
  loader: markdownDir("./src/content/writings"),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
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

export const collections = { blog, writings, worldview };
