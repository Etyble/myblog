/**
 * 本站的 IPIP-NEO-120 参照基准（「个人常模」）。
 *
 * 这是个人站，没有取样人群，所以参照点就是本站作者本人的一次完整作答。
 * 做法：
 *   1. 在 /tools/personality-test 完整做完 120 题
 *   2. 结果页会出现「导出基准数据」，复制那段 JSON
 *   3. 粘贴到下面的 baseline 字段（保持 null 表示尚未设定）
 *
 * 相对基准的百分位换算见 src/utils/percentile.ts 的 relativePercentile()。
 * 它只是「相对本人」的位置，不是「高于多少比例的人」。
 */

export interface BaselineScores {
  /** 面向 code（如 N1）→ 原始分 4–20 */
  facets: Record<string, number>;
  /** 维度 code（如 N）→ 原始分 24–120 */
  domains: Record<string, number>;
  /** 记录这份基准的日期，仅作备忘 */
  recordedAt?: string;
}

export interface Baseline {
  /** 站点作者的作答结果；尚未录入时为 null */
  baseline: BaselineScores | null;
}

export const SELF_NORMS: Baseline = {
  baseline: {
    facets: {
      N1: 19, E1: 12, O1: 20, A1: 6, C1: 17,
      N2: 16, E2: 6, O2: 18, A2: 19, C2: 14,
      N3: 13, E3: 18, O3: 19, A3: 16, C3: 17,
      N4: 14, E4: 16, O4: 16, A4: 13, C4: 18,
      N5: 10, E5: 16, O5: 19, A5: 9, C5: 17,
      N6: 12, E6: 6, O6: 17, A6: 17, C6: 15,
    },
    domains: { N: 84, E: 74, O: 109, A: 80, C: 98 },
    recordedAt: "2026-09-16",
  },
};

/** 是否已录入基准数据。 */
export function hasBaseline(): boolean {
  return SELF_NORMS.baseline !== null;
}
