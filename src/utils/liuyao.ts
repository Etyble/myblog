/**
 * 六爻起卦（三枚硬币法）。
 *
 * 民间最通行的起卦方式：摇三枚铜钱，记录正反，重复六次，自下而上成卦。
 * 三枚铜钱共八种组合，映射到四种爻：
 *
 *   三背           → 老阳（变爻）  概率 1/8
 *   两背一字       → 少阳           概率 3/8
 *   一背两字       → 少阴           概率 3/8
 *   三字           → 老阴（变爻）  概率 1/8
 *
 * 传统称三背为「重」、三字为「交」，二者皆为变爻。
 *
 * 有变爻时，本卦会变为另一卦（变卦），传统断卦同时参考本卦与变卦。
 *
 * 注意四种爻的概率并不均等（各为 1/8、3/8、3/8、1/8），
 * 这正是此法与「简单掷硬币定阴阳」的关键差别。
 */

import { type Hexagram, type Trigram, byTrigrams } from "../data/hexagrams.ts";

export interface Line {
  /** 阳爻为 true，阴爻为 false */
  yang: boolean;
  /** 是否为变爻（老阴/老阳） */
  changing: boolean;
}

export interface CastResult {
  /** 六爻，自下而上（index 0 为初爻） */
  lines: Line[];
  /** 本卦 */
  primary: Hexagram;
  /** 变卦；无变爻时为 null */
  transformed: Hexagram | null;
  /** 变爻的爻位（1–6，自下而上） */
  changingPositions: number[];
}

export const LINE_NAMES = ["初", "二", "三", "四", "五", "上"] as const;

/** 三枚硬币的正面数 → 该爻。传统对应（「重」为三背、「交」为三字）：
 *
 *   三背（0 正） → 老阳（变爻）  1/8
 *   两背一字（1 正） → 少阳        3/8
 *   一背两字（2 正） → 少阴        3/8
 *   三字（3 正） → 老阴（变爻）  1/8
 */
const COIN_TABLE: Line[] = [
  { yang: true, changing: true },   // 0 正 → 三背 → 老阳
  { yang: true, changing: false },  // 1 正 → 两背一字 → 少阳
  { yang: false, changing: false }, // 2 正 → 一背两字 → 少阴
  { yang: false, changing: true },  // 3 正 → 三字 → 老阴
];

/** 一次摇掷的结果：这一爻，以及三枚硬币各自的正反（true 为正面「字」）。 */
export interface Toss {
  line: Line;
  /** 三枚硬币，true 为正面「字」，false 为反面「背」 */
  coins: [boolean, boolean, boolean];
}

/**
 * 摇三枚硬币一次。返回该爻与硬币正反——务必用同一结果同时驱动
 * 界面展示与成卦，否则「看到的硬币」与「得到的爻」会不一致。
 */
export function tossThreeCoins(random: () => number = Math.random): Toss {
  const coins = [random() < 0.5, random() < 0.5, random() < 0.5] as [
    boolean,
    boolean,
    boolean,
  ];
  const heads = coins.filter(Boolean).length;
  return { line: COIN_TABLE[heads], coins };
}

/** 三枚硬币的正反 → 显示文字。 */
export function coinLabel(coin: boolean): string {
  return coin ? "字" : "背";
}

/**
 * 三画卦由三爻自下而上的阴阳决定：第 i 爻为阳则置第 i 位。
 * 例：震为初爻阳、二爻阴、三爻阴 → 二进制 001 → 1。
 * 顺序即「坤艮坎巽震离兑乾」（邵雍先天八卦次序），
 * 与《周易本义》所载三画卦次序一致。
 */
const TRIGRAM_BY_BITS: Trigram[] = ["坤", "艮", "坎", "巽", "震", "离", "兑", "乾"];

/** 六爻 → 三画卦。offset 0 取初二三爻（下卦），3 取四五六爻（上卦）。 */
function trigramOf(lines: Line[], offset: number): Trigram {
  const bits = [0, 1, 2].reduce((acc, i) => acc | ((lines[offset + i].yang ? 1 : 0) << i), 0);
  return TRIGRAM_BY_BITS[bits];
}

/** 由六爻推出本卦与变卦（如有变爻）。 */
export function castHexagram(random: () => number = Math.random): CastResult {
  return buildResult(Array.from({ length: 6 }, () => tossThreeCoins(random).line));
}

/** 给定六爻，计算本卦、变爻与变卦。 */
export function buildResult(lines: Line[]): CastResult {
  const lower = trigramOf(lines, 0);
  const upper = trigramOf(lines, 3);
  const primary = byTrigrams.get(`${upper}${lower}`);
  if (!primary) {
    throw new Error(`未找到卦：上${upper} 下${lower}`);
  }

  const changingPositions = lines
    .map((line, i) => (line.changing ? i + 1 : 0))
    .filter((position) => position > 0);

  let transformed: Hexagram | null = null;
  if (changingPositions.length > 0) {
    // 变爻翻转阴阳，得到变卦。
    const flipped = lines.map((line) =>
      line.changing ? { yang: !line.yang, changing: false } : line,
    );
    const tLower = trigramOf(flipped, 0);
    const tUpper = trigramOf(flipped, 3);
    transformed = byTrigrams.get(`${tUpper}${tLower}`) ?? null;
  }

  return { lines, primary, transformed, changingPositions };
}
