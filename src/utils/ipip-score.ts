/**
 * IPIP-NEO-120 计分。
 *
 * 完全按 src/data/IPIP-NEO-120/report.json 中 scoring 段定义的规则：
 *   - 反向题：rawScore 按 "6 - rawScore" 转换
 *   - facet 分 = 该面向 4 道题转换后之和（范围 4–20）
 *   - domain 分 = 该维度 6 个 facet 之和（范围 24–120）
 *
 * 百分位是「相对 src/data/self-norms.ts 里录入的本人基准」，
 * 未录入基准时为 null。
 */
import {
  CHOICES,
  DOMAINS,
  FACETS,
  QUESTIONS,
  SCORING,
  type DomainCode,
  type Facet,
} from "../data/ipip-neo.ts";
import { hasBaseline, type BaselineScores } from "../data/self-norms.ts";
import { levelFor, relativePercentile } from "./percentile.ts";

/** 每题的回答：选项 id（1–5）。未作答为 undefined。 */
export type Answers = Record<number, number>;

export interface FacetScore {
  facet: Facet;
  /** 4–20 */
  raw: number;
  /** 相对本人基准的百分位；未录入基准时为 null */
  percentile: number | null;
  level: string | null;
  /** 与基准分的差值；无基准时为 null */
  delta: number | null;
}

export interface DomainScore {
  code: DomainCode;
  name: string;
  description: string;
  /** 24–120 */
  raw: number;
  min: number;
  max: number;
  percentile: number | null;
  level: string | null;
  delta: number | null;
  facets: FacetScore[];
}

export interface ScoreReport {
  domains: DomainScore[];
  answered: number;
  total: number;
  /** 本次结果是否使用了已录入的基准 */
  hasBaseline: boolean;
}

/** 选项 id 的合法范围，用于校验。 */
export const CHOICE_IDS = CHOICES.map((c) => c.id);
export const TOTAL_QUESTIONS = QUESTIONS.length;

/** 反向计分：按 rules.reverseFormula 的 "6 - rawScore"。 */
export function reverseScore(raw: number): number {
  return 6 - raw;
}

/** 单题得分（已处理反向题）。 */
export function itemScore(questionId: number, answers: Answers): number | null {
  const raw = answers[questionId];
  if (raw === undefined) return null;
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return null;
  return question.reverse ? reverseScore(raw) : raw;
}

/** 已作答数量。 */
export function answeredCount(answers: Answers): number {
  return QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
}

/** 未作答的题号。 */
export function unansweredIds(answers: Answers): number[] {
  return QUESTIONS.filter((q) => answers[q.id] === undefined).map((q) => q.id);
}

interface RawScores {
  /** facet code → 原始分 */
  facets: Record<string, number>;
  /** domain code → 原始分 */
  domains: Record<DomainCode, number>;
}

/** 只算原始分，不做百分位换算。 */
function computeRaw(answers: Answers): RawScores {
  const facets: Record<string, number> = {};
  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (value === undefined) continue;
    const scored = q.reverse ? reverseScore(value) : value;
    facets[q.facet] = (facets[q.facet] ?? 0) + scored;
  }

  const domains = {} as Record<DomainCode, number>;
  for (const domain of DOMAINS) {
    domains[domain.code] = FACETS.filter((f) => f.domain === domain.code).reduce(
      (sum, f) => sum + (facets[f.code] ?? 0),
      0,
    );
  }

  return { facets, domains };
}

/**
 * 生成基准数据（用于录入 src/data/self-norms.ts）。
 * 需要 120 题全部作答。
 */
export function toBaseline(answers: Answers, recordedAt?: string): BaselineScores {
  const { facets, domains } = computeRaw(answers);
  return { facets, domains, recordedAt };
}

/** 由百分位反推与基准分的差（百分位 = 50 + 2 × 差值）。 */
function deltaFrom(percentile: number): number {
  return Math.round((percentile - 50) / 2);
}

/** 计算完整报告。缺答的题按 0 分计（调用方应先用 unansweredIds 拦截）。 */
export function score(answers: Answers): ScoreReport {
  const { facets: facetRaw, domains: domainRaw } = computeRaw(answers);

  const domains: DomainScore[] = DOMAINS.map((domain) => {
    const raw = domainRaw[domain.code];
    const percentile = relativePercentile(raw, domain.code, "domain");

    const facets: FacetScore[] = FACETS.filter((f) => f.domain === domain.code).map((facet) => {
      const fRaw = facetRaw[facet.code] ?? 0;
      const fPct = relativePercentile(fRaw, facet.code, "facet");
      return {
        facet,
        raw: fRaw,
        percentile: fPct,
        level: fPct === null ? null : levelFor(fPct),
        delta: fPct === null ? null : deltaFrom(fPct),
      };
    });

    return {
      code: domain.code,
      name: domain.name,
      description: domain.description,
      raw,
      min: domain.scoreRange.min,
      max: domain.scoreRange.max,
      percentile,
      level: percentile === null ? null : levelFor(percentile),
      delta: percentile === null ? null : deltaFrom(percentile),
      facets,
    };
  });

  return {
    domains,
    answered: answeredCount(answers),
    total: QUESTIONS.length,
    hasBaseline: hasBaseline(),
  };
}

export { SCORING };
