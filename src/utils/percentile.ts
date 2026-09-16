/**
 * 分数换算与等级。
 *
 * 参照点：src/data/self-norms.ts 里录入的「本站作者本人作答」。
 * 这是个人站，没有取样人群，所以相对基准的位置只是
 * 「比我自己高还是低」，**不是**「高于多少比例的人」。
 *
 * 换算方式：以基准分为 50%，每偏离 1 分移动 2 个百分点，截断在 1–99。
 *   raw == 基准       → 50
 *   raw 高于基准 n 分  → 50 + 2n
 *   raw 低于基准 n 分  → 50 − 2n
 * 未录入基准时返回 null，由调用方决定如何展示。
 */
import { SCORING } from "../data/ipip-neo.ts";
import { SELF_NORMS } from "../data/self-norms.ts";

/** 每偏离基准 1 分，百分位移动的幅度。 */
const PCT_PER_POINT = 2;

/**
 * 相对于本人基准的百分位（1–99）。
 * 未录入基准、或该 code 不在基准里时返回 null。
 */
export function relativePercentile(raw: number, code: string, kind: "facet" | "domain"): number | null {
  const baseline = SELF_NORMS.baseline;
  if (!baseline) return null;

  const base = kind === "facet" ? baseline.facets[code] : baseline.domains[code];
  if (typeof base !== "number") return null;

  const pct = 50 + (raw - base) * PCT_PER_POINT;
  return Math.min(99, Math.max(1, Math.round(pct)));
}

/** 按 report.json 的 levels 段把百分位映射为等级标签。 */
export function levelFor(percentile: number): string {
  const hit = SCORING.levels.find(
    (l) => percentile >= l.minPercentile && percentile <= l.maxPercentile,
  );
  return hit ? hit.label : SCORING.levels[SCORING.levels.length - 1].label;
}

/** 用于进度条宽度：无百分位时归零，由界面另作说明。 */
export function barWidth(percentile: number | null): number {
  return percentile ?? 0;
}
