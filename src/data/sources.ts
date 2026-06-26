import type { PlaybackSource } from "./types";

/**
 * 再生音源の定義。
 *
 * 新しい動画・音声を追加するときは、ここに PlaybackSource を足すだけ。
 * timings（行ごとの開始秒）は /capture/<音源ID> の作成ツールで実測し、
 * 出力された JSON をその音源の timings に貼り付ける。
 */
export const sources: PlaybackSource[] = [
  // ===== 基準動画（YouTube） =====
  // 第3次同期（DTW + Whisper ハイブリッド）:
  //   旧版はOCR first_t（画面初出時刻）を採用していたが、これは実際の読誦オンセット
  //   より数秒早く、累積誤差で最後には方便品 -20s / 自我偈 -37s ずれていた。
  //   今回は Whisper 認識セグメントの開始時刻を優先採用、Whisperで認識できなかった
  //   句は TTS-DTW（espeak合成 vs 実音声のサブシーケンスDTW）で補間。
  //
  // 入力データ:
  //   - 音源: .cache/_oN7QCtk3lk.16k.wav (16kHz mono, 1138s)
  //   - Whisper: .cache/_oN7QCtk3lk.whisper.json (large-v3, ja)
  //   - DTW: .cache/_oN7QCtk3lk.dtw_hobenpon_full.json
  //          .cache/_oN7QCtk3lk.dtw_jigage_full.json
  //   - クロス検証: scripts/cross_align_v3.py
  //
  // 修正前後の差（累積誤差解消）:
  //   - 方便品 h1:  185.0 → 185.3 (+0.3s)
  //   - 方便品 h25: 357.0 → 371.5 (+14.5s)
  //   - 自我偈 j1:  396.6 → 396.6 (±0s)
  //   - 自我偈 j26: 643.0 → 672.4 (+29.4s)
  //
  // 各行末コメント:
  //   W = Whisper セグメント開始時刻を直接採用
  //   D = TTS-DTW 結果（Whisper が認識できなかった行の補間）
  {
    id: "kingyo19",
    title: "朝夕の勤行（19分）",
    subtitle: "【日蓮宗】方便品・自我偈",
    kind: "youtube",
    youtubeId: "_oN7QCtk3lk",
    sutraIds: ["hobenpon", "jigage"],
    timings: [
      // ---- 方便品 長行 (h1-h6, h10-h19) ----
      { lineId: "h1",  start: 185.3 }, // W にじせそんじゅうさんまいあんじょうにち
      { lineId: "h2",  start: 191.2 }, // W 諸仏智慧
      { lineId: "h3",  start: 201.3 }, // W 一切諸文訳(声聞)
      { lineId: "h4",  start: 207.0 }, // W 生為者が仏像(所以者何 仏曾)
      { lineId: "h5",  start: 219.2 }, // D 215-249s Whisper誤検出区間のためDTW
      { lineId: "h6",  start: 224.5 }, // D 同上
      { lineId: "h10", start: 232.8 }, // D 同上
      { lineId: "h11", start: 241.7 }, // D 同上
      { lineId: "h12", start: 249.6 }, // W 弱小医者は如来方便知見
      { lineId: "h13", start: 257.0 }, // W あらみつかいぐそ→如来知見
      { lineId: "h14", start: 267.1 }, // W 小医全上下(力 無所畏 禅定)
      { lineId: "h15", start: 272.0 }, // W 三枚陣入無最上(深入無際)
      { lineId: "h16", start: 277.7 }, // W ハリオツニョライノシュジュウ
      { lineId: "h17", start: 288.0 }, // W シャリオツシュヨゴンシ
      { lineId: "h18", start: 297.0 }, // W くりょうむへんみぞうむお→しゃりほつしゅうぶせ
      { lineId: "h19", start: 309.5 }, // W ゆい仏よ仏内(唯仏与仏)
      // ---- 方便品 十如是 1回目 (h7-h9) ----
      { lineId: "h7",  start: 316.0 }, // W 生意生法如是相(所謂諸法 如是相)
      { lineId: "h8",  start: 322.0 }, // W 事如是作(如是作)
      { lineId: "h9",  start: 327.0 }, // W 如是法如是本末(如是果...本末)
      // ---- 方便品 十如是 2回目 (h20-h22) ----
      { lineId: "h20", start: 336.0 }, // W 生意生(所謂諸法 2回目)
      { lineId: "h21", start: 342.0 }, // W 大乳勢 総乳勢 小乳勢
      { lineId: "h22", start: 348.0 }, // W 本末 偶 強 等
      // ---- 方便品 十如是 3回目 (h23-h25) ----
      { lineId: "h23", start: 359.0 }, // W 大乃瀬 総乃瀬(所謂諸法 3回目)
      { lineId: "h24", start: 365.0 }, // W 理事乃瀬 左乃瀬
      { lineId: "h25", start: 371.5 }, // W 下乃瀬 大乃瀬 本末苦情と
      // ---- 自我偈 (j1-j26) ----
      { lineId: "j1",  start: 396.6 }, // W 自我、徳仏、来
      { lineId: "j2",  start: 408.4 }, // W 二乗、世法
      { lineId: "j3",  start: 419.0 }, // W 異道修行行(為度衆生)
      { lineId: "j4",  start: 431.0 }, // W 精進ず理事(我常住於此)
      { lineId: "j5",  start: 436.3 }, // W 御殿堂衆生水厳(衆見我滅度)
      { lineId: "j6",  start: 451.0 }, // W 正月御神衆生地心腹(衆生既信伏)
      { lineId: "j7",  start: 464.5 }, // W おやじゅうしゅうそぐ(時我及衆僧)
      { lineId: "j8",  start: 474.0 }, // W いほべんりきこ(以方便力故)
      { lineId: "j9",  start: 486.0 }, // W がぶおいちゅう(我復於彼中)
      { lineId: "j10", start: 496.0 }, // W 麻犬諸衆情(我見諸衆生)
      { lineId: "j11", start: 507.0 }, // W 銀河新連邦(因其心恋慕)
      { lineId: "j12", start: 517.0 }, // W 大麻草寺古城(常在霊鷲山)
      { lineId: "j13", start: 529.0 }, // W いとあんのん(我此土安穏)
      { lineId: "j14", start: 540.0 }, // D Whisper境界曖昧のためDTW
      { lineId: "j15", start: 551.0 }, // W すまんならじぇさんぶつじゅだいしゅ
      { lineId: "j16", start: 561.0 }, // W うふしょくのにょぜすじゅまん
      { lineId: "j17", start: 572.0 }, // W あそじこ(過阿僧祇劫)
      { lineId: "j18", start: 583.0 }, // W 即戒犬が身(則皆見我身)
      { lineId: "j19", start: 593.0 }, // W 苦大賢武者(久乃見仏者)
      { lineId: "j20", start: 604.0 }, // W すみょむしゅこく(寿命無数劫)
      { lineId: "j21", start: 617.0 }, // W しょうじとだんびょよ(当断令永尽)
      { lineId: "j22", start: 631.0 }, // W 実在に渾身のせこも(実在而言死)
      { lineId: "j23", start: 642.0 }, // W 異本不転倒(為凡夫顛倒)
      { lineId: "j24", start: 650.0 }, // W 諸女子心法逸弱暴力(放逸著五欲)
      { lineId: "j25", start: 656.0 }, // W ずいおしょうがど(随応所可度)
      { lineId: "j26", start: 672.4 }, // W とくにゅうむじょうど(得入無上道)
    ],
  },

  // ===== ローカル音声（同期デモ用・無音プレースホルダー） =====
  // start 値は仮。同期UIの動作確認用。実音源に差し替えたら実測し直すこと。
  {
    id: "hobenpon-local",
    title: "方便品（デモ音声）",
    subtitle: "同期UIデモ用・無音",
    kind: "audio",
    audioUrl: "/audio/hobenpon.wav",
    sutraIds: ["hobenpon"],
    // 表示順に等間隔のダミーstart（再生時間: 約3分）。
    timings: (() => {
      // hobenpon.ts と同じ表示順
      const order = [
        "h1","h2","h3","h4","h5","h6",
        "h10","h11","h12","h13","h14","h15","h16","h17","h18","h19",
        "h7","h8","h9",      // 十如是 1回目
        "h20","h21","h22",   // 十如是 2回目
        "h23","h24","h25",   // 十如是 3回目
      ];
      return order.map((id, i) => ({ lineId: id, start: i * 8 }));
    })(),
  },
  {
    id: "jigage-local",
    title: "自我偈（デモ音声）",
    subtitle: "同期UIデモ用・無音",
    kind: "audio",
    audioUrl: "/audio/jigage.wav",
    sutraIds: ["jigage"],
    timings: Array.from({ length: 26 }, (_, i) => ({
      lineId: `j${i + 1}`,
      start: i * 9,
    })),
  },
];

export function getSource(id: string): PlaybackSource | undefined {
  return sources.find((s) => s.id === id);
}
