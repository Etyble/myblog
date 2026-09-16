/**
 * 日式抽签（おみくじ）数据。
 *
 * 吉凶七档的先后顺序依传统神社体系：
 *   大吉 > 吉 > 中吉 > 小吉 > 末吉 > 凶 > 大凶
 * （部分小社把中吉置于吉之上，但主要神社以「吉」次于「大吉」。）
 *
 * 比例依伝・元三大師（良源）所定之传统配比：吉约七成、凶约三成。
 * 浅草寺至今仍守此比例。凶与大凶合计约三成，大凶极为罕见。
 *
 * 和歌为传统签诗，十四世纪起用于「歌占」（和歌占卜），
 * 后与百首和歌一同成为近世以来最普遍的签诗形式。
 */

export interface Verse {
  /** 和歌原文 */
  kana: string;
  /** 读法（假名） */
  reading: string;
  /** 歌意／解签 */
  meaning: string;
}

export interface FortuneLevel {
  id: string;
  /** 汉字段位，如「大吉」 */
  kanji: string;
  /** 平假名读音 */
  yomi: string;
  /** 中文说明 */
  zh: string;
  /** 总体倾向 */
  tone: "great" | "good" | "fair" | "watch" | "warn";
  /** 权重（相对值），吉约七成、凶约三成 */
  weight: number;
  /** 该档位的签诗 */
  verse: Verse;
}

export const FORTUNE_LEVELS: FortuneLevel[] = [
  {
    id: "daikichi",
    kanji: "大吉",
    yomi: "だいきち",
    zh: "大吉。所愿易成，诸事顺遂。",
    tone: "great",
    weight: 16,
    verse: {
      kana: "苦は樂の種　樂は苦の種",
      reading: "くはらくのたね　らくはくのたね",
      meaning: "苦与乐互为种子。今日所受之苦，正是他日之乐的根本；顺境中亦不可懈怠。",
    },
  },
  {
    id: "kichi",
    kanji: "吉",
    yomi: "きち",
    zh: "吉。安稳顺遂，宜守不宜攻。",
    tone: "good",
    weight: 22,
    verse: {
      kana: "雨のあとには　晴れ間も来る",
      reading: "あめのあとには　はれまもくる",
      meaning: "雨过自有晴时。当前的阻滞并非定局，耐心等待即可见到转机。",
    },
  },
  {
    id: "chukichi",
    kanji: "中吉",
    yomi: "ちゅうきち",
    zh: "中吉。稳步可进，急则生变。",
    tone: "good",
    weight: 20,
    verse: {
      kana: "咲く花は　散るを恐れず",
      reading: "さくはなは　ちるをおそれず",
      meaning: "盛开之花不惧凋零。该做的事就放手去做，顾虑过多反而错失时机。",
    },
  },
  {
    id: "shokichi",
    kanji: "小吉",
    yomi: "しょうきち",
    zh: "小吉。小有收获，勿求大成。",
    tone: "fair",
    weight: 16,
    verse: {
      kana: "小さき灯も　闇を照らす",
      reading: "ちいさきひも　やみをてらす",
      meaning: "微小的灯火亦能照亮黑暗。不必急于求大，眼下的微小进展自有其意义。",
    },
  },
  {
    id: "suekichi",
    kanji: "末吉",
    yomi: "すえきち",
    zh: "末吉。先难后易，晚成之兆。",
    tone: "fair",
    weight: 16,
    verse: {
      kana: "冬の後にこそ　春は来たれ",
      reading: "ふゆののちにこそ　はるはきたれ",
      meaning: "冬尽春方至。眼下尚在寒冬，但时节终会推移，此刻宜守不宜求。",
    },
  },
  {
    id: "kyo",
    kanji: "凶",
    yomi: "きょう",
    zh: "凶。宜静不宜动，慎言慎行。",
    tone: "warn",
    weight: 29,
    verse: {
      kana: "急ぐ川には　石多し",
      reading: "いそぐかわには　いしおおし",
      meaning: "流急之川多石。越急越易生阻，此刻最要紧的是放慢脚步、审慎行事。",
    },
  },
  {
    id: "daikyo",
    kanji: "大凶",
    yomi: "だいきょう",
    zh: "大凶。诸事不宜，唯宜自省。",
    tone: "warn",
    weight: 1,
    verse: {
      kana: "止まれ　進むより　守れ",
      reading: "とまれ　すすむより　まもれ",
      meaning: "当止则止。此时前进不如守成，先护住已有的一切，静待时机转换。",
    },
  },
];

