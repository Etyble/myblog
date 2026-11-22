import { defineConfig } from "astro/config";

// 本站要发布到两个根路径不同的主机。Cloudflare Pages 构建时会设置
// CF_PAGES=1，GitHub Actions 则不会。
//
//   GitHub Pages  https://etyble.github.io/myblog  ->  site + base "/myblog"
//   Cloudflare    https://<project>.pages.dev      ->  根路径，不设 base
//
// 部署到 Cloudflare 时，需在项目的构建设置里设置 CF_PAGES=1；否则会套用
// GitHub 侧的值，所有链接都会多出一段 "/myblog"。若这一点变得不可靠，
// 改用显式环境变量固定目标更稳妥。
const isCloudflare = !!process.env.CF_PAGES;

const site = process.env.PUBLIC_SITE_URL ?? (isCloudflare ? undefined : "https://etyble.github.io");
const base = isCloudflare ? "/" : "/myblog";

export default defineConfig({
  output: "static",
  site,
  base,
});
