/**
 * 内容集合的公共查询。
 *
 * 此前每个列表页都各自写一遍 `getCollection(...)` + `!draft` 过滤 + 按日期排序；
 * 集中到这里后，「最新在前」只有一处定义，不会在各页面之间跑偏。
 */
import { getCollection, type CollectionEntry } from "astro:content";

/** 有日期与草稿标记的文章型集合。 */
type PostCollection = "blog" | "writings" | "dossier";

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime();

/** 过滤草稿并按日期倒序，保留调用方传入的条目类型。 */
function publishedOnly<T extends { data: { draft: boolean; date: Date } }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.data.draft).sort(byDateDesc);
}

/** 单个集合中已发布的条目，最新在前。 */
export async function publishedPosts(
  collection: PostCollection,
): Promise<CollectionEntry<PostCollection>[]> {
  return publishedOnly(await getCollection(collection));
}

/**
 * 博客与碎碎念的已发布条目合并后，最新在前。
 * 档案袋是杂项文档，不参与首页聚合。
 */
export async function latestPosts(
  limit?: number,
): Promise<(CollectionEntry<"blog" | "writings"> & { type: "blog" | "writings" })[]> {
  // 这里直接按字面量取集合，返回类型才能精确到 blog / writings 两个集合。
  const [blog, writings] = await Promise.all([
    publishedOnly(await getCollection("blog")),
    publishedOnly(await getCollection("writings")),
  ]);

  const merged = [
    ...blog.map((entry) => ({ ...entry, type: "blog" as const })),
    ...writings.map((entry) => ({ ...entry, type: "writings" as const })),
  ].sort(byDateDesc);

  return limit === undefined ? merged : merged.slice(0, limit);
}
