/**
 * 骰子定义与界线。
 *
 * 这里只描述「有哪些骰」以及展示用的名称与形状；掷骰逻辑留在页面里，
 * 因为它要访问浏览器的随机数接口。新增骰子只需往 STANDARD_DICE 追加一条。
 */

export interface DieSpec {
  /** 面数 */
  sides: number;
  /** 简写，如 "d6" */
  label: string;
  /** 中文名 */
  name: string;
  /** 几何形状说明 */
  shape: string;
  /** 百分骰：由十位与个位各一颗 d10 组成 */
  percentile?: boolean;
}

export const STANDARD_DICE: DieSpec[] = [
  { sides: 4, label: "d4", name: "四面骰", shape: "正四面体" },
  { sides: 6, label: "d6", name: "六面骰", shape: "立方体" },
  { sides: 8, label: "d8", name: "八面骰", shape: "正八面体" },
  { sides: 10, label: "d10", name: "十面骰", shape: "五角偏方面体" },
  { sides: 12, label: "d12", name: "十二面骰", shape: "正十二面体" },
  { sides: 20, label: "d20", name: "二十面骰", shape: "正二十面体" },
  {
    sides: 100,
    label: "d100",
    name: "百分骰",
    shape: "十位 + 个位各一颗 d10",
    percentile: true,
  },
];

/** 单次掷骰的最大数量：兼顾连掷手感与渲染开销。 */
export const MAX_DICE_PER_ROLL = 20;

/** 自定义面数的取值范围。 */
export const MIN_CUSTOM_SIDES = 1;
export const MAX_CUSTOM_SIDES = 1000;

/** 历史记录保留条数。 */
export const HISTORY_LIMIT = 20;
