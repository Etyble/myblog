/**
 * 占卜方法清单。
 *
 * 加新方法只需在此追加一条，并在 src/pages/tools/divination/ 下放置对应页面。
 * 入口页会自动列出，无需改动页面代码。
 */

export interface DivinationMethod {
  /** 站点根相对路径 */
  href: string;
  /** 卡片符号 */
  icon: string;
  title: string;
  description: string;
  /** 来源地区或传统 */
  origin: string;
  tag: string;
}

export const METHODS: DivinationMethod[] = [
  {
    href: "/tools/divination/liuyao",
    icon: "☯",
    title: "算卦",
    description:
      "三枚硬币摇六次，自下而上成一卦。老阴、老阳为变爻，本卦与变卦并参——六爻断卦的传统做法。",
    origin: "中国 · 周易六爻",
    tag: "硬币起卦",
  },
  {
    href: "/tools/divination/omikuji",
    icon: "🎋",
    title: "抽签",
    description:
      "日式神签，吉凶共七档，签诗为和歌，另附愿望、健康、感情、出行等分项运势。",
    origin: "日本 · 神社おみくじ",
    tag: "摇签",
  },
];
