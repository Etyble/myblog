/** Shared display formatting for dates. */
const LOCALE = "zh-CN";

/** Short date, e.g. `2026/5/10`. Used in list views. */
export function shortDate(date: Date): string {
  return date.toLocaleDateString(LOCALE);
}

/** Long date, e.g. `2026年5月10日`. Used on article pages. */
export function longDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
