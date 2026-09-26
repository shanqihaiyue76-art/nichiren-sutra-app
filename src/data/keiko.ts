/**
 * 稽古の心得（2026-09-23 本堂での稽古で、先生・兄から教わったこと）。
 *
 * 目的は度牒交付式に向けた方便品・寿量品（自我偈）の練習。
 * 出典は稽古の録画（IMG_6471.MOV・約40分）の文字起こし。聞き取りに自信が
 * 持てなかった箇所は載せていない（誤った作法をそのまま覚えさせないため）。
 * `at` は録画内の時刻。`measured` は先生の言葉ではなく、録音から測った値。
 *
 * 音源とタイミングは sources.ts の keiko-hobenpon / keiko-jigage。
 */

export interface KeikoPoint {
  text: string;
  /** 補足（任意） */
  note?: string;
  /** 稽古録画での時刻（例 "7:30"） */
  at?: string;
  /** 先生の言葉ではなく、録音から測った値 */
  measured?: boolean;
}

/** 再生画面で、特定の行に添える注意書き */
export interface KeikoCue {
  lineId: string;
  label: string;
}

export interface KeikoGuide {
  /** 内容層の経文ID */
  sutraId: string;
  /** 先生の読経の音源ID（sources.ts） */
  sourceId: string;
  /** 呼び名 */
  name: string;
  /** 稽古で読んだ範囲 */
  scope: string;
  points: KeikoPoint[];
  cues: KeikoCue[];
}

export const keikoMeta = {
  purpose: "度牒交付式",
  date: "2026-09-23",
  place: "本堂での稽古",
  teachers: "先生・兄",
};

/** 読経の前に（準備） */
export const keikoPreparation: KeikoPoint[] = [
  {
    text: "座ったら礼拝する。始まりの挨拶で、ここからはもう喋らないという区切り。",
    at: "1:05",
  },
  {
    text: "鐘を3つ打って「これで始まる」と知らせる。",
    at: "1:20",
  },
  {
    text: "見台が使いにくいときは経本を手に持つ。下から持つと肘が締まり、経本が下を向かない。",
    at: "4:55",
  },
  {
    text: "合掌は、中指の先を喉の高さに。親指の関節のあたりを胸につけ、脇を締めて手を前に出さない。",
    at: "22:50",
  },
  {
    text: "数珠は、房が3本の側を左手、2本の側を右手にかける。",
    at: "23:40",
  },
];

/** 覚え方 */
export const keikoMemorize: KeikoPoint[] = [
  {
    text: "方便品と寿量品は、振り仮名のない経本で読めるのが目標。お坊さんとしての初歩。",
    at: "6:15",
  },
  {
    text: "覚え方はギターと同じ。最初は楽譜（経本）を見ながら、慣れたら音を思い出しながら目で字を追う。",
    at: "18:50",
  },
  {
    text: "訓読は、信行道場に行く前までに頭に入れておく。",
    at: "18:15",
  },
];

export const keikoGuides: KeikoGuide[] = [
  {
    sutraId: "hobenpon",
    sourceId: "keiko-hobenpon",
    name: "方便品",
    scope: "冒頭「爾時世尊」から十如是まで（十如是は3回）",
    points: [
      { text: "木鉦1打に1字が基本。", at: "7:30" },
      {
        text: "「舎利弗」「知見波羅蜜」のところだけは2字で1打。",
        note: "どの2字をまとめるかは、先生の読経を聞いて確かめる。",
        at: "7:40",
      },
      {
        text: "十如是（所謂諸法 如是相 … 如是本末究竟等）は3回繰り返す。",
        at: "11:35",
      },
      {
        text: "先生の木鉦は1分に約115打（1字およそ0.5秒）。",
        measured: true,
      },
    ],
    cues: [
      { lineId: "h1", label: "舎利弗は2字で1打" },
      { lineId: "h10", label: "舎利弗は2字で1打" },
      { lineId: "h12", label: "知見波羅蜜は2字で1打" },
      { lineId: "h13", label: "舎利弗は2字で1打" },
      { lineId: "h16", label: "舎利弗は2字で1打" },
      { lineId: "h17", label: "舎利弗は2字で1打" },
      { lineId: "h18", label: "舎利弗は2字で1打" },
      { lineId: "h7", label: "十如是 1回目（3回繰り返す）" },
      { lineId: "h20", label: "十如是 2回目" },
      { lineId: "h23", label: "十如是 3回目" },
    ],
  },
  {
    sutraId: "jigage",
    sourceId: "keiko-jigage",
    name: "寿量品（自我偈）",
    scope: "経題のあと「自我得仏来」から「速成就仏身」まで（長行は読まない）",
    points: [
      { text: "普通に読めばよい。", at: "12:05" },
      { text: "一人で読むときは、木鉦と鐘も自分で鳴らす。", at: "17:05" },
      { text: "鐘は始めに3つ（1行ほど読んだところで）。", at: "17:15" },
      {
        text: "終わりから4句目の「毎自作是念」で鐘を1つ。ここから速度を落とす合図。",
        at: "17:30",
      },
      {
        text: "最後の「速成就仏身」で鐘をもう1つ。ここで止める合図。",
        at: "17:55",
      },
      {
        text: "先生の木鉦は1分に約115打。最後の2句で大きくゆっくりになる。",
        measured: true,
      },
    ],
    cues: [
      { lineId: "j1", label: "1行ほど読んだら鐘を3つ（一人のとき）" },
      { lineId: "j25", label: "「毎自作是念」で鐘1つ：ここから速度を落とす" },
      { lineId: "j26", label: "「速成就仏身」で鐘1つ：ここで止める" },
    ],
  },
];

export function getKeikoGuideBySource(sourceId: string): KeikoGuide | undefined {
  return keikoGuides.find((g) => g.sourceId === sourceId);
}

export function getKeikoGuideBySutra(sutraId: string): KeikoGuide | undefined {
  return keikoGuides.find((g) => g.sutraId === sutraId);
}

export function isKeikoSource(sourceId: string): boolean {
  return keikoGuides.some((g) => g.sourceId === sourceId);
}
