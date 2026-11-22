/**
 * 站点根路径工具。
 *
 * `import.meta.env.BASE_URL` 是构建期注入的部署根路径：
 * GitHub Pages 用 `/myblog`，Cloudflare Pages 用 `/`。Astro 只会改写静态资源的
 * URL，普通的 `<a href>` 会原样输出，因此每个站内链接都要自己补上根路径。
 *
 * 这套逻辑只保留在本文件里；下面的实现会归一化根路径，使它带不带末尾斜杠
 * 都能得到正确结果。
 */

/** 去掉末尾斜杠的部署根路径：`/` 或 `/myblog`。 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

/**
 * 把站内相对路径解析到部署根路径之下。
 *
 *   withBase("/blog")            -> "/myblog/blog"  |  "/blog"
 *   withBase("/blog/first")      -> "/myblog/blog/first"
 *   withBase("/avatar.jpg")      -> "/myblog/avatar.jpg"
 *   withBase("/")                -> "/myblog/"      |  "/"
 */
export function withBase(path: string): string {
  return base + path;
}
