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
    subtitle: "【日蓮宗】開経偈・方便品・自我偈",
    kind: "youtube",
    youtubeId: "_oN7QCtk3lk",
    sutraIds: ["kaikyoge", "hobenpon", "jigage", "daimoku", "ekomon-chogyo"],
    timings: [
      // ---- 開経偈（標準4行 + 延偈10行 = 計14行） ----
      // タイミング: Whisper large-v3 セグメント開始時刻
      // 動画フレームOCRで ±1-2s 以内を確認済み（ffmpeg 1fps フレーム抽出）
      // 字幕本文は動画焼き込み字幕の日本語表記に準拠
      //
      // 標準4行（開経偈 本文）
      { lineId: "k1",  start:  87.1 }, // W 無上甚深微妙の法は、
      { lineId: "k2",  start: 100.8 }, // W 百千万劫にも 遇いたてまつること難し。
      { lineId: "k3",  start: 106.8 }, // W 我れ今見聞し 受持することを得たり。
      { lineId: "k4",  start: 112.6 }, // W 願わくは如来の 第一義を解せん。
      // 延偈10行（動画フレームOCRで確認。118-173秒区間）
      { lineId: "k5",  start: 118.1 }, // W 至極の大乗 思議すべからず。
      { lineId: "k6",  start: 122.2 }, // W 見聞触知 皆菩提に近づく。
      { lineId: "k7",  start: 126.8 }, // W 能詮は報身 所詮は法身。
      { lineId: "k8",  start: 132.2 }, // W 色相の文字は 即ち是れ応身なり。
      { lineId: "k9",  start: 137.3 }, // W 無量の功徳 皆この経に集まれり。
      { lineId: "k10", start: 143.0 }, // W 是の故に自在に、冥に薫じ密に益す。
      { lineId: "k11", start: 149.5 }, // W 有智無智 非を滅し善を生ず。
      { lineId: "k12", start: 154.3 }, // W 若は信、若は謗 共に佛道を成ぜん。
      { lineId: "k13", start: 160.6 }, // W 三世の諸佛 甚深の妙典なり。
      { lineId: "k14", start: 166.1 }, // W 生生世世 値遇し頂戴せん。
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
      // ---- 題目（唱題） ----
      // タイミング: Whisper large-v3 音声オンセット
      // フレームOCR確認: 740s付近で【唱題】マーカー(P64) + 「南無妙法蓮華経を 心ゆくまで お唱えします」
      // 動画は唱題区間全体で静的テキスト表示（行ごとの字幕切り替えなし）
      { lineId: "d1",  start: 728.3 }, // W 唱題開始（南無妙法蓮華経）
      // ---- 回向文（朝夕勤行）ec1-ec39 ----
      // タイミング: Whisper large-v3 セグメント開始時刻（W）+ フレーム表示時刻推定（D）
      // 動画フレームOCR確認済み（_oN7QCtk3lk 950-1044s, 1fps, P67-P70）
      { lineId: "ec1",  start:  952.5 }, // W ご宝前に於いて
      { lineId: "ec2",  start:  954.5 }, // D 心から妙法蓮華経と
      { lineId: "ec3",  start:  956.5 }, // D 大聖人のお言葉を
      { lineId: "ec4",  start:  960.0 }, // D 拝読し
      { lineId: "ec5",  start:  963.9 }, // W お題目を
      { lineId: "ec6",  start:  965.5 }, // D お唱えした功徳を
      { lineId: "ec7",  start:  967.5 }, // D 大曼茶羅勧請の
      { lineId: "ec8",  start:  969.5 }, // D 諸尊に捧げ
      { lineId: "ec9",  start:  972.5 }, // W 末法の導師
      { lineId: "ec10", start:  975.0 }, // D 日蓮大聖人始め
      { lineId: "ec11", start:  976.5 }, // D 法華経の行者に
      { lineId: "ec12", start:  978.5 }, // D 回向します
      { lineId: "ec13", start:  981.8 }, // W 仰ぎ祈らくは
      { lineId: "ec14", start:  983.5 }, // D 仏様の
      { lineId: "ec15", start:  985.0 }, // D 大慈悲に依り
      { lineId: "ec16", start:  989.0 }, // W 世界平和 国土安穏
      { lineId: "ec17", start:  991.5 }, // D 万民の心が
      { lineId: "ec18", start:  993.5 }, // D 安らかで
      { lineId: "ec19", start:  995.5 }, // D あります様に
      { lineId: "ec20", start:  997.3 }, // W さらには
      { lineId: "ec21", start:  999.5 }, // D 全ての皆々が
      { lineId: "ec22", start: 1001.9 }, // W はるか昔からの
      { lineId: "ec23", start: 1003.5 }, // D 罪を懺悔し
      { lineId: "ec24", start: 1005.7 }, // W 罪障を消滅し
      { lineId: "ec25", start: 1009.1 }, // W 信心に励み
      { lineId: "ec26", start: 1011.6 }, // W そして
      { lineId: "ec27", start: 1013.0 }, // D 健康で過ごせます様に
      { lineId: "ec28", start: 1015.3 }, // W また
      { lineId: "ec29", start: 1017.0 }, // D 当家の先祖代々の諸霊位
      { lineId: "ec30", start: 1021.1 }, // W そして
      { lineId: "ec31", start: 1023.0 }, // D 有縁無縁の諸霊位を
      { lineId: "ec32", start: 1025.5 }, // D 供養します
      { lineId: "ec33", start: 1027.4 }, // W 願わくば
      { lineId: "ec34", start: 1030.0 }, // D この功徳を以て
      { lineId: "ec35", start: 1032.2 }, // W 普く一切に及ぼし
      { lineId: "ec36", start: 1035.3 }, // W 我等と衆生と
      { lineId: "ec37", start: 1037.5 }, // D 皆共に仏道を
      { lineId: "ec38", start: 1040.0 }, // D 成ぜんことを
      { lineId: "ec39", start: 1043.2 }, // W 南無妙法蓮華経
    ],
  },

  // ===== 宝塔偈専用動画（YouTube） =====
  // Ground Truth:
  //   動画: ゆっくり読む日蓮宗のお経【15分バージョン】（長崎県日蓮宗青年会）
  //   YouTube ID: XivPWmWJO2c  Views: 271,296  教化センター九州経本使用
  //   宝塔偈セクション: 12:34〜13:32（動画内 754s〜812s）
  //   採用理由: 公式組織制作、縦書き経本テキスト（ルビ付き・OCR高品質）、1920x1080
  //
  // 同期方法: OCRフレーム表示時刻（[D]）
  //   Whisper large-v3 は高速読誦形式に非対応（"お祈りします"のみ出力）のため
  //   全タイミングは 1fps フレーム抽出 + Vision OCR による表示時刻から算出。
  //   clip_start = 12:30 = 750s。video_time = 750 + (frame_number - 1)。
  //   各ペア（2行）の右列=奇数行（先行）、左列=偶数行（後続、+2〜2.5s）。
  {
    id: "kyushu-hotoge",
    title: "ゆっくり読む日蓮宗のお経【15分バージョン】",
    subtitle: "長崎県日蓮宗青年会 - 宝塔偈",
    kind: "youtube",
    youtubeId: "XivPWmWJO2c",
    sutraIds: ["hotoge"],
    timings: [
      // ---- 宝塔偈 ht1-ht24 ----
      // Page1: f0016=765s 〜 f0032 (ht1-ht8)
      { lineId: "ht1",  start: 765.0 }, // D f0016 此経難持（右列）
      { lineId: "ht2",  start: 767.0 }, // D f0016 若暫持者（左列）
      { lineId: "ht3",  start: 768.0 }, // D f0019 我即歓喜（右列）
      { lineId: "ht4",  start: 770.5 }, // D f0019 諸仏亦然（左列）
      { lineId: "ht5",  start: 773.0 }, // D f0024 如是之人（右列）
      { lineId: "ht6",  start: 775.5 }, // D f0024 諸仏所歎（左列）
      { lineId: "ht7",  start: 778.0 }, // D f0029 是則勇猛（右列）
      { lineId: "ht8",  start: 780.0 }, // D f0029 是則精進（左列）
      // Page2: f0033=782s 〜 f0049 (ht9-ht16)
      { lineId: "ht9",  start: 782.0 }, // D f0033 是名持戒（右列・ページリセット）
      { lineId: "ht10", start: 784.0 }, // D f0033 行頭陀者（左列）
      { lineId: "ht11", start: 786.0 }, // D f0037 即為疾得（右列）
      { lineId: "ht12", start: 788.0 }, // D f0037 無上仏道（左列）
      { lineId: "ht13", start: 790.0 }, // D f0041 能於来世（右列）
      { lineId: "ht14", start: 792.5 }, // D f0041 読持此経（左列）
      { lineId: "ht15", start: 795.0 }, // D f0046 是真仏子（右列）
      { lineId: "ht16", start: 797.0 }, // D f0046 住淳善地（左列）
      // Page3: f0050=799s 〜 f0070 (ht17-ht24)
      { lineId: "ht17", start: 799.0 }, // D f0050 仏滅度後（右列・ページリセット）
      { lineId: "ht18", start: 801.5 }, // D f0050 能解其義（左列）
      { lineId: "ht19", start: 804.0 }, // D f0055 是諸天人（右列）
      { lineId: "ht20", start: 806.5 }, // D f0055 世間之眼（左列）
      { lineId: "ht21", start: 809.0 }, // D f0060 於恐畏世（右列）
      { lineId: "ht22", start: 811.0 }, // D f0060 能須臾説（左列）
      { lineId: "ht23", start: 813.0 }, // D f0064 一切天人（右列）
      { lineId: "ht24", start: 816.0 }, // D f0064 皆応供養（左列）
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
