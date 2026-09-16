/**
 * Shared content-collection queries.
 *
 * Every list page used to inline the same `getCollection(...)` + `!draft` filter
 * + date sort. Centralising it also gives the sort a single definition of
 * "newest first" that cannot drift between pages.
 */
import { getCollection, type CollectionEntry } from "astro:content";

type PostCollection = "blog" | "writings";

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime();

/** Published entries of one collection, newest first. */
export async function publishedPosts(
  collection: PostCollection,
): Promise<CollectionEntry<PostCollection>[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries.sort(byDateDesc);
}

/** Published blog + writings entries merged, newest first. */
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
