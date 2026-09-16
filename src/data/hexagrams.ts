/**
 * 六十四卦数据（周文王卦序）。
 *
 * 每卦以其「上卦／下卦」两个三画卦为键，这样由六爻可以直接推出卦名：
 *
 *   上卦 = 第 4、5、6 爻（自上而下）
 *   下卦 = 第 1、2、3 爻（自下而上）
 *
 * judgment 为《周易》卦辞，是本文件唯一引用的古籍原文，已逐条核对。
 *
 * 未收录：384 条爻辞（每卦六爻的爻辞）。断卦若要做到「依爻辞定吉凶」，
 * 需要另行补入这部分数据；目前页面给出的是卦辞与卦义提要。
 */

export const TRIGRAMS = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"] as const;
export type Trigram = (typeof TRIGRAMS)[number];

/** 三画卦的卦象与取象，用于成卦后的"体用"说明。 */
export const TRIGRAM_INFO: Record<Trigram, { symbol: string; nature: string; image: string }> = {
  乾: { symbol: "☰", nature: "天", image: "刚健、创始、领导" },
  兑: { symbol: "☱", nature: "泽", image: "喜悦、沟通、收获" },
  离: { symbol: "☲", nature: "火", image: "明察、依附、文明" },
  震: { symbol: "☳", nature: "雷", image: "震动、奋起、行动" },
  巽: { symbol: "☴", nature: "风", image: "顺入、渗透、渐进" },
  坎: { symbol: "☵", nature: "水", image: "险陷、流动、智谋" },
  艮: { symbol: "☶", nature: "山", image: "止静、阻隔、沉稳" },
  坤: { symbol: "☷", nature: "地", image: "柔顺、承载、包容" },
};

export interface Hexagram {
  /** 周文王卦序，1–64 */
  number: number;
  name: string;
  /** 上卦 */
  upper: Trigram;
  /** 下卦 */
  lower: Trigram;
  /** 卦辞（《周易》原文） */
  judgment: string;
  /** 一句话白话提要，便于直接阅读 */
  gist: string;
  /** 所属八宫（京房八宫卦序），用于传统"卦宫"说明 */
  palace: string;
}

