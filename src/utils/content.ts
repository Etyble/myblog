/**
 * 内容集合的公共查询。
 *
 * 此前每个列表页都各自写一遍 `getCollection(...)` + `!draft` 过滤 + 按日期排序；
 * 集中到这里后，「最新在前」只有一处定义，不会在各页面之间跑偏。
 */
import { getCollection, type CollectionEntry } from "astro:content";

type PostCollection = "blog" | "writings";

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime();

/** 单个集合中已发布的条目，最新在前。 */
export async function publishedPosts(
  collection: PostCollection,
): Promise<CollectionEntry<PostCollection>[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries.sort(byDateDesc);
}

/** 博客与碎碎念的已发布条目合并后，最新在前。 */
export async function latestPosts(
  limit?: number,
): Promise<(CollectionEntry<PostCollection> & { type: PostCollection })[]> {
  const [blog, writings] = await Promise.all([
    publishedPosts("blog"),
    publishedPosts("writings"),
  ]);

  const merged = [
    ...blog.map((entry) => ({ ...entry, type: "blog" as const })),
    ...writings.map((entry) => ({ ...entry, type: "writings" as const })),
  ].sort(byDateDesc);

  return limit === undefined ? merged : merged.slice(0, limit);
}
