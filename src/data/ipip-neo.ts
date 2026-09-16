/**
 * IPIP-NEO-120 数据加载与类型。
 *
 * 题目与计分规则来自 src/data/IPIP-NEO-120/ 下的两个 JSON 文件
 * （International Personality Item Pool 公开题库）。
 * 本文件只做类型化与导出，不改动原始数据。
 */
import questionsJson from "../data/IPIP-NEO-120/questions.json" with { type: "json" };
import reportJson from "../data/IPIP-NEO-120/report.json" with { type: "json" };

export type DomainCode = "N" | "E" | "O" | "A" | "C";

export interface Question {
  id: number;
  text: string;
  domain: DomainCode;
  facet: string;
  /** 反向计分题：原始分需按 rules 里的公式转换 */
  reverse: boolean;
}

export interface Choice {
  id: number;
  text: string;
}

export interface Domain {
  code: DomainCode;
  name: string;
  facets: string[];
  scoreRange: { min: number; max: number };
  description: string;
}

export interface Facet {
  code: string;
  name: string;
  domain: DomainCode;
  scoreRange: { min: number; max: number };
}

export interface Level {
  label: string;
  minPercentile: number;
  maxPercentile: number;
}

export interface ScoringRules {
  reverseFormula: string;
  domainScore: string;
  facetScore: string;
  presentation: { rawScore: boolean; percentile: boolean; level: boolean };
  levels: Level[];
}

export const QUESTIONS: Question[] = questionsJson.questions as Question[];
export const CHOICES: Choice[] = questionsJson.select as Choice[];
export const DOMAINS: Domain[] = reportJson.domains as Domain[];
export const FACETS: Facet[] = reportJson.facets as Facet[];
export const SCORING: ScoringRules = reportJson.scoring as ScoringRules;

/** 题目按维度分组，便于分页与进度显示。 */
export const QUESTIONS_PER_FACET = 4;