export const HEXAGRAMS: Hexagram[] = [
  { number: 1, name: "乾", upper: "乾", lower: "乾", palace: "乾", judgment: "元亨利贞。", gist: "刚健中正，可以大通，宜守正道。" },
  { number: 2, name: "坤", upper: "坤", lower: "坤", palace: "坤", judgment: "元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。", gist: "柔顺承载，宜跟随而不宜争先，守静则吉。" },
  { number: 3, name: "屯", upper: "坎", lower: "震", palace: "坎", judgment: "元亨利贞。勿用有攸往，利建侯。", gist: "初生艰难，不宜妄动，宜先立根基、寻助力。" },
  { number: 4, name: "蒙", upper: "艮", lower: "坎", palace: "离", judgment: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。", gist: "蒙昧待启，诚心求教则通，反复轻慢则不告。" },
  { number: 5, name: "需", upper: "坎", lower: "乾", palace: "坤", judgment: "有孚，光亨，贞吉。利涉大川。", gist: "需要等待，有诚信则光明亨通，可涉险。" },
  { number: 6, name: "讼", upper: "乾", lower: "坎", palace: "离", judgment: "有孚窒惕，中吉，终凶。利见大人，不利涉大川。", gist: "争讼之象，中途可止则吉，争到底则凶。" },
  { number: 7, name: "师", upper: "坤", lower: "坎", palace: "坎", judgment: "贞，丈人吉，无咎。", gist: "兴师用众，须由老成持重者统领方吉。" },
  { number: 8, name: "比", upper: "坎", lower: "坤", palace: "坤", judgment: "吉。原筮元永贞，无咎。不宁方来，后夫凶。", gist: "亲比相辅则吉，来归宜早，迟疑落后者凶。" },
  { number: 9, name: "小畜", upper: "巽", lower: "乾", palace: "巽", judgment: "亨。密云不雨，自我西郊。", gist: "小有积蓄而未成大用，如密云不雨，宜再蓄力。" },
  { number: 10, name: "履", upper: "乾", lower: "兑", palace: "艮", judgment: "履虎尾，不咥人，亨。", gist: "如踩虎尾却能安然，谨慎守礼即可通行。" },
  { number: 11, name: "泰", upper: "坤", lower: "乾", palace: "坤", judgment: "小往大来，吉亨。", gist: "天地交泰，上下通达，是顺遂的好时机。" },
  { number: 12, name: "否", upper: "乾", lower: "坤", palace: "乾", judgment: "否之匪人，不利君子贞，大往小来。", gist: "天地不交，闭塞不通，宜守不宜进。" },
  { number: 13, name: "同人", upper: "乾", lower: "离", palace: "离", judgment: "同人于野，亨。利涉大川，利君子贞。", gist: "与人和同于旷野，公开无私则亨通。" },
  { number: 14, name: "大有", upper: "离", lower: "乾", palace: "乾", judgment: "元亨。", gist: "大有所获，光明盛大，极为亨通。" },
  { number: 15, name: "谦", upper: "坤", lower: "艮", palace: "兑", judgment: "亨，君子有终。", gist: "谦下自处，无往不利，君子能有善终。" },
  { number: 16, name: "豫", upper: "震", lower: "坤", palace: "震", judgment: "利建侯行师。", gist: "和乐顺动，宜有所建树、宜于行动。" },
  { number: 17, name: "随", upper: "兑", lower: "震", palace: "震", judgment: "元亨利贞，无咎。", gist: "随顺时势，守正而动则无咎。" },
  { number: 18, name: "蛊", upper: "艮", lower: "巽", palace: "巽", judgment: "元亨，利涉大川。先甲三日，后甲三日。", gist: "积弊待治，宜整饬革新，事前事后都要审慎。" },
  { number: 19, name: "临", upper: "坤", lower: "兑", palace: "坤", judgment: "元亨利贞。至于八月有凶。", gist: "居高临下，声势渐盛，但盛极须防转衰。" },
  { number: 20, name: "观", upper: "巽", lower: "坤", palace: "乾", judgment: "盥而不荐，有孚颙若。", gist: "观察与被观察，宜以德示人，诚敬为上。" },
  { number: 21, name: "噬嗑", upper: "离", lower: "震", palace: "巽", judgment: "亨。利用狱。", gist: "如齿咬合，宜明断是非、除去阻碍。" },
  { number: 22, name: "贲", upper: "艮", lower: "离", palace: "艮", judgment: "亨。小利有攸往。", gist: "文饰之美，可亨通，但只宜小有作为。" },
  { number: 23, name: "剥", upper: "艮", lower: "坤", palace: "乾", judgment: "不利有攸往。", gist: "剥落衰败之象，不宜有所前往，宜静守。" },
  { number: 24, name: "复", upper: "坤", lower: "震", palace: "坤", judgment: "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。", gist: "一阳来复，转机初现，宜顺势而返。" },
  { number: 25, name: "无妄", upper: "乾", lower: "震", palace: "巽", judgment: "元亨利贞。其匪正有眚，不利有攸往。", gist: "不妄为则大通，若存邪念反受灾祸。" },
  { number: 26, name: "大畜", upper: "艮", lower: "乾", palace: "艮", judgment: "利贞，不家食吉，利涉大川。", gist: "大有蓄积，宜养贤用才，可涉大险。" },
  { number: 27, name: "颐", upper: "艮", lower: "震", palace: "巽", judgment: "贞吉。观颐，自求口实。", gist: "颐养之道，守正则吉，须自食其力。" },
  { number: 28, name: "大过", upper: "兑", lower: "巽", palace: "震", judgment: "栋桡，利有攸往，亨。", gist: "阳盛过甚如栋梁弯曲，宜有所行动以求通。" },
  { number: 29, name: "坎", upper: "坎", lower: "坎", palace: "坎", judgment: "习坎，有孚，维心亨，行有尚。", gist: "重重险陷，唯以诚信与定心方能通行。" },
  { number: 30, name: "离", upper: "离", lower: "离", palace: "离", judgment: "利贞，亨。畜牝牛，吉。", gist: "光明相续，守正则亨，宜柔顺自处。" },
  { number: 31, name: "咸", upper: "兑", lower: "艮", palace: "兑", judgment: "亨，利贞。取女吉。", gist: "交感相应，守正则亨，婚娶之事吉。" },
  { number: 32, name: "恒", upper: "震", lower: "巽", palace: "震", judgment: "亨，无咎，利贞。利有攸往。", gist: "恒久之道，守常不变则无咎。" },
  { number: 33, name: "遁", upper: "乾", lower: "艮", palace: "乾", judgment: "亨，小利贞。", gist: "宜退避隐遁，退得其时则亨。" },
  { number: 34, name: "大壮", upper: "震", lower: "乾", palace: "坤", judgment: "利贞。", gist: "阳刚壮盛，但须守正，不可恃强。" },
  { number: 35, name: "晋", upper: "离", lower: "坤", palace: "乾", judgment: "康侯用锡马蕃庶，昼日三接。", gist: "如日出地上，晋升进取，受赏获宠。" },
  { number: 36, name: "明夷", upper: "坤", lower: "离", palace: "坎", judgment: "利艰贞。", gist: "光明受伤，宜韬光养晦，艰难中守正。" },
  { number: 37, name: "家人", upper: "巽", lower: "离", palace: "巽", judgment: "利女贞。", gist: "治家之道，各守其位，宜以内正为本。" },
  { number: 38, name: "睽", upper: "离", lower: "兑", palace: "艮", judgment: "小事吉。", gist: "乖离相背，大事难成，小事尚可。" },
  { number: 39, name: "蹇", upper: "坎", lower: "艮", palace: "兑", judgment: "利西南，不利东北。利见大人，贞吉。", gist: "行路艰险，宜求援于贤者，不宜强行。" },
  { number: 40, name: "解", upper: "震", lower: "坎", palace: "震", judgment: "利西南。无所往，其来复吉。有攸往，夙吉。", gist: "险难消解，宜及早行动，不宜拖延。" },
  { number: 41, name: "损", upper: "艮", lower: "兑", palace: "艮", judgment: "有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。", gist: "损下益上，有诚信则大吉，简约也可成事。" },
  { number: 42, name: "益", upper: "巽", lower: "震", palace: "巽", judgment: "利有攸往，利涉大川。", gist: "损上益下，宜积极前往，可涉大险。" },
  { number: 43, name: "夬", upper: "兑", lower: "乾", palace: "坤", judgment: "扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。", gist: "决断清除，宜公开申明，不宜诉诸武力。" },
  { number: 44, name: "姤", upper: "乾", lower: "巽", palace: "乾", judgment: "女壮，勿用取女。", gist: "不期而遇，阴气渐盛，宜防微杜渐。" },
  { number: 45, name: "萃", upper: "兑", lower: "坤", palace: "兑", judgment: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。", gist: "荟萃聚集，宜见贤者、宜守正前往。" },
  { number: 46, name: "升", upper: "坤", lower: "巽", palace: "震", judgment: "元亨，用见大人，勿恤，南征吉。", gist: "如木生地中，逐步上升，前进则吉。" },
  { number: 47, name: "困", upper: "兑", lower: "坎", palace: "兑", judgment: "亨，贞，大人吉，无咎。有言不信。", gist: "困顿受制，唯君子能处困而不失其正。" },
  { number: 48, name: "井", upper: "坎", lower: "巽", palace: "震", judgment: "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。", gist: "井养不穷，重在恒常与善用，功亏一篑则凶。" },
  { number: 49, name: "革", upper: "兑", lower: "离", palace: "坎", judgment: "己日乃孚，元亨利贞，悔亡。", gist: "变革须待时机成熟，取信于人则大通。" },
  { number: 50, name: "鼎", upper: "离", lower: "巽", palace: "离", judgment: "元吉，亨。", gist: "鼎新之象，成器致养，大为吉祥。" },
  { number: 51, name: "震", upper: "震", lower: "震", palace: "震", judgment: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。", gist: "震动惊惧，能处变不惊者反得亨通。" },
  { number: 52, name: "艮", upper: "艮", lower: "艮", palace: "艮", judgment: "艮其背，不获其身。行其庭，不见其人，无咎。", gist: "当止则止，止于所当止则无咎。" },
  { number: 53, name: "渐", upper: "巽", lower: "艮", palace: "艮", judgment: "女归吉，利贞。", gist: "循序渐进而吉，如女子出嫁，循礼则利。" },
  { number: 54, name: "归妹", upper: "震", lower: "兑", palace: "兑", judgment: "征凶，无攸利。", gist: "躁进失序，前行有凶，无所利益。" },
  { number: 55, name: "丰", upper: "震", lower: "离", palace: "坎", judgment: "亨，王假之，勿忧，宜日中。", gist: "丰大盈满，宜趁盛时行事，勿忧疑。" },
  { number: 56, name: "旅", upper: "离", lower: "艮", palace: "离", judgment: "小亨，旅贞吉。", gist: "羁旅在外，小有亨通，守正乃吉。" },
  { number: 57, name: "巽", upper: "巽", lower: "巽", palace: "巽", judgment: "小亨，利有攸往，利见大人。", gist: "顺时入微，小有亨通，宜见贤者。" },
  { number: 58, name: "兑", upper: "兑", lower: "兑", palace: "兑", judgment: "亨，利贞。", gist: "和悦相说，守正则亨。" },
  { number: 59, name: "涣", upper: "巽", lower: "坎", palace: "离", judgment: "亨。王假有庙，利涉大川，利贞。", gist: "涣散离析，宜聚人心、宜涉险以济难。" },
  { number: 60, name: "节", upper: "坎", lower: "兑", palace: "坎", judgment: "亨。苦节不可贞。", gist: "节制有度则亨，过分苦守则不可久。" },
  { number: 61, name: "中孚", upper: "巽", lower: "兑", palace: "艮", judgment: "豚鱼吉，利涉大川，利贞。", gist: "中心诚信，可感豚鱼，宜涉大险。" },
  { number: 62, name: "小过", upper: "震", lower: "艮", palace: "兑", judgment: "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。", gist: "稍有过越，只宜小事，宜下不宜上。" },
  { number: 63, name: "既济", upper: "坎", lower: "离", palace: "坎", judgment: "亨，小利贞。初吉终乱。", gist: "事已成，起初吉顺，但须防终局生变。" },
  { number: 64, name: "未济", upper: "离", lower: "坎", palace: "离", judgment: "亨。小狐汔济，濡其尾，无攸利。", gist: "事未成，尚须努力，慎防功败垂成。" },
];

/** 上卦 + 下卦 → 卦。 */
export const byTrigrams = new Map<string, Hexagram>(
  HEXAGRAMS.map((h) => [`${h.upper}${h.lower}`, h]),
);