/** 签文分项（传统签纸栏目）。按吉凶倾向给出对应说法。 */
export const CATEGORIES: { key: string; label: string; readings: Record<FortuneLevel["tone"], string> }[] = [
  {
    key: "wish",
    label: "愿望",
    readings: {
      great: "所愿必成，且会比预想中更快。",
      good: "心之所愿可成，但需耐心等候时机。",
      fair: "小愿可成，大愿宜暂缓。",
      watch: "此愿暂难成就，换个方向反而有路。",
      warn: "此刻不宜许愿，先把眼前之事理清。",
    },
  },
  {
    key: "health",
    label: "健康",
    readings: {
      great: "身心皆安，是调养与锻炼的好时候。",
      good: "大体无恙，作息规律即可。",
      fair: "小有不适，多与疲劳有关，休息便能缓解。",
      watch: "需留意积劳，别把疲惫当成习惯。",
      warn: "身体在提醒你，务必停下来歇一歇。",
    },
  },
  {
    key: "love",
    label: "感情",
    readings: {
      great: "情意相通，关系会明朗而稳定。",
      good: "相处顺利，真诚待人自有所得。",
      fair: "尚在观望期，不必急于定论。",
      watch: "言语易生误会，说之前先想一遍。",
      warn: "此时易生口角，退一步比争一句管用。",
    },
  },
  {
    key: "travel",
    label: "出行",
    readings: {
      great: "远行大吉，出门有好事相随。",
      good: "出行平顺，按计划走即可。",
      fair: "短程无碍，长途宜推迟。",
      watch: "行程易有变故，留出余地。",
      warn: "不宜远行，若必须动身则加倍谨慎。",
    },
  },
  {
    key: "study",
    label: "学业",
    readings: {
      great: "专心致志则事半功倍，是突破的好时机。",
      good: "稳步进益，按部就班即可。",
      fair: "进展稍慢，方法比努力更要紧。",
      watch: "心易散乱，先收拾环境再收拾心。",
      warn: "勉强硬撑效率极低，不如休息后再来。",
    },
  },
  {
    key: "money",
    label: "财务",
    readings: {
      great: "财路通畅，宜把握机会。",
      good: "收支平稳，适度储蓄为宜。",
      fair: "有小进项，但不宜大额投入。",
      watch: "留意意外支出，勿轻信高回报之诱。",
      warn: "不宜投资、不宜借贷，守住本金最重要。",
    },
  },
  {
    key: "lost",
    label: "失物",
    readings: {
      great: "易寻回，往平日常去之处找。",
      good: "可寻回，多在近处而非远处。",
      fair: "花些时间能找到，但别放弃太早。",
      watch: "可能已经找回无望，当作一次提醒。",
      warn: "难寻回，重要的东西请从头再检查一遍。",
    },
  },
  {
    key: "person",
    label: "待人",
    readings: {
      great: "所待之人将至，且带来好消息。",
      good: "会来，只是比预期稍晚。",
      fair: "尚需等待，不必主动追问。",
      watch: "对方迟疑不决，催促无益。",
      warn: "暂无可期之人，把心力放回自己身上。",
    },
  },
];

/** 按权重抽取一个吉凶档位。random 可注入以便测试。 */
export function drawFortune(random: () => number = Math.random): FortuneLevel {
  const total = FORTUNE_LEVELS.reduce((sum, level) => sum + level.weight, 0);
  let roll = random() * total;
  for (const level of FORTUNE_LEVELS) {
    roll -= level.weight;
    if (roll < 0) return level;
  }
  return FORTUNE_LEVELS[FORTUNE_LEVELS.length - 1];
}
