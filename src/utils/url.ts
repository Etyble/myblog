/**
 * Site-root URL helpers.
 *
 * `import.meta.env.BASE_URL` is the deployment root, injected at build time:
 * GitHub Pages uses `/myblog`, Cloudflare Pages uses `/`. Astro only rewrites
 * asset URLs for you — plain `<a href>` values are emitted verbatim — so every
 * internal link has to be prefixed with the base itself.
 *
 * These helpers are the single place that logic lives. They normalise the base
 * so the result is correct whether or not it carries a trailing slash.
 */

/** Deployment root without a trailing slash: `/` or `/myblog`. */
export const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

/**
 * Resolves a site-root-relative path against the deployment root.
 *
 *   withBase("/blog")            -> "/myblog/blog"  |  "/blog"
 *   withBase("/blog/first")      -> "/myblog/blog/first"
 *   withBase("/avatar.jpg")      -> "/myblog/avatar.jpg"
 *   withBase("/")                -> "/myblog/"      |  "/"
 */
export function withBase(path: string): string {
  return base + path;
}
