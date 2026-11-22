/** 日期显示的公共格式。 */
const LOCALE = "zh-CN";

/** 短日期，如 `2026/5/10`，用于列表。 */
export function shortDate(date: Date): string {
  return date.toLocaleDateString(LOCALE);
}

/** 长日期，如 `2026年5月10日`，用于文章页。 */
export function longDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
