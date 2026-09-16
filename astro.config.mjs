import { defineConfig } from "astro/config";

// This site ships to two hosts with different roots. Cloudflare Pages sets
// CF_PAGES=1 during its build; GitHub Actions does not.
//
//   GitHub Pages  https://etyble.github.io/myblog  ->  site + base "/myblog"
//   Cloudflare    https://<project>.pages.dev      ->  root, no base
//
// When running on Cloudflare, set CF_PAGES=1 in the project's build settings,
// otherwise the GitHub values are used and every link would carry a stray
// "/myblog" prefix. Pinning the target with an explicit env var is the robust
// alternative if that ever becomes a problem.
const isCloudflare = !!process.env.CF_PAGES;

const site = process.env.PUBLIC_SITE_URL ?? (isCloudflare ? undefined : "https://etyble.github.io");
const base = isCloudflare ? "/" : "/myblog";

export default defineConfig({
  output: "static",
  site,
  base,
});
