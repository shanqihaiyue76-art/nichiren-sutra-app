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
    displayTitle: "朝夕の勤行",
    title: "朝夕の勤行（19分）",
    subtitle: "【日蓮宗】開経偈・方便品・自我偈",
    kind: "youtube",
    youtubeId: "_oN7QCtk3lk",
    sutraIds: ["kaikyoge", "hobenpon", "jigage", "daimoku", "ekomon-chogyo", "shishi"],
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
      // タイミング: 動画字幕OCR表示時刻（D=OCRアンカー / I=アンカー間線形補間）
      // 【注意】旧実装はWhisper音声オンセット（W）を使用していたが、
      //   この動画では字幕が音声より1.5〜4.2s先行して表示されるため
      //   「目視で一致」基準に反していた。OCR字幕表示時刻に全面改訂。
      // OCRアンカー一覧（.cache/ekomon_frames/ 1fps, 基準時刻=950+N-1秒）:
      //   ec4=958s(f0009) ec6=964s(f0015) ec7=966s(f0017) ec8=969s(f0020)
      //   ec9=971s(f0022) ec10=974s(f0025) ec11=976s(f0027) ec13=982s(f0033)
      //   ec17=989s(f0040) ec20=996s(f0047) ec24=1004s(f0055) ec27=1012s(f0063)
      //   ec30=1019s(f0070) ec35=1029s(f0080) ec39=1039s(f0090)
      { lineId: "ec1",  start:  954.0 }, // I (ec4=958の3行前、~2s/行)
      { lineId: "ec2",  start:  955.0 }, // I
      { lineId: "ec3",  start:  957.0 }, // I
      { lineId: "ec4",  start:  958.0 }, // D f0009
      { lineId: "ec5",  start:  963.5 }, // I (ec4=958〜ec6=964)
      { lineId: "ec6",  start:  964.0 }, // D f0015
      { lineId: "ec7",  start:  966.0 }, // D f0017
      { lineId: "ec8",  start:  969.0 }, // D f0020
      { lineId: "ec9",  start:  971.0 }, // D f0022
      { lineId: "ec10", start:  974.0 }, // D f0025
      { lineId: "ec11", start:  976.0 }, // D f0027
      { lineId: "ec12", start:  979.0 }, // I (ec11=976〜ec13=982)
      { lineId: "ec13", start:  982.0 }, // D f0033
      { lineId: "ec14", start:  983.7 }, // I (ec13=982〜ec17=989)
      { lineId: "ec15", start:  985.4 }, // I
      { lineId: "ec16", start:  987.1 }, // I
      { lineId: "ec17", start:  989.0 }, // D f0040
      { lineId: "ec18", start:  991.3 }, // I (ec17=989〜ec20=996)
      { lineId: "ec19", start:  993.7 }, // I
      { lineId: "ec20", start:  996.0 }, // D f0047
      { lineId: "ec21", start:  998.0 }, // I (ec20=996〜ec24=1004)
      { lineId: "ec22", start: 1000.0 }, // I
      { lineId: "ec23", start: 1002.0 }, // I
      { lineId: "ec24", start: 1004.0 }, // D f0055
      { lineId: "ec25", start: 1006.7 }, // I (ec24=1004〜ec27=1012)
      { lineId: "ec26", start: 1009.3 }, // I
      { lineId: "ec27", start: 1012.0 }, // D f0063
      { lineId: "ec28", start: 1014.3 }, // I (ec27=1012〜ec30=1019)
      { lineId: "ec29", start: 1016.7 }, // I
      { lineId: "ec30", start: 1019.0 }, // D f0070
      { lineId: "ec31", start: 1021.0 }, // I (ec30=1019〜ec35=1029)
      { lineId: "ec32", start: 1023.0 }, // I
      { lineId: "ec33", start: 1025.0 }, // I
      { lineId: "ec34", start: 1027.0 }, // I
      { lineId: "ec35", start: 1029.0 }, // D f0080
      { lineId: "ec36", start: 1031.5 }, // I (ec35=1029〜ec39=1039)
      { lineId: "ec37", start: 1034.0 }, // I
      { lineId: "ec38", start: 1036.5 }, // I
      { lineId: "ec39", start: 1039.0 }, // D f0090
      // ---- 四誓（四弘誓願 三唱）ss1-ss4 ----
      // タイミング: OCRフレーム表示時刻（[D]）三唱の第2回唱表示開始時刻
      // フレーム抽出: 1048s起点 1fps, f0015-f0030
      // 動画表記: 煩悩無数誓願断（標準:無量）・法門無尽誓願知（標準:学）
      { lineId: "ss1", start: 1062.0 }, // D f0015 衆生無辺誓願度
      { lineId: "ss2", start: 1065.0 }, // D f0018 煩悩無数誓願断
      { lineId: "ss3", start: 1070.0 }, // D f0023 法門無尽誓願知
      { lineId: "ss4", start: 1073.0 }, // D f0026 仏道無上誓願成
    ],
  },

  // ===== 神力偈専用動画（YouTube） =====
  // Ground Truth: 【お経練習・字幕有り】妙法蓮華経如来神力品第二十一 神力偈
  // YouTube ID: 26UL4RmM0hY  チャンネル: 見法寺法務チャンネル（日蓮宗）  収録: 239s
  // 採用理由: 字幕焼き込み・練習用字幕動画・OCR可能・フレームOCR13点確認済み
  // ※旧動画 I9KKyj0BDOI は字幕なし（タイトルカード固定）のため廃止
  //
  // 同期方法: 1fps フレーム抽出 + Vision OCR → .cache/jinriki2_frames/
  //   表示形式: 2句並列静止（2句同時白表示・色変化なし）
  //   タイトルカード: ~17s（f0017=妙法蓮華経 如来神力品 第二十一）
  //   偈頌開始: 20s（f0020=jr1+jr2）
  //
  // OCR確認アンカー（13フレーム×完全一致）:
  //   f0020(20s)=jr1+jr2  f0030(30s)=jr3+jr4  f0040(40s)=jr7+jr8
  //   f0060(60s)=jr13+jr14  f0080(80s)=jr19+jr20  f0100(100s)=jr25+jr26
  //   f0120(120s)=jr31+jr32  f0140(140s)=jr37+jr38  f0160(160s)=jr43+jr44
  //   f0180(180s)=jr49+jr50  f0200(200s)=jr55+jr56  f0220(220s)=jr61+jr62
  //   f0230(230s)=jr63+jr64
  //
  // タイミング公式（完全均一）: jr_n = 20.0 + (n-1) × (10/3) s
  //   → 3.333s/句, 6.667s/2句ペア。全13アンカーで誤差ゼロ確認。
  //   各ペア（2句）は同時表示のため、句内タイミングは均等2分割で推定。
  {
    id: "jinriki-26UL4",
    displayTitle: "神力偈",
    title: "【お経練習・字幕有り】妙法蓮華経如来神力品第二十一 神力偈",
    subtitle: "見法寺法務チャンネル（日蓮宗）- 如来神力品第二十一 偈頌（神力偈）",
    kind: "youtube",
    youtubeId: "26UL4RmM0hY",
    sutraIds: ["jinrikige"],
    timings: [
      // ---- 神力偈 jr1-jr64 ----
      // タイミング: D=OCRアンカー（2句ペア開始）/ I=ペア内均等補間（3.333s/句）
      // ペア1: jr1+jr2  f0020(20s)=D
      { lineId: "jr1",  start:  20.0 }, // D f0020 諸仏救世者 ペア1開始
      { lineId: "jr2",  start:  23.3 }, // I 住於大神通
      // ペア2: jr3+jr4  f0030(30s)=D (26.7s開始、30s時点で確認)
      { lineId: "jr3",  start:  26.7 }, // D f0030 為悦衆生故 ペア2開始
      { lineId: "jr4",  start:  30.0 }, // I 現無量神力
      // ペア3: jr5+jr6
      { lineId: "jr5",  start:  33.3 }, // I 舌相至梵天 ペア3開始
      { lineId: "jr6",  start:  36.7 }, // I 身放無数光
      // ペア4: jr7+jr8  f0040(40s)=D (40.0s開始)
      { lineId: "jr7",  start:  40.0 }, // D f0040 為求仏道者 ペア4開始
      { lineId: "jr8",  start:  43.3 }, // I 現此希有事
      // ペア5: jr9+jr10
      { lineId: "jr9",  start:  46.7 }, // I 諸仏謦欬声 ペア5開始
      { lineId: "jr10", start:  50.0 }, // I 及弾指之声
      // ペア6: jr11+jr12
      { lineId: "jr11", start:  53.3 }, // I 周聞十方国 ペア6開始
      { lineId: "jr12", start:  56.7 }, // I 地皆六種動
      // ペア7: jr13+jr14  f0060(60s)=D (60.0s開始)
      { lineId: "jr13", start:  60.0 }, // D f0060 以仏滅度後 ペア7開始
      { lineId: "jr14", start:  63.3 }, // I 能持是経故
      // ペア8: jr15+jr16
      { lineId: "jr15", start:  66.7 }, // I 諸仏皆歓喜 ペア8開始
      { lineId: "jr16", start:  70.0 }, // I 現無量神力
      // ペア9: jr17+jr18
      { lineId: "jr17", start:  73.3 }, // I 嘱累是経故 ペア9開始
      { lineId: "jr18", start:  76.7 }, // I 讃美受持者
      // ペア10: jr19+jr20  f0080(80s)=D (80.0s開始)
      { lineId: "jr19", start:  80.0 }, // D f0080 於無量劫中 ペア10開始
      { lineId: "jr20", start:  83.3 }, // I 猶故不能尽
      // ペア11: jr21+jr22
      { lineId: "jr21", start:  86.7 }, // I 是人之功徳 ペア11開始
      { lineId: "jr22", start:  90.0 }, // I 無辺無有窮
      // ペア12: jr23+jr24
      { lineId: "jr23", start:  93.3 }, // I 如十方虚空 ペア12開始
      { lineId: "jr24", start:  96.7 }, // I 不可得辺際
      // ペア13: jr25+jr26  f0100(100s)=D (100.0s開始)
      { lineId: "jr25", start: 100.0 }, // D f0100 能持是経者 ペア13開始
      { lineId: "jr26", start: 103.3 }, // I 則為已見我
      // ペア14: jr27+jr28
      { lineId: "jr27", start: 106.7 }, // I 亦見多宝仏 ペア14開始
      { lineId: "jr28", start: 110.0 }, // I 及諸分身者
      // ペア15: jr29+jr30
      { lineId: "jr29", start: 113.3 }, // I 又見我今日 ペア15開始
      { lineId: "jr30", start: 116.7 }, // I 教化諸菩薩
      // ペア16: jr31+jr32  f0120(120s)=D (120.0s開始)
      { lineId: "jr31", start: 120.0 }, // D f0120 能持是経者 ペア16開始
      { lineId: "jr32", start: 123.3 }, // I 令我及分身
      // ペア17: jr33+jr34
      { lineId: "jr33", start: 126.7 }, // I 滅度多宝仏 ペア17開始
      { lineId: "jr34", start: 130.0 }, // I 一切皆歓喜
      // ペア18: jr35+jr36
      { lineId: "jr35", start: 133.3 }, // I 十方現在仏 ペア18開始
      { lineId: "jr36", start: 136.7 }, // I 幷過去未来
      // ペア19: jr37+jr38  f0140(140s)=D (140.0s開始)
      { lineId: "jr37", start: 140.0 }, // D f0140 亦見亦供養 ペア19開始
      { lineId: "jr38", start: 143.3 }, // I 亦令得歓喜
      // ペア20: jr39+jr40
      { lineId: "jr39", start: 146.7 }, // I 諸仏坐道場 ペア20開始
      { lineId: "jr40", start: 150.0 }, // I 所得秘要法
      // ペア21: jr41+jr42
      { lineId: "jr41", start: 153.3 }, // I 能持是経者 ペア21開始
      { lineId: "jr42", start: 156.7 }, // I 不久亦當得
      // ペア22: jr43+jr44  f0160(160s)=D (160.0s開始)
      { lineId: "jr43", start: 160.0 }, // D f0160 能持是経者 ペア22開始
      { lineId: "jr44", start: 163.3 }, // I 於諸法之義
      // ペア23: jr45+jr46
      { lineId: "jr45", start: 166.7 }, // I 名字及言辞 ペア23開始
      { lineId: "jr46", start: 170.0 }, // I 楽説無窮尽
      // ペア24: jr47+jr48
      { lineId: "jr47", start: 173.3 }, // I 如風於空中 ペア24開始
      { lineId: "jr48", start: 176.7 }, // I 一切無障礙
      // ペア25: jr49+jr50  f0180(180s)=D (180.0s開始)
      { lineId: "jr49", start: 180.0 }, // D f0180 於如来滅後 ペア25開始
      { lineId: "jr50", start: 183.3 }, // I 知仏所説経
      // ペア26: jr51+jr52
      { lineId: "jr51", start: 186.7 }, // I 因縁及次第 ペア26開始
      { lineId: "jr52", start: 190.0 }, // I 随義如実説
      // ペア27: jr53+jr54
      { lineId: "jr53", start: 193.3 }, // I 如日月光明 ペア27開始
      { lineId: "jr54", start: 196.7 }, // I 能除諸幽冥
      // ペア28: jr55+jr56  f0200(200s)=D (200.0s開始)
      { lineId: "jr55", start: 200.0 }, // D f0200 斯人行世間 ペア28開始
      { lineId: "jr56", start: 203.3 }, // I 能滅衆生闇
      // ペア29: jr57+jr58
      { lineId: "jr57", start: 206.7 }, // I 教無量菩薩 ペア29開始
      { lineId: "jr58", start: 210.0 }, // I 畢竟住一乗
      // ペア30: jr59+jr60
      { lineId: "jr59", start: 213.3 }, // I 是故有智者 ペア30開始
      { lineId: "jr60", start: 216.7 }, // I 聞此功徳利
      // ペア31: jr61+jr62  f0220(220s)=D (220.0s開始)
      { lineId: "jr61", start: 220.0 }, // D f0220 於我滅度後 ペア31開始
      { lineId: "jr62", start: 223.3 }, // I 応受持斯経
      // ペア32: jr63+jr64  f0230(230s)=D (226.7s開始、230s時点でjr64確認)
      { lineId: "jr63", start: 226.7 }, // D f0230 是人於仏道 ペア32開始
      { lineId: "jr64", start: 230.0 }, // D f0230 決定無有疑（最終句）
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
    displayTitle: "宝塔偈",
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

  // ===== 観音偈専用動画（YouTube） =====
  // Ground Truth:
  //   動画: 観音経 慈悲と救いであらゆる願いが叶う偈文・7分 字幕（高野山真言宗 松島龍戒）
  //   YouTube ID: _CyvlLqEWUs  Duration: 442.1s
  //   テキスト表示開始: ~18s オフセット。フレーム: f0001=18s, f0002=19s,...
  //   表示形式: カラオケ式。2句並列（LEFT=現在青, RIGHT=次白）。
  //   テキスト: 妙法蓮華経 鳩摩羅什訳 観世音菩薩普門品第二十五。日蓮宗・真言宗共通。
  //
  // 同期方法: OCRフレーム表示時刻（[D]）
  //   1fps フレーム抽出 + Vision OCR → .cache/kannon_frames_1fps/
  //   アンカー: ko1=26s[D], ko3=33s[D], ko5=40s[D], ko7=48s[D], ko9=56s[D],
  //            ko11=64s[D], ko21=96s[D], ko31=128s[D], ko41=160s[D], ko51=192s[D],
  //            ko57=213s[D], ko87=311s[D], ko101=356s[D], ko111=397s[D],
  //            ko116=410s[D], ko118=422s[D]
  //   区間ごとの補間レート（QA第2次 OCR再測定後の確定値）:
  //     ko1-ko4:   3.5s/句（26.0〜33.0s）
  //     ko5-ko10:  4.0s/句（40.0〜64.0s）
  //     ko11-ko56: 3.25s/句（64.0〜210.3s）← 10句ごとDアンカー確認済み
  //     ko57-ko62: 3.75s/句（213.5〜232.3s）← 七難末尾。ko63=236.0s[D]で確定
  //     ko63-ko74: 3.0s/句（236.0〜269.0s） ← 新節。ko75=272.0s[D]で収束確認
  //     ko75-ko104: 3.25s/句（272.0〜366.3s）← ko87=311s[D] ko101=356.5s[D] 確認済み
  //     ko105-ko118: 4〜5s/句（観察アンカーで補間）
  {
    id: "kannon-CyvlL",
    displayTitle: "観音偈",
    title: "観音経 慈悲と救いであらゆる願いが叶う偈文・7分 字幕",
    subtitle: "観世音菩薩普門品第二十五 偈頌（観音偈）",
    kind: "youtube",
    youtubeId: "_CyvlLqEWUs",
    sutraIds: ["kannonge"],
    timings: [
      // ---- 観音偈 ko1-ko104（偈頌） ----
      // ko1-ko4: 3.5s/句, 起点 26.0s [D]
      { lineId: "ko1",   start:  26.0 }, // D f0009 世尊妙相具
      { lineId: "ko2",   start:  29.5 }, // P
      { lineId: "ko3",   start:  33.0 }, // D f0016 仏子何因縁
      { lineId: "ko4",   start:  36.5 }, // P
      // ko5-ko10: 4.0s/句, 起点 40.0s [D]
      { lineId: "ko5",   start:  40.0 }, // D f0023 具足妙相尊
      { lineId: "ko6",   start:  44.0 }, // P
      { lineId: "ko7",   start:  48.0 }, // D f0031 汝聴観音行
      { lineId: "ko8",   start:  52.0 }, // P
      { lineId: "ko9",   start:  56.0 }, // D f0039 弘誓深如海
      { lineId: "ko10",  start:  60.0 }, // P
      // ko11-ko104: 3.25s/句, 起点 64.0s [D]
      { lineId: "ko11",  start:  64.0 }, // D f0047 侍多千億仏
      { lineId: "ko12",  start:  67.3 }, // P
      { lineId: "ko13",  start:  70.5 }, // P
      { lineId: "ko14",  start:  73.8 }, // P
      { lineId: "ko15",  start:  77.0 }, // P
      { lineId: "ko16",  start:  80.3 }, // P
      { lineId: "ko17",  start:  83.5 }, // P ≈82s[D]
      { lineId: "ko18",  start:  86.8 }, // P
      { lineId: "ko19",  start:  90.0 }, // P
      { lineId: "ko20",  start:  93.3 }, // P
      { lineId: "ko21",  start:  96.5 }, // D f0079 或漂流巨海 ≈96s
      { lineId: "ko22",  start:  99.8 }, // P
      { lineId: "ko23",  start: 103.0 }, // P
      { lineId: "ko24",  start: 106.3 }, // P
      { lineId: "ko25",  start: 109.5 }, // P
      { lineId: "ko26",  start: 112.8 }, // P
      { lineId: "ko27",  start: 116.0 }, // P
      { lineId: "ko28",  start: 119.3 }, // P
      { lineId: "ko29",  start: 122.5 }, // P
      { lineId: "ko30",  start: 125.8 }, // P
      { lineId: "ko31",  start: 129.0 }, // D f0111 念彼観音力 ≈128s
      { lineId: "ko32",  start: 132.3 }, // P
      { lineId: "ko33",  start: 135.5 }, // P
      { lineId: "ko34",  start: 138.8 }, // P
      { lineId: "ko35",  start: 142.0 }, // P
      { lineId: "ko36",  start: 145.3 }, // P
      { lineId: "ko37",  start: 148.5 }, // P
      { lineId: "ko38",  start: 151.8 }, // P
      { lineId: "ko39",  start: 155.0 }, // P
      { lineId: "ko40",  start: 158.3 }, // P
      { lineId: "ko41",  start: 161.5 }, // D f0143 或囚禁枷鎖 ≈160s
      { lineId: "ko42",  start: 164.8 }, // P
      { lineId: "ko43",  start: 168.0 }, // P
      { lineId: "ko44",  start: 171.3 }, // P
      { lineId: "ko45",  start: 174.5 }, // P
      { lineId: "ko46",  start: 177.8 }, // P
      { lineId: "ko47",  start: 181.0 }, // P
      { lineId: "ko48",  start: 184.3 }, // P
      { lineId: "ko49",  start: 187.5 }, // P
      { lineId: "ko50",  start: 190.8 }, // P
      { lineId: "ko51",  start: 194.0 }, // D f0175 念彼観音力 ≈192s
      { lineId: "ko52",  start: 197.3 }, // P
      { lineId: "ko53",  start: 200.5 }, // P
      { lineId: "ko54",  start: 203.8 }, // P
      { lineId: "ko55",  start: 207.0 }, // P
      { lineId: "ko56",  start: 210.3 }, // P
      // ko57-ko62: 3.75s/句（七難末尾区間。OCR2点＋区間フィット確認）
      // ko63=236.0s確定: f0219(236s)=ko63開始, f0222(239s)=ko63終端 → ko57→ko63=22.5s/6句=3.75s/句
      { lineId: "ko57",  start: 213.5 }, // D f0196 蚖蛇及蚖蟆
      { lineId: "ko58",  start: 217.3 }, // I 3.75s/句
      { lineId: "ko59",  start: 221.0 }, // I ← f0206(223s)でko59確認(2s経過)✓
      { lineId: "ko60",  start: 224.8 }, // I
      { lineId: "ko61",  start: 228.5 }, // I
      { lineId: "ko62",  start: 232.3 }, // I
      // ko63-ko74: 3.0s/句（新節「衆生被困厄」〜「以漸悉令滅」区間）
      // ko63=236.0s確定: f0219(236s)=ko63blue開始 / ko67=248s: f0233(250s)=ko67(2s経過)✓
      // ko63→ko75=272.0s(Dアンカー): 12句36.0s → 3.0s/句
      { lineId: "ko63",  start: 236.0 }, // D f0219 念彼観音力（section end）
      { lineId: "ko64",  start: 239.0 }, // I 3.0s/句
      { lineId: "ko65",  start: 242.0 }, // I
      { lineId: "ko66",  start: 245.0 }, // I
      { lineId: "ko67",  start: 248.0 }, // I ← f0233(250s)で2s経過確認✓
      { lineId: "ko68",  start: 251.0 }, // I
      { lineId: "ko69",  start: 254.0 }, // I ← f0239(256s)で2s経過確認✓
      { lineId: "ko70",  start: 257.0 }, // I
      { lineId: "ko71",  start: 260.0 }, // I
      { lineId: "ko72",  start: 263.0 }, // I
      { lineId: "ko73",  start: 266.0 }, // I
      { lineId: "ko74",  start: 269.0 }, // I
      // ko75-: 3.25s/句（Dアンカー ko75=272s, ko87=311s で確定）
      { lineId: "ko75",  start: 272.0 }, // D f0255 生老病死苦（exact）
      { lineId: "ko76",  start: 275.3 }, // P
      { lineId: "ko77",  start: 278.5 }, // P
      { lineId: "ko78",  start: 281.8 }, // P
      { lineId: "ko79",  start: 285.0 }, // P
      { lineId: "ko80",  start: 288.3 }, // P
      { lineId: "ko81",  start: 291.5 }, // P
      { lineId: "ko82",  start: 294.8 }, // P
      { lineId: "ko83",  start: 298.0 }, // P
      { lineId: "ko84",  start: 301.3 }, // P
      { lineId: "ko85",  start: 304.5 }, // P
      { lineId: "ko86",  start: 307.8 }, // P
      { lineId: "ko87",  start: 311.0 }, // D f0294 澍甘露法雨 ≈311s
      { lineId: "ko88",  start: 314.3 }, // P
      { lineId: "ko89",  start: 317.5 }, // P
      { lineId: "ko90",  start: 320.8 }, // P
      { lineId: "ko91",  start: 324.0 }, // P
      { lineId: "ko92",  start: 327.3 }, // P
      { lineId: "ko93",  start: 330.5 }, // P
      { lineId: "ko94",  start: 333.8 }, // P
      { lineId: "ko95",  start: 337.0 }, // P
      { lineId: "ko96",  start: 340.3 }, // P
      { lineId: "ko97",  start: 343.5 }, // P
      { lineId: "ko98",  start: 346.8 }, // P
      { lineId: "ko99",  start: 350.0 }, // P
      { lineId: "ko100", start: 353.3 }, // P
      { lineId: "ko101", start: 356.5 }, // D f0339 具一切功徳 ≈356s
      { lineId: "ko102", start: 359.8 }, // P
      { lineId: "ko103", start: 363.0 }, // P
      { lineId: "ko104", start: 366.3 }, // P
      // ---- 観音偈 ko105-ko118（長行後段） ----
      // 爾時持地菩薩 passage。アンカー: ko111=397s[D], ko116=410s[D], ko118=422s[D]
      // ko105-ko110: 散文冒頭。ko109=386s[D f0370: 聞是観世音菩薩品, 2char進行確認]
      // ko104=366.25 → ko109=386s: 4.75s/句（長行ゆっくり）
      // ko109 → ko111=397: 2句11s = 5.5s/句
      { lineId: "ko105", start: 370.0 }, // P (±1s, 許容範囲)
      { lineId: "ko106", start: 374.0 }, // P
      { lineId: "ko107", start: 378.0 }, // P
      { lineId: "ko108", start: 382.0 }, // P
      { lineId: "ko109", start: 386.0 }, // D f0370 聞是観世音菩薩品
      { lineId: "ko110", start: 391.5 }, // I ko109=386 → ko111=397 (5.5s/句)
      { lineId: "ko111", start: 397.0 }, // D 普門示現
      // ko112-ko115: ko111=397 → ko116=410, 5句間13s = 2.6s/句
      // ← 旧値(401/404/407/409)はすべて1.4-2.2s遅すぎ。f0390(407s)でko115確認。
      { lineId: "ko112", start: 399.5 }, // I 2.6s/句
      { lineId: "ko113", start: 402.0 }, // I
      { lineId: "ko114", start: 404.8 }, // I
      { lineId: "ko115", start: 407.5 }, // I ← f0390(407s)でko115開始付近確認✓
      { lineId: "ko116", start: 410.0 }, // D 衆中八万四千衆生
      { lineId: "ko117", start: 416.0 }, // P
      { lineId: "ko118", start: 422.0 }, // D 阿耨多羅三藐三菩提心 ≈422s
    ],
  },

  // ===== 方便品 専用練習動画（YouTube・見法寺法務チャンネル） =====
  // Ground Truth: 【お経練習・字幕あり】妙法蓮華経方便品第二
  // YouTube ID: v1fPDfKHC7I  チャンネル: 見法寺法務チャンネル（日蓮宗）  収録: 213s
  // 採用理由: 字幕焼き込み・練習用専用動画・OCR可能・神力偈と同一フォーマット
  //   表示形式: 2句並列静止 (2句同時白表示、大字・読み付き)
  //   タイトルカード: ~12s（方便品 第二）→ 長行 h1 開始: ~13s
  //
  // OCRアンカー（12フレーム）:
  //   f0020(20s)=告舎利弗/諸仏智慧[h2移行]  f0030(30s)=辟支仏所不能知[h3 2nd]
  //   f0050(50s)=勇猛精進名称普聞[h5 2nd]  f0080(80s)=所以者何如来方便[h12 1st]
  //   f0100(100s)=深入無際成就一切[h15]  f0120(120s)=取要言之無量無辺[h17 1st]
  //   f0135(135s)=第一希有難解之法[h18 3rd]  f0145(145s)=所謂諸法如是相[h7 1st]
  //   f0150(150s)=如是性如是体[h7 2nd]  f0160(160s)=如是果如是報[h9 1st]
  //   f0175(175s)=如是因如是縁[h21 2nd]  f0190(190s)=如是性如是体[h23 2nd]
  //   f0205(205s)=如是本末究竟等[h25 2nd]
  //
  // 十如是ペース: 3s/display×2display=6s/行。
  // 反復間: 1→2回目 即連続(h20=163s), 2→3回目 5s休止(h23=186s)
  {
    id: "miehouji-hobenpon",
    displayTitle: "方便品第二",
    title: "【お経練習・字幕あり】妙法蓮華経方便品第二",
    subtitle: "見法寺法務チャンネル（日蓮宗）- 方便品第二 専用練習動画",
    kind: "youtube",
    youtubeId: "v1fPDfKHC7I",
    sutraIds: ["hobenpon"],
    timings: [
      // ---- 方便品 長行 (h1-h6, h10-h19) ----
      { lineId: "h1",  start:  13.0 }, // I タイトルカード終了後（f0010=タイトル）
      { lineId: "h2",  start:  20.0 }, // D f0020 告舎利弗/諸仏智慧 移行確認
      { lineId: "h3",  start:  26.0 }, // D f0030 辟支仏所不能知(2nd display)逆算
      { lineId: "h4",  start:  35.0 }, // I h3=26〜h5=43 中間
      { lineId: "h5",  start:  43.0 }, // D f0050 勇猛精進名称普聞(2nd display)逆算
      { lineId: "h6",  start:  54.0 }, // I h5=43〜h12=78 3等分
      { lineId: "h10", start:  63.0 }, // I
      { lineId: "h11", start:  71.0 }, // I
      { lineId: "h12", start:  78.0 }, // D f0080 所以者何如来方便(1st display)
      { lineId: "h13", start:  85.0 }, // I h12=78〜h15=97 中間
      { lineId: "h14", start:  91.0 }, // I
      { lineId: "h15", start:  97.0 }, // D f0100 深入無際成就一切
      { lineId: "h16", start: 107.0 }, // I h15=97〜h17=117 中間
      { lineId: "h17", start: 117.0 }, // D f0120 取要言之無量無辺(1st display)
      { lineId: "h18", start: 124.0 }, // D f0135 第一希有難解之法(3rd display)逆算
      { lineId: "h19", start: 136.0 }, // I h18終了〜h7=145の間
      // ---- 方便品 十如是 三返 ----
      // ペース: 3s/display × 2display = 6s/行
      // 1→2回目: 即連続（h20=163s）。2→3回目: 5s休止（h23=186s）。
      // 全アンカー整合: h7(145)→h8(151)→h9(157)→h20(163)→h21(169)→h22(175)
      //                 →[5s休止]→h23(186)→h24(192)→h25(198)
      { lineId: "h7",  start: 145.0 }, // D f0145 所謂諸法如是相 1回目開始（最高精度）
      { lineId: "h8",  start: 151.0 }, // I h7+6
      { lineId: "h9",  start: 157.0 }, // D f0160 如是果如是報(1st display)逆算
      { lineId: "h20", start: 163.0 }, // I h9終了後即開始 2回目
      { lineId: "h21", start: 169.0 }, // D f0175 如是因如是縁(2nd display)逆算
      { lineId: "h22", start: 175.0 }, // I h21+6
      { lineId: "h23", start: 186.0 }, // D f0190 如是性如是体(2nd display)逆算 (休止5s後)
      { lineId: "h24", start: 192.0 }, // I h23+6
      { lineId: "h25", start: 198.0 }, // D f0205 如是本末究竟等(2nd display)逆算
    ],
  },

  // ===== 自我偈 専用練習動画（YouTube・見法寺法務チャンネル） =====
  // Ground Truth: 【お経練習・字幕有り】妙法蓮華経如来寿量品第十六　自我偈
  // YouTube ID: ZD4kXNmeeyQ  チャンネル: 見法寺法務チャンネル（日蓮宗）  収録: 281.5s
  // フォーマット: 2句並列表示（白抜き大字・ふりがな付き）= 神力偈・方便品と同形式
  // OCRアンカー（14フレーム）:
  //   f0013(13s)=j1開始（自我得仏来/所経諸劫数）
  //   f0065(65s)=j6第1表示（衆生既信伏/質直意柔軟）
  //   f0073(73s)=j6第2表示継続確認  f0075(75s)=j7第1表示確認
  //   f0085(85s)=j7第2表示（我時語衆生/常在此不滅）
  //   f0090(90s)=j8第1表示（以方便力故/現有滅不滅）
  //   f0110(110s)=j10第1表示（我見諸衆生/没在於苦海）
  //   f0120(120s)=j11第1表示（因其心恋慕/乃出為説法）
  //   f0130(130s)=j12第1表示（常在霊鷲山/及余諸住処）
  //   f0140(140s)=j13第1表示（我此土安穏/天人常充満）
  //   f0155(155s)=j14第2表示（諸天撃天鼓/常作衆伎楽）→j14=148s逆算
  //   f0170(170s)=j16第1表示（憂怖諸苦悩/如是悉充満）
  //   f0200(200s)=j19第1表示（久乃見仏者/為説仏難値）
  //   f0230(230s)=j22第1表示（実在而言死/無能説虚妄）
  //   f0260(260s)=j25第1表示（随応所可度/為説種種法）
  //   f0270(270s)=j26表示（得入無上道/速成就仏身）
  // ペース: 基本5s/表示×2表示=10s/行（j1-j6, j8-j26）。j7のみ約14s（唱念速度差）
  // j26のみ2句構成（1表示=5s）。動画終了=281.5s（j26終了後クレジット約8s）
  {
    id: "miehouji-jigage",
    displayTitle: "自我偈",
    title: "【お経練習・字幕有り】妙法蓮華経如来寿量品第十六　自我偈",
    subtitle: "見法寺法務チャンネル（日蓮宗）- 自我偈 専用練習動画",
    kind: "youtube",
    youtubeId: "ZD4kXNmeeyQ",
    sutraIds: ["jigage"],
    timings: [
      { lineId: "j1",  start:  13.0 }, // D f0013 自我得仏来/所経諸劫数 初出
      { lineId: "j2",  start:  23.0 }, // I j1+10
      { lineId: "j3",  start:  33.0 }, // I j2+10
      { lineId: "j4",  start:  43.0 }, // I j3+10
      { lineId: "j5",  start:  53.0 }, // I j4+10
      { lineId: "j6",  start:  63.0 }, // D f0065 衆生既信伏/質直意柔軟 第1表示確認
      { lineId: "j7",  start:  74.0 }, // D f0073=j6継続・f0075=j7初出 → 境界~74s
      { lineId: "j8",  start:  88.0 }, // D f0085=j7第2表示・f0090=j8第1表示逆算
      { lineId: "j9",  start:  98.0 }, // I j8+10
      { lineId: "j10", start: 108.0 }, // D f0110 我見諸衆生/没在於苦海
      { lineId: "j11", start: 118.0 }, // D f0120 因其心恋慕/乃出為説法
      { lineId: "j12", start: 128.0 }, // D f0130 常在霊鷲山/及余諸住処
      { lineId: "j13", start: 138.0 }, // D f0140 我此土安穏/天人常充満
      { lineId: "j14", start: 148.0 }, // D f0155=j14第2表示(155s)逆算 → j14=148s
      { lineId: "j15", start: 158.0 }, // I j14+10
      { lineId: "j16", start: 168.0 }, // D f0170 憂怖諸苦悩/如是悉充満
      { lineId: "j17", start: 178.0 }, // I j16+10
      { lineId: "j18", start: 188.0 }, // I j17+10
      { lineId: "j19", start: 198.0 }, // D f0200 久乃見仏者/為説仏難値
      { lineId: "j20", start: 208.0 }, // I j19+10
      { lineId: "j21", start: 218.0 }, // I j20+10
      { lineId: "j22", start: 228.0 }, // D f0230 実在而言死/無能説虚妄
      { lineId: "j23", start: 238.0 }, // I j22+10
      { lineId: "j24", start: 248.0 }, // I j23+10
      { lineId: "j25", start: 258.0 }, // D f0260 随応所可度/為説種種法
      { lineId: "j26", start: 268.0 }, // D f0270 得入無上道/速成就仏身（1表示のみ）
    ],
  },

  // ===== 観音偈 専用練習動画（YouTube・見法寺法務チャンネル） =====
  // Ground Truth: 【お経練習・字幕有り】妙法蓮華経観世音菩薩普門品第二十五　観音偈
  // YouTube ID: KNMoi0cDOx0  収録: 401.9s
  // フォーマット: 2句並列表示（白抜き大字・ふりがな付き）
  // OCRアンカー（11表示ペア）:
  //   D1=18s(ko1+2) D2=26s(ko3+4) D5=48s(ko9+10) D8=68s(ko15+16)
  //   D13=98s(ko25+26) D21=148s(ko41+42) D29=198s(ko57+58)
  //   D38=248s(ko75+76) D46=298s(ko91+92) D54=348s(ko107+108)
  //   D59=388s(ko117+118)
  // ペース: 各区間内で線形補間。奇数ko=表示開始, 偶数ko=表示開始+区間半分
  // 区間別レート: D1-2=8s/表示→D2-5=7.3s→D5-8=6.7s→D8-13=6.0s
  //              →D13-29=6.25s→D29-38=5.6s→D38-54=6.25s→D54-59=8.0s
  {
    id: "miehouji-kannonge",
    displayTitle: "観音偈",
    title: "【お経練習・字幕有り】妙法蓮華経観世音菩薩普門品第二十五　観音偈",
    subtitle: "見法寺法務チャンネル（日蓮宗）- 観音偈 専用練習動画",
    kind: "youtube",
    youtubeId: "KNMoi0cDOx0",
    sutraIds: ["kannonge"],
    timings: [
      // ---- D1-D2: 8.0s/表示, offset+4.0s (18-26s) ----
      { lineId: "ko1",   start:  18.0 }, // D f0020 観音偈開始
      { lineId: "ko2",   start:  22.0 }, // P +4.0
      // ---- D2-D5: 7.33s/表示, offset+3.7s (26-48s) ----
      { lineId: "ko3",   start:  26.0 }, // D f0027 仏子何因縁/名為観世音
      { lineId: "ko4",   start:  29.7 }, // P +3.7
      { lineId: "ko5",   start:  33.3 }, // I
      { lineId: "ko6",   start:  37.0 }, // P
      { lineId: "ko7",   start:  40.7 }, // I
      { lineId: "ko8",   start:  44.4 }, // P
      // ---- D5-D8: 6.67s/表示, offset+3.3s (48-68s) ----
      { lineId: "ko9",   start:  48.0 }, // D f0050 弘誓深如海/歴劫不思議
      { lineId: "ko10",  start:  51.3 }, // P +3.3
      { lineId: "ko11",  start:  54.7 }, // I
      { lineId: "ko12",  start:  58.0 }, // P
      { lineId: "ko13",  start:  61.3 }, // I
      { lineId: "ko14",  start:  64.7 }, // P
      // ---- D8-D13: 6.0s/表示, offset+3.0s (68-98s) ----
      { lineId: "ko15",  start:  68.0 }, // D f0070 心念不空過/能滅諸有苦
      { lineId: "ko16",  start:  71.0 }, // P +3.0
      { lineId: "ko17",  start:  74.0 }, // I
      { lineId: "ko18",  start:  77.0 }, // P
      { lineId: "ko19",  start:  80.0 }, // I
      { lineId: "ko20",  start:  83.0 }, // P
      { lineId: "ko21",  start:  86.0 }, // I
      { lineId: "ko22",  start:  89.0 }, // P
      { lineId: "ko23",  start:  92.0 }, // I
      { lineId: "ko24",  start:  95.0 }, // P
      // ---- D13-D29: 6.25s/表示, offset+3.1s (98-198s) ----
      { lineId: "ko25",  start:  98.0 }, // D f0100 或在須弥峰/為人所推堕
      { lineId: "ko26",  start: 101.1 }, // P +3.1
      { lineId: "ko27",  start: 104.3 }, // I
      { lineId: "ko28",  start: 107.4 }, // P
      { lineId: "ko29",  start: 110.5 }, // I
      { lineId: "ko30",  start: 113.6 }, // P
      { lineId: "ko31",  start: 116.8 }, // I
      { lineId: "ko32",  start: 119.9 }, // P
      { lineId: "ko33",  start: 123.0 }, // I
      { lineId: "ko34",  start: 126.1 }, // P
      { lineId: "ko35",  start: 129.3 }, // I
      { lineId: "ko36",  start: 132.4 }, // P
      { lineId: "ko37",  start: 135.5 }, // I
      { lineId: "ko38",  start: 138.6 }, // P
      { lineId: "ko39",  start: 141.8 }, // I
      { lineId: "ko40",  start: 144.9 }, // P
      { lineId: "ko41",  start: 148.0 }, // D f0150 或囚禁枷鎖/手足被杻械
      { lineId: "ko42",  start: 151.1 }, // P +3.1
      { lineId: "ko43",  start: 154.3 }, // I
      { lineId: "ko44",  start: 157.4 }, // P
      { lineId: "ko45",  start: 160.5 }, // I
      { lineId: "ko46",  start: 163.6 }, // P
      { lineId: "ko47",  start: 166.8 }, // I
      { lineId: "ko48",  start: 169.9 }, // P
      { lineId: "ko49",  start: 173.0 }, // I
      { lineId: "ko50",  start: 176.1 }, // P
      { lineId: "ko51",  start: 179.3 }, // I
      { lineId: "ko52",  start: 182.4 }, // P
      { lineId: "ko53",  start: 185.5 }, // I
      { lineId: "ko54",  start: 188.6 }, // P
      { lineId: "ko55",  start: 191.8 }, // I
      { lineId: "ko56",  start: 194.9 }, // P
      // ---- D29-D38: 5.56s/表示, offset+2.8s (198-248s) ----
      { lineId: "ko57",  start: 198.0 }, // D f0200 蚖蛇及蚖蟆/気毒煙火然
      { lineId: "ko58",  start: 200.8 }, // P +2.8
      { lineId: "ko59",  start: 203.6 }, // I
      { lineId: "ko60",  start: 206.3 }, // P
      { lineId: "ko61",  start: 209.1 }, // I
      { lineId: "ko62",  start: 211.9 }, // P
      { lineId: "ko63",  start: 214.7 }, // I
      { lineId: "ko64",  start: 217.4 }, // P
      { lineId: "ko65",  start: 220.2 }, // I
      { lineId: "ko66",  start: 223.0 }, // P
      { lineId: "ko67",  start: 225.8 }, // I
      { lineId: "ko68",  start: 228.6 }, // P
      { lineId: "ko69",  start: 231.3 }, // I
      { lineId: "ko70",  start: 234.1 }, // P
      { lineId: "ko71",  start: 236.9 }, // I
      { lineId: "ko72",  start: 239.7 }, // P
      { lineId: "ko73",  start: 242.4 }, // I
      { lineId: "ko74",  start: 245.2 }, // P
      // ---- D38-D54: 6.25s/表示, offset+3.1s (248-348s) ----
      { lineId: "ko75",  start: 248.0 }, // D f0250 生老病死苦/以漸悉令滅
      { lineId: "ko76",  start: 251.1 }, // P +3.1
      { lineId: "ko77",  start: 254.3 }, // I
      { lineId: "ko78",  start: 257.4 }, // P
      { lineId: "ko79",  start: 260.5 }, // I
      { lineId: "ko80",  start: 263.6 }, // P
      { lineId: "ko81",  start: 266.8 }, // I
      { lineId: "ko82",  start: 269.9 }, // P
      { lineId: "ko83",  start: 273.0 }, // I
      { lineId: "ko84",  start: 276.1 }, // P
      { lineId: "ko85",  start: 279.3 }, // I
      { lineId: "ko86",  start: 282.4 }, // P
      { lineId: "ko87",  start: 285.5 }, // I
      { lineId: "ko88",  start: 288.6 }, // P
      { lineId: "ko89",  start: 291.8 }, // I
      { lineId: "ko90",  start: 294.9 }, // P
      { lineId: "ko91",  start: 298.0 }, // D f0300 念彼観音力/衆怨悉退散
      { lineId: "ko92",  start: 301.1 }, // P +3.1
      { lineId: "ko93",  start: 304.3 }, // I
      { lineId: "ko94",  start: 307.4 }, // P
      { lineId: "ko95",  start: 310.5 }, // I
      { lineId: "ko96",  start: 313.6 }, // P
      { lineId: "ko97",  start: 316.8 }, // I
      { lineId: "ko98",  start: 319.9 }, // P
      { lineId: "ko99",  start: 323.0 }, // I
      { lineId: "ko100", start: 326.1 }, // P
      { lineId: "ko101", start: 329.3 }, // I
      { lineId: "ko102", start: 332.4 }, // P
      { lineId: "ko103", start: 335.5 }, // I
      { lineId: "ko104", start: 338.6 }, // P
      { lineId: "ko105", start: 341.8 }, // I
      { lineId: "ko106", start: 344.9 }, // P
      // ---- D54-D59: 8.0s/表示, offset+4.0s (348-388s) ----
      { lineId: "ko107", start: 348.0 }, // D f0350 前白仏言/世尊
      { lineId: "ko108", start: 352.0 }, // P +4.0
      { lineId: "ko109", start: 356.0 }, // I
      { lineId: "ko110", start: 360.0 }, // P
      { lineId: "ko111", start: 364.0 }, // I
      { lineId: "ko112", start: 368.0 }, // P
      { lineId: "ko113", start: 372.0 }, // I
      { lineId: "ko114", start: 376.0 }, // P
      { lineId: "ko115", start: 380.0 }, // I
      { lineId: "ko116", start: 384.0 }, // P
      { lineId: "ko117", start: 388.0 }, // D f0390 皆発無等等/阿耨多羅三藐三菩提心
      { lineId: "ko118", start: 392.0 }, // P +4.0 (video ends ~401.9s)
    ],
  },

  // ===== 提婆達多品 専用動画（YouTube） =====
  // Ground Truth: 妙法蓮華経 提婆達多品第十二（龍女成仏）
  // YouTube ID: v6tSdCVw354  収録: ~340s（エンドカード込み）
  // 字幕形式: 下部黒帯・大字漢字＋フリガナ同時表示（J1m3系チャンネルフォーマット）
  // 収録範囲: 偈頌（db01-db04, 63-111s） + 長行（db05-db26, 112-332s）
  //   ※ 章前半（提婆達多物語）は動画解説（0-62s）のため字幕なし・未収録
  //
  // OCRアンカー（sparse frames s62-s337, 5s間隔 × 56フレーム全確認）:
  //   D f0062→f0063: 63s=db01開始  D f0077→f0078: 78s=db02開始
  //   I s87=db02継続, s92=db03→db03=91s
  //   I s102=db03継続, s107=db04→db04=105s
  //   全26表示を5s精度でOCR確認済み（スキャン完了 2026-06-30）
  {
    id: "v6tsdc-daibadatta",
    displayTitle: "提婆達多品",
    title: "【お経練習・字幕付き】妙法蓮華経提婆達多品第十二",
    subtitle: "提婆達多品第十二 龍女成仏",
    kind: "youtube",
    youtubeId: "v6tSdCVw354",
    sutraIds: ["daibadatta"],
    timings: [
      // ---- 偈頌（文殊菩薩の偈）db01-db04 ----
      { lineId: "db01", start:  63.0 }, // D f0063 深達罪福相...
      { lineId: "db02", start:  78.0 }, // D f0077→f0078 transition
      { lineId: "db03", start:  91.0 }, // I s87=db02継続, s92=db03
      { lineId: "db04", start: 105.0 }, // I s102=db03継続, s107=db04
      // ---- 長行（龍女成仏）db05-db26 ----
      { lineId: "db05", start: 110.0 }, // I s107=db04継続, s112=db05
      { lineId: "db06", start: 125.0 }, // I s122=db05継続, s127=db06
      { lineId: "db07", start: 135.0 }, // I s132=db06継続, s137=db07
      { lineId: "db08", start: 147.0 }, // I s142=db07継続, s152=db08
      { lineId: "db09", start: 155.0 }, // I s152=db08継続, s157=db09
      { lineId: "db10", start: 163.0 }, // I s157=db09継続, s167=db10
      { lineId: "db11", start: 175.0 }, // I s172=db10継続, s177=db11
      { lineId: "db12", start: 180.0 }, // I s177=db11継続, s182=db12
      { lineId: "db13", start: 195.0 }, // I s192=db12継続, s197=db13
      { lineId: "db14", start: 207.0 }, // I s202=db13継続, s212=db14
      { lineId: "db15", start: 215.0 }, // I s212=db14継続, s217=db15
      { lineId: "db16", start: 225.0 }, // I s222=db15継続, s227=db16
      { lineId: "db17", start: 235.0 }, // I s232=db16継続, s237=db17
      { lineId: "db18", start: 242.0 }, // I s237=db17継続, s247=db18
      { lineId: "db19", start: 255.0 }, // I s252=db18継続, s257=db19
      { lineId: "db20", start: 260.0 }, // I s257=db19継続, s262=db20
      { lineId: "db21", start: 270.0 }, // I s267=db20継続, s272=db21
      { lineId: "db22", start: 280.0 }, // I s277=db21継続, s282=db22
      { lineId: "db23", start: 295.0 }, // I s292=db22継続, s297=db23
      { lineId: "db24", start: 305.0 }, // I s302=db23継続, s307=db24
      { lineId: "db25", start: 315.0 }, // I s312=db24継続, s317=db25
      { lineId: "db26", start: 325.0 }, // I s317=db25継続, s327=db26
    ],
  },

  // ===== 普賢菩薩勧発品第二十八（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 普賢菩薩勧発品第二十八
  // YouTube ID: ht8TC7DHfS4  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 468s（7分48秒）、字幕なし（読経声のみ・木鉦なし）
  //
  // タイミング: Whisper large-v3（ja）セグメント開始時刻（47セグメント）
  //   陀羅尼区間（221-257s）は音声認識精度低いため近似値を使用。
  //   詳細: .cache/fugen_ht8TC7DHfS4.whisper.json
  {
    id: "honkoji-fugen",
    displayTitle: "普賢勧発偈",
    title: "妙法蓮華経 普賢菩薩勧発品第二十八（本光寺 Live）",
    subtitle: "普賢菩薩勧発品第二十八 全文読誦",
    kind: "youtube",
    youtubeId: "ht8TC7DHfS4",
    sutraIds: ["fugenkanpatsuge"],
    timings: [
      // ---- 来現（fg01-fg06） ----
      { lineId: "fg01", start:  14.0 }, // W 爾時普賢菩薩以自在神通力威徳名聞
      { lineId: "fg02", start:  20.0 }, // W 与大菩薩無量無辺不可称数倶従東方来
      { lineId: "fg03", start:  27.0 }, // W 所経諸国普皆六種震動雨宝蓮華
      { lineId: "fg04", start:  38.0 }, // W 与無数天龍夜叉乾闥婆...人非人等
      { lineId: "fg05", start:  50.0 }, // W 各現神通力到娑婆世界
      { lineId: "fg06", start:  56.0 }, // W 詣釈迦牟尼仏頭面礼仏遶仏七匝
      // ---- 問答と四法成就（fg07-fg12） ----
      { lineId: "fg07", start:  63.0 }, // W 白仏言世尊我於宝威徳上王仏国
      { lineId: "fg08", start:  70.0 }, // W 与無量無辺諸菩薩衆倶来聴受
      { lineId: "fg09", start:  80.0 }, // W 若善男子善女人於如来滅後
      { lineId: "fg10", start:  85.0 }, // W 仏告普賢菩薩成就四法
      { lineId: "fg11", start:  90.0 }, // W 一者為諸仏護念...四者発救一切衆生之心
      { lineId: "fg12", start:  99.0 }, // W 善男子善女人如是成就四法
      // ---- 普賢誓願と守護（fg13-fg22） ----
      { lineId: "fg13", start: 106.0 }, // W 爾時普賢菩薩白仏言後五百歳濁悪世中
      { lineId: "fg14", start: 114.0 }, // W 除其衰患令得安穏
      { lineId: "fg15", start: 127.0 }, // W 若魔若魔子...諸惱人者皆不得便
      { lineId: "fg16", start: 143.0 }, // W 是人若行若立読誦此経乗六牙白象
      { lineId: "fg17", start: 152.0 }, // W 亦為供養法華経是人若坐思惟此経
      { lineId: "fg18", start: 162.0 }, // W 其人若忘失一句一偈我当教之
      { lineId: "fg19", start: 172.0 }, // W 受持読誦法華経者得見我身即得三昧
      { lineId: "fg20", start: 185.0 }, // W 名為旋陀羅尼百千万億旋陀羅尼
      { lineId: "fg21", start: 196.0 }, // W 世尊若後五百歳比丘比丘尼優婆塞優婆夷
      { lineId: "fg22", start: 208.0 }, // W 応当三七日勤持此呪満三七日
      // ---- 陀羅尼（fg23-fg26） ----
      { lineId: "fg23", start: 221.0 }, // W 即於仏前而説呪曰（陀羅尼開始）
      { lineId: "fg24", start: 233.0 }, // W 陀羅尼前半（阿檀地...仏馱波羶禰）
      { lineId: "fg25", start: 246.0 }, // W 陀羅尼後半（薩婆陀羅尼阿婆多尼...）
      { lineId: "fg26", start: 257.0 }, // W 陀羅尼末（薩婆僧伽...知利地益咤）
      // ---- 受持の功徳（fg27-fg35） ----
      { lineId: "fg27", start: 258.0 }, // W 世尊若有菩薩得聞是陀羅尼者
      { lineId: "fg28", start: 265.0 }, // W 若法華経行於閻浮提有受持者
      { lineId: "fg29", start: 272.0 }, // W 若有受持読誦正憶念行普賢行深種善根
      { lineId: "fg30", start: 279.0 }, // W 為諸如来手摩其頭若但書写命終忉利天
      { lineId: "fg31", start: 287.0 }, // W 八万四千天女来迎七宝冠娯楽快楽
      { lineId: "fg32", start: 294.0 }, // W 何況受持読誦...命終
      { lineId: "fg33", start: 307.0 }, // W 為千仏授手不堕悪趣兜率天弥勒菩薩所
      { lineId: "fg34", start: 320.0 }, // W 弥勒菩薩三十二相...功徳利益
      { lineId: "fg35", start: 333.0 }, // W 是故智者応当一心自書受持読誦
      // ---- 釈尊の讃嘆と結語（fg36-fg46） ----
      { lineId: "fg36", start: 347.5 }, // W 世尊我今以神通力守護是経広令流布
      { lineId: "fg37", start: 361.5 }, // W 爾時釈迦牟尼仏讃言善哉善哉普賢
      { lineId: "fg38", start: 374.5 }, // W 汝已成就不可思議功徳深大慈悲
      { lineId: "fg39", start: 385.5 }, // W 而能作是神通之願守護是経
      { lineId: "fg40", start: 397.5 }, // W 普賢若有受持読誦是法華経者
      { lineId: "fg41", start: 411.5 }, // W 当知是人供養釈迦牟尼仏...衣之所覆
      { lineId: "fg42", start: 423.5 }, // W 如是之人不復貪著世楽心意質直
      { lineId: "fg43", start: 430.5 }, // W 是人不為三毒所悩少欲知足能修普賢行
      { lineId: "fg44", start: 436.5 }, // W 若有不信毀謗...当起遠迎当如敬仏
      { lineId: "fg45", start: 443.5 }, // W 説是普賢勧発品時恒河沙等菩薩...
      { lineId: "fg46", start: 454.5 }, // W 爾時一切大衆皆大歓喜受持仏語作礼而去
    ],
  },

  // ===== 序品第一（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 序品第一
  // YouTube ID: Tnqm52v9xZQ  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 1114s（18分34秒）、字幕なし（読経声のみ）。実質読誦区間: 約0〜1023.5s
  //
  // タイミング: Whisper large-v3（ja、6チャンク・フォアグラウンド実行）で
  //   セクション境界（10区間）を構造的に確認（.cache/johon_merged.txt）。
  //   序品は連続読誦の音写崩れが著しく語句単位の一致は取れなかったため、
  //   各セクション内は行数に応じた均等補間で暫定配置。要・DTW/OCR精密照合。
  {
    id: "honkoji-johon",
    displayTitle: "序品",
    title: "妙法蓮華経 序品第一（本光寺 Live）",
    subtitle: "序品第一 全文読誦",
    kind: "youtube",
    youtubeId: "Tnqm52v9xZQ",
    sutraIds: ["johon"],
    timings: [
      // ---- 序分（jo01-jo03） 8.0-17.0s ----
      { lineId: "jo01", start:   8.0 },
      { lineId: "jo02", start:  11.0 },
      { lineId: "jo03", start:  14.0 },
      // ---- 会座・声聞衆列名（jo04-jo09） 17.0-91.4s ----
      { lineId: "jo04", start:  17.0 },
      { lineId: "jo05", start:  29.4 },
      { lineId: "jo06", start:  41.8 },
      { lineId: "jo07", start:  54.2 },
      { lineId: "jo08", start:  66.6 },
      { lineId: "jo09", start:  79.0 },
      // ---- 会座・菩薩衆列名（jo10-jo17） 91.4-158.5s ----
      { lineId: "jo10", start:  91.4 },
      { lineId: "jo11", start:  99.8 },
      { lineId: "jo12", start: 108.2 },
      { lineId: "jo13", start: 116.6 },
      { lineId: "jo14", start: 124.9 },
      { lineId: "jo15", start: 133.3 },
      { lineId: "jo16", start: 141.7 },
      { lineId: "jo17", start: 150.1 },
      // ---- 会座・天龍八部衆（jo18-jo27） 158.5-255.6s ----
      { lineId: "jo18", start: 158.5 },
      { lineId: "jo19", start: 168.2 },
      { lineId: "jo20", start: 177.9 },
      { lineId: "jo21", start: 187.6 },
      { lineId: "jo22", start: 197.3 },
      { lineId: "jo23", start: 207.1 },
      { lineId: "jo24", start: 216.8 },
      { lineId: "jo25", start: 226.5 },
      { lineId: "jo26", start: 236.2 },
      { lineId: "jo27", start: 245.9 },
      // ---- 無量義経説示・入定・瑞相（jo28-jo32） 255.6-296.2s ----
      { lineId: "jo28", start: 255.6 },
      { lineId: "jo29", start: 263.7 },
      { lineId: "jo30", start: 271.9 },
      { lineId: "jo31", start: 280.0 },
      { lineId: "jo32", start: 288.1 },
      // ---- 放光・東方一万八千世界（jo33-jo40） 296.2-400.0s ----
      { lineId: "jo33", start: 296.2 },
      { lineId: "jo34", start: 309.2 },
      { lineId: "jo35", start: 322.2 },
      { lineId: "jo36", start: 335.1 },
      { lineId: "jo37", start: 348.1 },
      { lineId: "jo38", start: 361.1 },
      { lineId: "jo39", start: 374.1 },
      { lineId: "jo40", start: 387.0 },
      // ---- 弥勒菩薩の疑念・長行（jo41-jo48） 400.0-516.3s ----
      { lineId: "jo41", start: 400.0 },
      { lineId: "jo42", start: 414.5 },
      { lineId: "jo43", start: 429.1 },
      { lineId: "jo44", start: 443.6 },
      { lineId: "jo45", start: 458.1 },
      { lineId: "jo46", start: 472.7 },
      { lineId: "jo47", start: 487.2 },
      { lineId: "jo48", start: 501.7 },
      // ---- 弥勒、文殊に問う・偈頌（jo49-jo69） 516.3-732.0s ----
      { lineId: "jo49", start: 516.3 },
      { lineId: "jo50", start: 526.6 },
      { lineId: "jo51", start: 536.9 },
      { lineId: "jo52", start: 547.1 },
      { lineId: "jo53", start: 557.4 },
      { lineId: "jo54", start: 567.7 },
      { lineId: "jo55", start: 577.9 },
      { lineId: "jo56", start: 588.2 },
      { lineId: "jo57", start: 598.5 },
      { lineId: "jo58", start: 608.8 },
      { lineId: "jo59", start: 619.0 },
      { lineId: "jo60", start: 629.3 },
      { lineId: "jo61", start: 639.6 },
      { lineId: "jo62", start: 649.8 },
      { lineId: "jo63", start: 660.1 },
      { lineId: "jo64", start: 670.4 },
      { lineId: "jo65", start: 680.6 },
      { lineId: "jo66", start: 690.9 },
      { lineId: "jo67", start: 701.2 },
      { lineId: "jo68", start: 711.5 },
      { lineId: "jo69", start: 721.7 },
      // ---- 文殊の答え・日月燈明仏物語・長行（jo70-jo103） 732.0-945.5s ----
      { lineId: "jo70", start: 732.0 },
      { lineId: "jo71", start: 738.3 },
      { lineId: "jo72", start: 744.6 },
      { lineId: "jo73", start: 750.8 },
      { lineId: "jo74", start: 757.1 },
      { lineId: "jo75", start: 763.4 },
      { lineId: "jo76", start: 769.6 },
      { lineId: "jo77", start: 775.9 },
      { lineId: "jo78", start: 782.2 },
      { lineId: "jo79", start: 788.4 },
      { lineId: "jo80", start: 794.7 },
      { lineId: "jo81", start: 801.0 },
      { lineId: "jo82", start: 807.2 },
      { lineId: "jo83", start: 813.5 },
      { lineId: "jo84", start: 819.8 },
      { lineId: "jo85", start: 826.0 },
      { lineId: "jo86", start: 832.3 },
      { lineId: "jo87", start: 838.6 },
      { lineId: "jo88", start: 844.9 },
      { lineId: "jo89", start: 851.1 },
      { lineId: "jo90", start: 857.4 },
      { lineId: "jo91", start: 863.7 },
      { lineId: "jo92", start: 869.9 },
      { lineId: "jo93", start: 876.2 },
      { lineId: "jo94", start: 882.5 },
      { lineId: "jo95", start: 888.7 },
      { lineId: "jo96", start: 895.0 },
      { lineId: "jo97", start: 901.3 },
      { lineId: "jo98", start: 907.5 },
      { lineId: "jo99", start: 913.8 },
      { lineId: "jo100", start: 920.1 },
      { lineId: "jo101", start: 926.3 },
      { lineId: "jo102", start: 932.6 },
      { lineId: "jo103", start: 938.9 },
      // ---- 文殊の答え・重頌（jo104-jo118） 945.5-1023.5s ----
      { lineId: "jo104", start: 945.5 },
      { lineId: "jo105", start: 950.7 },
      { lineId: "jo106", start: 955.9 },
      { lineId: "jo107", start: 961.1 },
      { lineId: "jo108", start: 966.3 },
      { lineId: "jo109", start: 971.5 },
      { lineId: "jo110", start: 976.7 },
      { lineId: "jo111", start: 981.9 },
      { lineId: "jo112", start: 987.1 },
      { lineId: "jo113", start: 992.3 },
      { lineId: "jo114", start: 997.5 },
      { lineId: "jo115", start: 1002.7 },
      { lineId: "jo116", start: 1007.9 },
      { lineId: "jo117", start: 1013.1 },
      { lineId: "jo118", start: 1018.3 },
    ],
  },

  // ===== 方便品第二・全文（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 方便品第二（全文）
  // YouTube ID: S5caezkoUG0  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 1336s（22分16秒）、字幕なし（読経声のみ）。実質読誦区間: 約11〜1328.4s
  //
  // タイミング: Whisper large-v3（ja、7チャンク・フォアグラウンド実行）。
  //   長行部（11-400s）は語句レベルでも比較的明瞭（十如是が136-171s台に
  //   直接出現を確認）。偈頌部（400-1328s）は音写崩れが著しいため、
  //   セクション境界（構造的に確認済み）を基準に均等補間で暫定配置。
  //   要・DTW/OCR精密照合。詳細: .cache/hobenponzenbun_merged.txt
  {
    id: "honkoji-hobenponzenbun",
    displayTitle: "方便品（全文）",
    title: "妙法蓮華経 方便品第二（本光寺 Live）",
    subtitle: "方便品第二 全文読誦",
    kind: "youtube",
    youtubeId: "S5caezkoUG0",
    sutraIds: ["hobenponzenbun"],
    timings: [
      // ---- 長行1・諸仏智慧甚深無量（hz01-hz09） 11.0-136.0s ----
      { lineId: "hz01", start:  11.0 },
      { lineId: "hz02", start:  24.9 },
      { lineId: "hz03", start:  38.8 },
      { lineId: "hz04", start:  52.7 },
      { lineId: "hz05", start:  66.6 },
      { lineId: "hz06", start:  80.4 },
      { lineId: "hz07", start:  94.3 },
      { lineId: "hz08", start: 108.2 },
      { lineId: "hz09", start: 122.1 },
      // ---- 十如是（hz10-hz12） 136.0-171.0s ----
      { lineId: "hz10", start: 136.0 },
      { lineId: "hz11", start: 147.7 },
      { lineId: "hz12", start: 159.3 },
      // ---- 長行2・三止三請〜一大事因縁〜一仏乗（hz13-hz33） 171.0-400.0s ----
      { lineId: "hz13", start: 171.0 },
      { lineId: "hz14", start: 181.9 },
      { lineId: "hz15", start: 192.8 },
      { lineId: "hz16", start: 203.7 },
      { lineId: "hz17", start: 214.6 },
      { lineId: "hz18", start: 225.5 },
      { lineId: "hz19", start: 236.4 },
      { lineId: "hz20", start: 247.3 },
      { lineId: "hz21", start: 258.2 },
      { lineId: "hz22", start: 269.1 },
      { lineId: "hz23", start: 280.0 },
      { lineId: "hz24", start: 290.9 },
      { lineId: "hz25", start: 301.8 },
      { lineId: "hz26", start: 312.7 },
      { lineId: "hz27", start: 323.6 },
      { lineId: "hz28", start: 334.5 },
      { lineId: "hz29", start: 345.5 },
      { lineId: "hz30", start: 356.4 },
      { lineId: "hz31", start: 367.3 },
      { lineId: "hz32", start: 378.2 },
      { lineId: "hz33", start: 389.1 },
      // ---- 偈1・世雄不可量（hz34-hz49） 400.0-800.0s ----
      { lineId: "hz34", start: 400.0 },
      { lineId: "hz35", start: 425.0 },
      { lineId: "hz36", start: 450.0 },
      { lineId: "hz37", start: 475.0 },
      { lineId: "hz38", start: 500.0 },
      { lineId: "hz39", start: 525.0 },
      { lineId: "hz40", start: 550.0 },
      { lineId: "hz41", start: 575.0 },
      { lineId: "hz42", start: 600.0 },
      { lineId: "hz43", start: 625.0 },
      { lineId: "hz44", start: 650.0 },
      { lineId: "hz45", start: 675.0 },
      { lineId: "hz46", start: 700.0 },
      { lineId: "hz47", start: 725.0 },
      { lineId: "hz48", start: 750.0 },
      { lineId: "hz49", start: 775.0 },
      // ---- 偈2・我始坐道場（hz50-hz58） 800.0-1025.7s ----
      { lineId: "hz50", start:  800.0 },
      { lineId: "hz51", start:  825.1 },
      { lineId: "hz52", start:  850.1 },
      { lineId: "hz53", start:  875.2 },
      { lineId: "hz54", start:  900.3 },
      { lineId: "hz55", start:  925.4 },
      { lineId: "hz56", start:  950.4 },
      { lineId: "hz57", start:  975.5 },
      { lineId: "hz58", start: 1000.6 },
      // ---- 偈3・五千退席重頌（hz59-hz66） 1025.7-1200.0s ----
      { lineId: "hz59", start: 1025.7 },
      { lineId: "hz60", start: 1047.5 },
      { lineId: "hz61", start: 1069.3 },
      { lineId: "hz62", start: 1091.1 },
      { lineId: "hz63", start: 1112.8 },
      { lineId: "hz64", start: 1134.6 },
      { lineId: "hz65", start: 1156.4 },
      { lineId: "hz66", start: 1178.2 },
      // ---- 偈4・結語（hz67-hz71） 1200.0-1328.4s ----
      { lineId: "hz67", start: 1200.0 },
      { lineId: "hz68", start: 1225.7 },
      { lineId: "hz69", start: 1251.4 },
      { lineId: "hz70", start: 1277.0 },
      { lineId: "hz71", start: 1302.7 },
    ],
  },

  // ===== 譬喩品第三（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 譬喩品第三（三車火宅の譬え）
  // YouTube ID: D965nIz_Ufg  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 1596s（26分36秒）、字幕なし（読経声のみ）。実質読誦区間: 約9.4〜1588.8s
  //
  // タイミング: Whisper large-v3（ja、8チャンク・フォアグラウンド実行）。
  //   冒頭（舎利弗踊躍歓喜）・火宅導入部（"長者"の直接出現）・末尾
  //   （法師経等）は語句レベルでも比較的明瞭。長大な譬喩・偈頌の中盤は
  //   音写崩れ・旋律的発声（♪）・高速反復誤認識が著しいため、
  //   セクション境界（構造的に確認済み）を基準に均等補間で暫定配置。
  //   要・DTW/OCR精密照合。詳細: .cache/hiyuhon_merged.txt
  {
    id: "honkoji-hiyuhon",
    displayTitle: "譬喩品",
    title: "妙法蓮華経 譬喩品第三（本光寺 Live）",
    subtitle: "譬喩品第三 全文読誦（三車火宅の譬え）",
    kind: "youtube",
    youtubeId: "D965nIz_Ufg",
    sutraIds: ["hiyuhon"],
    timings: [
      // ---- 舎利弗踊躍歓喜偈・仏の記別（hy01-hy20） 9.4-400.0s ----
      { lineId: "hy01", start:   9.4 },
      { lineId: "hy02", start:  28.9 },
      { lineId: "hy03", start:  48.5 },
      { lineId: "hy04", start:  68.0 },
      { lineId: "hy05", start:  87.6 },
      { lineId: "hy06", start: 107.1 },
      { lineId: "hy07", start: 126.6 },
      { lineId: "hy08", start: 146.2 },
      { lineId: "hy09", start: 165.7 },
      { lineId: "hy10", start: 185.3 },
      { lineId: "hy11", start: 204.8 },
      { lineId: "hy12", start: 224.3 },
      { lineId: "hy13", start: 243.9 },
      { lineId: "hy14", start: 263.4 },
      { lineId: "hy15", start: 283.0 },
      { lineId: "hy16", start: 302.5 },
      { lineId: "hy17", start: 322.0 },
      { lineId: "hy18", start: 341.6 },
      { lineId: "hy19", start: 361.1 },
      { lineId: "hy20", start: 380.7 },
      // ---- 四衆供養・舎利弗の重ねての請い（hy21-hy30） 400.0-623.0s ----
      { lineId: "hy21", start: 400.0 },
      { lineId: "hy22", start: 422.3 },
      { lineId: "hy23", start: 444.6 },
      { lineId: "hy24", start: 466.9 },
      { lineId: "hy25", start: 489.2 },
      { lineId: "hy26", start: 511.5 },
      { lineId: "hy27", start: 533.8 },
      { lineId: "hy28", start: 556.1 },
      { lineId: "hy29", start: 578.4 },
      { lineId: "hy30", start: 600.7 },
      // ---- 火宅の譬え本体（hy31-hy58） 623.0-1032.0s ----
      { lineId: "hy31", start:  623.0 },
      { lineId: "hy32", start:  637.6 },
      { lineId: "hy33", start:  652.2 },
      { lineId: "hy34", start:  666.8 },
      { lineId: "hy35", start:  681.4 },
      { lineId: "hy36", start:  696.1 },
      { lineId: "hy37", start:  710.7 },
      { lineId: "hy38", start:  725.3 },
      { lineId: "hy39", start:  739.9 },
      { lineId: "hy40", start:  754.5 },
      { lineId: "hy41", start:  769.1 },
      { lineId: "hy42", start:  783.8 },
      { lineId: "hy43", start:  798.4 },
      { lineId: "hy44", start:  813.0 },
      { lineId: "hy45", start:  827.6 },
      { lineId: "hy46", start:  842.2 },
      { lineId: "hy47", start:  856.8 },
      { lineId: "hy48", start:  871.4 },
      { lineId: "hy49", start:  886.1 },
      { lineId: "hy50", start:  900.7 },
      { lineId: "hy51", start:  915.3 },
      { lineId: "hy52", start:  929.9 },
      { lineId: "hy53", start:  944.5 },
      { lineId: "hy54", start:  959.1 },
      { lineId: "hy55", start:  973.8 },
      { lineId: "hy56", start:  988.4 },
      { lineId: "hy57", start: 1003.0 },
      { lineId: "hy58", start: 1017.6 },
      // ---- 譬えの説明・合譬（hy59-hy70） 1032.0-1200.0s ----
      { lineId: "hy59", start: 1032.0 },
      { lineId: "hy60", start: 1046.0 },
      { lineId: "hy61", start: 1060.0 },
      { lineId: "hy62", start: 1074.0 },
      { lineId: "hy63", start: 1088.0 },
      { lineId: "hy64", start: 1102.0 },
      { lineId: "hy65", start: 1116.0 },
      { lineId: "hy66", start: 1130.0 },
      { lineId: "hy67", start: 1144.0 },
      { lineId: "hy68", start: 1158.0 },
      { lineId: "hy69", start: 1172.0 },
      { lineId: "hy70", start: 1186.0 },
      // ---- 重頌・火宅の譬えの詳細な繰り返し（hy71-hy90） 1200.0-1588.8s ----
      { lineId: "hy71", start: 1200.0 },
      { lineId: "hy72", start: 1219.4 },
      { lineId: "hy73", start: 1238.9 },
      { lineId: "hy74", start: 1258.3 },
      { lineId: "hy75", start: 1277.8 },
      { lineId: "hy76", start: 1297.2 },
      { lineId: "hy77", start: 1316.6 },
      { lineId: "hy78", start: 1336.1 },
      { lineId: "hy79", start: 1355.5 },
      { lineId: "hy80", start: 1375.0 },
      { lineId: "hy81", start: 1394.4 },
      { lineId: "hy82", start: 1413.8 },
      { lineId: "hy83", start: 1433.3 },
      { lineId: "hy84", start: 1452.7 },
      { lineId: "hy85", start: 1472.2 },
      { lineId: "hy86", start: 1491.6 },
      { lineId: "hy87", start: 1511.0 },
      { lineId: "hy88", start: 1530.5 },
      { lineId: "hy89", start: 1549.9 },
      { lineId: "hy90", start: 1569.3 },
    ],
  },

  // ===== 信解品第四（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 信解品第四（長者窮子の譬え）
  // YouTube ID: 1YlVyFbN8mA  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 882s（14分42秒）、字幕なし（読経声のみ）。実質読誦区間: 約8〜880s
  //
  // タイミング: Whisper large-v3（ja、5チャンク・フォアグラウンド実行）。
  //   200-400s・800-881.8sは「ご視聴ありがとうございました」の反復誤認識
  //   だったが、ffmpeg volumedetect/silencedetectで無音でないことを確認
  //   （全編mean_volume約-22dB）。旋律的発声をWhisperが認識できず定型句へ
  //   フォールバックしたと判断し、全編を実質読誦区間として扱った。
  //   セクション境界は行数比例で配置し均等補間。要・DTW/OCR精密照合。
  //   詳細: .cache/1YlVyFbN8mA_chunks/、WORKFLOW.md「既知の環境制約」参照。
  {
    id: "honkoji-shingehon",
    displayTitle: "信解品",
    title: "妙法蓮華経 信解品第四（本光寺 Live）",
    subtitle: "信解品第四 全文読誦（長者窮子の譬え）",
    kind: "youtube",
    youtubeId: "1YlVyFbN8mA",
    sutraIds: ["shingehon"],
    timings: [
      // ---- 四大声聞の歓喜・窮子の譬えの導入（sg01-sg08） 8.0-103.6s ----
      { lineId: "sg01", start:  8.0 },
      { lineId: "sg02", start: 20.0 },
      { lineId: "sg03", start: 31.9 },
      { lineId: "sg04", start: 43.9 },
      { lineId: "sg05", start: 55.8 },
      { lineId: "sg06", start: 67.8 },
      { lineId: "sg07", start: 79.7 },
      { lineId: "sg08", start: 91.7 },
      // ---- 窮子の譬え・前半（sg09-sg26） 103.6-318.6s ----
      { lineId: "sg09", start: 103.6 },
      { lineId: "sg10", start: 115.5 },
      { lineId: "sg11", start: 127.5 },
      { lineId: "sg12", start: 139.4 },
      { lineId: "sg13", start: 151.4 },
      { lineId: "sg14", start: 163.3 },
      { lineId: "sg15", start: 175.2 },
      { lineId: "sg16", start: 187.2 },
      { lineId: "sg17", start: 199.1 },
      { lineId: "sg18", start: 211.1 },
      { lineId: "sg19", start: 223.0 },
      { lineId: "sg20", start: 234.9 },
      { lineId: "sg21", start: 246.9 },
      { lineId: "sg22", start: 258.8 },
      { lineId: "sg23", start: 270.8 },
      { lineId: "sg24", start: 282.7 },
      { lineId: "sg25", start: 294.6 },
      { lineId: "sg26", start: 306.6 },
      // ---- 窮子の譬え・後半（sg27-sg39） 318.6-473.9s ----
      { lineId: "sg27", start: 318.6 },
      { lineId: "sg28", start: 330.6 },
      { lineId: "sg29", start: 342.5 },
      { lineId: "sg30", start: 354.5 },
      { lineId: "sg31", start: 366.4 },
      { lineId: "sg32", start: 378.4 },
      { lineId: "sg33", start: 390.3 },
      { lineId: "sg34", start: 402.3 },
      { lineId: "sg35", start: 414.2 },
      { lineId: "sg36", start: 426.2 },
      { lineId: "sg37", start: 438.1 },
      { lineId: "sg38", start: 450.1 },
      { lineId: "sg39", start: 462.0 },
      // ---- 合譬（sg40-sg49） 473.9-593.4s ----
      { lineId: "sg40", start: 473.9 },
      { lineId: "sg41", start: 485.9 },
      { lineId: "sg42", start: 497.8 },
      { lineId: "sg43", start: 509.8 },
      { lineId: "sg44", start: 521.7 },
      { lineId: "sg45", start: 533.7 },
      { lineId: "sg46", start: 545.6 },
      { lineId: "sg47", start: 557.6 },
      { lineId: "sg48", start: 569.5 },
      { lineId: "sg49", start: 581.5 },
      // ---- 重頌（sg50-sg73） 593.4-880.0s ----
      { lineId: "sg50", start: 593.4 },
      { lineId: "sg51", start: 605.3 },
      { lineId: "sg52", start: 617.3 },
      { lineId: "sg53", start: 629.2 },
      { lineId: "sg54", start: 641.2 },
      { lineId: "sg55", start: 653.1 },
      { lineId: "sg56", start: 665.0 },
      { lineId: "sg57", start: 677.0 },
      { lineId: "sg58", start: 688.9 },
      { lineId: "sg59", start: 700.9 },
      { lineId: "sg60", start: 712.8 },
      { lineId: "sg61", start: 724.7 },
      { lineId: "sg62", start: 736.7 },
      { lineId: "sg63", start: 748.6 },
      { lineId: "sg64", start: 760.6 },
      { lineId: "sg65", start: 772.5 },
      { lineId: "sg66", start: 784.4 },
      { lineId: "sg67", start: 796.4 },
      { lineId: "sg68", start: 808.3 },
      { lineId: "sg69", start: 820.3 },
      { lineId: "sg70", start: 832.2 },
      { lineId: "sg71", start: 844.1 },
      { lineId: "sg72", start: 856.1 },
      { lineId: "sg73", start: 868.0 },
    ],
  },

  // ===== 薬草喩品第五（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 薬草喩品第五（三草二木の譬え）
  // YouTube ID: LGsPXrUxDUE  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 508.9s（8分29秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜505s
  //
  // タイミング: Whisper large-v3（ja、3チャンク・フォアグラウンド実行）。
  //   200-508.9sが「お祈りします」の反復誤認識だったが、ffmpeg
  //   volumedetect/silencedetectで無音でないことを確認（全編
  //   mean_volume約-22〜-24dB）。旋律的発声の認識失敗と判断し、
  //   全編を実質読誦区間として扱った。セクション境界は行数比例で
  //   配置し均等補間。要・DTW/OCR精密照合。
  {
    id: "honkoji-yakusoyuhon",
    displayTitle: "薬草喩品",
    title: "妙法蓮華経 薬草喩品第五（本光寺 Live）",
    subtitle: "薬草喩品第五 全文読誦（三草二木の譬え）",
    kind: "youtube",
    youtubeId: "LGsPXrUxDUE",
    sutraIds: ["yakusoyuhon"],
    timings: [
      // ---- 仏の称賛・導入（ys01-ys05） 5.0-60.6s ----
      { lineId: "ys01", start:  5.0 },
      { lineId: "ys02", start: 16.1 },
      { lineId: "ys03", start: 27.2 },
      { lineId: "ys04", start: 38.4 },
      { lineId: "ys05", start: 49.5 },
      // ---- 三草二木の譬え本体（ys06-ys16） 60.6-182.8s ----
      { lineId: "ys06", start:  60.6 },
      { lineId: "ys07", start:  71.7 },
      { lineId: "ys08", start:  82.8 },
      { lineId: "ys09", start:  93.9 },
      { lineId: "ys10", start: 105.0 },
      { lineId: "ys11", start: 116.2 },
      { lineId: "ys12", start: 127.3 },
      { lineId: "ys13", start: 138.4 },
      { lineId: "ys14", start: 149.5 },
      { lineId: "ys15", start: 160.6 },
      { lineId: "ys16", start: 171.7 },
      // ---- 一相一味の法・如来の唯一知見（ys17-ys24） 182.8-271.7s ----
      { lineId: "ys17", start: 182.8 },
      { lineId: "ys18", start: 193.9 },
      { lineId: "ys19", start: 205.0 },
      { lineId: "ys20", start: 216.1 },
      { lineId: "ys21", start: 227.2 },
      { lineId: "ys22", start: 238.4 },
      { lineId: "ys23", start: 249.5 },
      { lineId: "ys24", start: 260.6 },
      // ---- 重頌（ys25-ys45） 271.7-505.0s ----
      { lineId: "ys25", start: 271.7 },
      { lineId: "ys26", start: 282.8 },
      { lineId: "ys27", start: 293.9 },
      { lineId: "ys28", start: 305.0 },
      { lineId: "ys29", start: 316.1 },
      { lineId: "ys30", start: 327.3 },
      { lineId: "ys31", start: 338.4 },
      { lineId: "ys32", start: 349.5 },
      { lineId: "ys33", start: 360.6 },
      { lineId: "ys34", start: 371.7 },
      { lineId: "ys35", start: 382.8 },
      { lineId: "ys36", start: 393.9 },
      { lineId: "ys37", start: 405.0 },
      { lineId: "ys38", start: 416.1 },
      { lineId: "ys39", start: 427.2 },
      { lineId: "ys40", start: 438.4 },
      { lineId: "ys41", start: 449.5 },
      { lineId: "ys42", start: 460.6 },
      { lineId: "ys43", start: 471.7 },
      { lineId: "ys44", start: 482.8 },
      { lineId: "ys45", start: 493.9 },
    ],
  },

  // ===== 授記品第六（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 授記品第六（四大声聞への記別）
  // YouTube ID: Gu6YDp_FMT0  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 509.7s（8分30秒）、字幕なし（読経声のみ）。実質読誦区間: 約0〜505s
  //
  // タイミング: Whisper large-v3（ja、3チャンク・フォアグラウンド実行）。
  //   冒頭タイトル・迦葉への記別冒頭・須菩提への記別冒頭（約208.6s）が
  //   語句レベルで明瞭に確認でき、強いアンカーとなった。事前に
  //   ffmpeg silencedetectで無音区間なしを確認済み。セクション境界は
  //   構造確認に基づき配置し均等補間。要・DTW/OCR精密照合。
  {
    id: "honkoji-jukihon",
    displayTitle: "授記品",
    title: "妙法蓮華経 授記品第六（本光寺 Live）",
    subtitle: "授記品第六 全文読誦（四大声聞への記別）",
    kind: "youtube",
    youtubeId: "Gu6YDp_FMT0",
    sutraIds: ["jukihon"],
    timings: [
      // ---- 迦葉への記別・長行（jk01-jk05） 10.0-100.0s ----
      { lineId: "jk01", start: 10.0 },
      { lineId: "jk02", start: 28.0 },
      { lineId: "jk03", start: 46.0 },
      { lineId: "jk04", start: 64.0 },
      { lineId: "jk05", start: 82.0 },
      // ---- 迦葉への記別・重頌（jk06-jk11） 100.0-208.6s ----
      { lineId: "jk06", start: 100.0 },
      { lineId: "jk07", start: 118.1 },
      { lineId: "jk08", start: 136.2 },
      { lineId: "jk09", start: 154.3 },
      { lineId: "jk10", start: 172.4 },
      { lineId: "jk11", start: 190.5 },
      // ---- 須菩提への記別（jk12-jk20） 208.6-320.0s ----
      { lineId: "jk12", start: 208.6 },
      { lineId: "jk13", start: 221.0 },
      { lineId: "jk14", start: 233.4 },
      { lineId: "jk15", start: 245.8 },
      { lineId: "jk16", start: 258.1 },
      { lineId: "jk17", start: 270.5 },
      { lineId: "jk18", start: 282.9 },
      { lineId: "jk19", start: 295.3 },
      { lineId: "jk20", start: 307.6 },
      // ---- 大迦旃延への記別（jk21-jk27） 320.0-410.0s ----
      { lineId: "jk21", start: 320.0 },
      { lineId: "jk22", start: 332.9 },
      { lineId: "jk23", start: 345.7 },
      { lineId: "jk24", start: 358.6 },
      { lineId: "jk25", start: 371.4 },
      { lineId: "jk26", start: 384.3 },
      { lineId: "jk27", start: 397.1 },
      // ---- 大目犍連への記別（jk28-jk37） 410.0-505.0s ----
      { lineId: "jk28", start: 410.0 },
      { lineId: "jk29", start: 419.5 },
      { lineId: "jk30", start: 429.0 },
      { lineId: "jk31", start: 438.5 },
      { lineId: "jk32", start: 448.0 },
      { lineId: "jk33", start: 457.5 },
      { lineId: "jk34", start: 467.0 },
      { lineId: "jk35", start: 476.5 },
      { lineId: "jk36", start: 486.0 },
      { lineId: "jk37", start: 495.5 },
    ],
  },

  // ===== 化城喩品第七（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 化城喩品第七（化城の譬え）
  // YouTube ID: tXWQkYZkkgk  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 1470s（24分30秒）、字幕なし（読経声のみ）。実質読誦区間: 約11〜1469.5s
  //
  // タイミング: Whisper large-v3（ja、8チャンク・フォアグラウンド実行）。
  //   1042-1469.5sは「お祈りします」の反復誤認識だったが、volumedetect
  //   （複数地点）・silencedetect（全編スキャン）で無音でないことを確認
  //   （全編mean_volume約-23dB）。831-853s付近は十二因縁（無明縁行…）の
  //   音写と直接対応する語句レベルで明瞭な区間として確認できた。
  //   セクション境界は行数比例で配置し均等補間。要・DTW/OCR精密照合。
  //   詳細: .cache/kejohon_merged.txt
  {
    id: "honkoji-kejohon",
    displayTitle: "化城喩品",
    title: "妙法蓮華経 化城喩品第七（本光寺 Live）",
    subtitle: "化城喩品第七 全文読誦（化城の譬え）",
    kind: "youtube",
    youtubeId: "tXWQkYZkkgk",
    sutraIds: ["kejohon"],
    timings: [
      // ---- 大通智勝仏の物語導入・成道の久遠性（kj01-kj10） 11.0-197.0s ----
      { lineId: "kj01", start:  11.0 },
      { lineId: "kj02", start:  29.6 },
      { lineId: "kj03", start:  48.2 },
      { lineId: "kj04", start:  66.8 },
      { lineId: "kj05", start:  85.4 },
      { lineId: "kj06", start: 104.0 },
      { lineId: "kj07", start: 122.6 },
      { lineId: "kj08", start: 141.2 },
      { lineId: "kj09", start: 159.8 },
      { lineId: "kj10", start: 178.4 },
      // ---- 十六王子・大通智勝仏への請法（kj11-kj20） 200.0-400.0s ----
      { lineId: "kj11", start: 200.0 },
      { lineId: "kj12", start: 220.0 },
      { lineId: "kj13", start: 240.0 },
      { lineId: "kj14", start: 260.0 },
      { lineId: "kj15", start: 280.0 },
      { lineId: "kj16", start: 300.0 },
      { lineId: "kj17", start: 320.0 },
      { lineId: "kj18", start: 340.0 },
      { lineId: "kj19", start: 360.0 },
      { lineId: "kj20", start: 380.0 },
      // ---- 十六沙弥の教化・現在にいたるまで（kj21-kj35） 400.0-830.0s ----
      { lineId: "kj21", start: 400.0 },
      { lineId: "kj22", start: 428.7 },
      { lineId: "kj23", start: 457.3 },
      { lineId: "kj24", start: 486.0 },
      { lineId: "kj25", start: 514.7 },
      { lineId: "kj26", start: 543.3 },
      { lineId: "kj27", start: 572.0 },
      { lineId: "kj28", start: 600.7 },
      { lineId: "kj29", start: 629.3 },
      { lineId: "kj30", start: 658.0 },
      { lineId: "kj31", start: 686.7 },
      { lineId: "kj32", start: 715.3 },
      { lineId: "kj33", start: 744.0 },
      { lineId: "kj34", start: 772.7 },
      { lineId: "kj35", start: 801.3 },
      // ---- 十二因縁（kj36-kj41） 830.0-1000.0s ----
      { lineId: "kj36", start: 830.0 },
      { lineId: "kj37", start: 858.3 },
      { lineId: "kj38", start: 886.7 },
      { lineId: "kj39", start: 915.0 },
      { lineId: "kj40", start: 943.3 },
      { lineId: "kj41", start: 971.7 },
      // ---- 化城の譬え本体・合譬（kj42-kj52） 1000.0-1250.0s ----
      { lineId: "kj42", start: 1000.0 },
      { lineId: "kj43", start: 1022.7 },
      { lineId: "kj44", start: 1045.5 },
      { lineId: "kj45", start: 1068.2 },
      { lineId: "kj46", start: 1090.9 },
      { lineId: "kj47", start: 1113.6 },
      { lineId: "kj48", start: 1136.4 },
      { lineId: "kj49", start: 1159.1 },
      { lineId: "kj50", start: 1181.8 },
      { lineId: "kj51", start: 1204.5 },
      { lineId: "kj52", start: 1227.3 },
      // ---- 重頌（kj53-kj61） 1250.0-1469.5s ----
      { lineId: "kj53", start: 1250.0 },
      { lineId: "kj54", start: 1274.4 },
      { lineId: "kj55", start: 1298.8 },
      { lineId: "kj56", start: 1323.2 },
      { lineId: "kj57", start: 1347.6 },
      { lineId: "kj58", start: 1372.0 },
      { lineId: "kj59", start: 1396.4 },
      { lineId: "kj60", start: 1420.8 },
      { lineId: "kj61", start: 1445.1 },
    ],
  },

  // ===== 五百弟子受記品第八（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 五百弟子受記品第八（衣裏繋珠の譬え）
  // YouTube ID: Zv9gGKxP6Ro  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 666.7s（11分7秒）、字幕なし（読経声のみ）。実質読誦区間: 約13〜662s
  //
  // タイミング: 事前にffmpeg silencedetect（全編スキャン）で無音区間なしを
  //   確認済み。冒頭0-198s（品名・富楼那の描写・記別冒頭）が語句レベルで
  //   極めて明瞭。冒頭9行は個別確認、残り34行は均等補間（約14.2s/行）。
  //   詳細: .cache/gohyakuhon_merged.txt
  {
    id: "honkoji-gohyakuhon",
    displayTitle: "五百弟子受記品",
    title: "妙法蓮華経 五百弟子受記品第八（本光寺 Live）",
    subtitle: "五百弟子受記品第八 全文読誦（衣裏繋珠の譬え）",
    kind: "youtube",
    youtubeId: "Zv9gGKxP6Ro",
    sutraIds: ["gohyakuhon"],
    timings: [
      // ---- 富楼那への序（gh01-gh09） 13.0-177.4s（語句レベル確認） ----
      { lineId: "gh01", start:  13.0 },
      { lineId: "gh02", start:  33.6 },
      { lineId: "gh03", start:  54.1 },
      { lineId: "gh04", start:  74.7 },
      { lineId: "gh05", start:  95.2 },
      { lineId: "gh06", start: 115.8 },
      { lineId: "gh07", start: 136.3 },
      { lineId: "gh08", start: 156.9 },
      { lineId: "gh09", start: 177.4 },
      // ---- 富楼那への記別・長行（gh10-gh16） 179.4-264.5s ----
      { lineId: "gh10", start: 179.4 },
      { lineId: "gh11", start: 193.6 },
      { lineId: "gh12", start: 207.8 },
      { lineId: "gh13", start: 222.0 },
      { lineId: "gh14", start: 236.2 },
      { lineId: "gh15", start: 250.3 },
      { lineId: "gh16", start: 264.5 },
      // ---- 富楼那への記別・重頌（gh17-gh23） 278.7-363.8s ----
      { lineId: "gh17", start: 278.7 },
      { lineId: "gh18", start: 292.9 },
      { lineId: "gh19", start: 307.1 },
      { lineId: "gh20", start: 321.3 },
      { lineId: "gh21", start: 335.5 },
      { lineId: "gh22", start: 349.6 },
      { lineId: "gh23", start: 363.8 },
      // ---- 千二百羅漢の願い・五百羅漢への記別（gh24-gh27） 378.0-420.6s ----
      { lineId: "gh24", start: 378.0 },
      { lineId: "gh25", start: 392.2 },
      { lineId: "gh26", start: 406.4 },
      { lineId: "gh27", start: 420.6 },
      // ---- 衣裏繋珠の譬え（gh28-gh35） 434.8-534.1s ----
      { lineId: "gh28", start: 434.8 },
      { lineId: "gh29", start: 449.0 },
      { lineId: "gh30", start: 463.1 },
      { lineId: "gh31", start: 477.3 },
      { lineId: "gh32", start: 491.5 },
      { lineId: "gh33", start: 505.7 },
      { lineId: "gh34", start: 519.9 },
      { lineId: "gh35", start: 534.1 },
      // ---- 合譬・重頌（gh36-gh43） 548.3-647.6s ----
      { lineId: "gh36", start: 548.3 },
      { lineId: "gh37", start: 562.4 },
      { lineId: "gh38", start: 576.6 },
      { lineId: "gh39", start: 590.8 },
      { lineId: "gh40", start: 605.0 },
      { lineId: "gh41", start: 619.2 },
      { lineId: "gh42", start: 633.4 },
      { lineId: "gh43", start: 647.6 },
    ],
  },

  // ===== 授学無学人記品第九（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 授学無学人記品第九
  // YouTube ID: GRKznTuERkw  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 417.4s（6分57秒）、字幕なし（読経声のみ）。実質読誦区間: 約13〜411s
  //
  // タイミング: 事前にffmpeg silencedetectで無音区間なしを確認済み。
  //   冒頭0-198s（品名・阿難羅睺羅の願い・阿難への記別冒頭）が語句
  //   レベルで極めて明瞭。構造アンカー+均等補間。
  //   詳細: .cache/jugakuhon_merged.txt
  {
    id: "honkoji-jugakuhon",
    displayTitle: "授学無学人記品",
    title: "妙法蓮華経 授学無学人記品第九（本光寺 Live）",
    subtitle: "授学無学人記品第九 全文読誦",
    kind: "youtube",
    youtubeId: "GRKznTuERkw",
    sutraIds: ["jugakuhon"],
    timings: [
      // ---- 阿難・羅睺羅の願い（jg01-jg04） 13.0-79.0s（語句レベル確認） ----
      { lineId: "jg01", start: 13.0 },
      { lineId: "jg02", start: 39.0 },
      { lineId: "jg03", start: 57.0 },
      { lineId: "jg04", start: 79.0 },
      // ---- 阿難への記別（jg05-jg11） 94.0-236.3s ----
      { lineId: "jg05", start:  94.0 },
      { lineId: "jg06", start: 117.7 },
      { lineId: "jg07", start: 141.4 },
      { lineId: "jg08", start: 165.1 },
      { lineId: "jg09", start: 188.9 },
      { lineId: "jg10", start: 212.6 },
      { lineId: "jg11", start: 236.3 },
      // ---- 羅睺羅への記別（jg12-jg15） 260.0-297.5s ----
      { lineId: "jg12", start: 260.0 },
      { lineId: "jg13", start: 272.5 },
      { lineId: "jg14", start: 285.0 },
      { lineId: "jg15", start: 297.5 },
      // ---- 二千人への記別・重頌（jg16-jg22） 310.0-396.6s ----
      { lineId: "jg16", start: 310.0 },
      { lineId: "jg17", start: 324.4 },
      { lineId: "jg18", start: 338.9 },
      { lineId: "jg19", start: 353.3 },
      { lineId: "jg20", start: 367.7 },
      { lineId: "jg21", start: 382.1 },
      { lineId: "jg22", start: 396.6 },
    ],
  },

  // ===== 法師品第十（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 法師品第十（薬王菩薩への教え）
  // YouTube ID: un3sFgKOgpU  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 624.4s（10分24秒）、字幕なし（読経声のみ）。実質読誦区間: 約11〜624.4s
  //
  // タイミング: 冒頭のみ語句レベルで明瞭（品名・薬王への呼びかけ・
  //   「一偈一句乃至一念随喜者」）。508-620s付近は「説明」の反復誤認識
  //   だったが、volumedetectで無音でないことを確認し全編を実質読誦
  //   区間として扱った。冒頭アンカー起点に均等補間（約29.2s/行）。
  //   詳細: .cache/hosshihon_merged.txt
  {
    id: "honkoji-hosshihon",
    displayTitle: "法師品",
    title: "妙法蓮華経 法師品第十（本光寺 Live）",
    subtitle: "法師品第十 全文読誦",
    kind: "youtube",
    youtubeId: "un3sFgKOgpU",
    sutraIds: ["hosshihon"],
    timings: [
      { lineId: "hs01", start:  11.0 },
      { lineId: "hs02", start:  40.2 },
      { lineId: "hs03", start:  69.4 },
      { lineId: "hs04", start:  98.6 },
      { lineId: "hs05", start: 127.9 },
      { lineId: "hs06", start: 157.1 },
      { lineId: "hs07", start: 186.3 },
      { lineId: "hs08", start: 215.5 },
      { lineId: "hs09", start: 244.7 },
      { lineId: "hs10", start: 273.9 },
      { lineId: "hs11", start: 303.1 },
      { lineId: "hs12", start: 332.3 },
      { lineId: "hs13", start: 361.5 },
      { lineId: "hs14", start: 390.7 },
      { lineId: "hs15", start: 419.9 },
      { lineId: "hs16", start: 449.1 },
      { lineId: "hs17", start: 478.3 },
      { lineId: "hs18", start: 507.5 },
      { lineId: "hs19", start: 536.7 },
      { lineId: "hs20", start: 565.9 },
      { lineId: "hs21", start: 595.1 },
    ],
  },

  // ===== 見宝塔品第十一（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 見宝塔品第十一（二仏並座）
  // YouTube ID: GFBo3otgdCg  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 689s（11分29秒）、字幕なし（読経声のみ）。実質読誦区間: 約11〜689s
  //
  // タイミング: 冒頭のみ語句レベルで明瞭（品名・宝塔が「住在空中」する
  //   描写・「善哉善哉釈迦牟尼世尊」の讃嘆句）。260-400s付近は「説明」の
  //   反復誤認識だったが、volumedetectで無音でないことを確認し全編を
  //   実質読誦区間として扱った。冒頭アンカー起点に均等補間（約25.1s/行）。
  //   詳細: .cache/hotohon_merged.txt
  {
    id: "honkoji-hotohon",
    displayTitle: "見宝塔品",
    title: "妙法蓮華経 見宝塔品第十一（本光寺 Live）",
    subtitle: "見宝塔品第十一 全文読誦（二仏並座）",
    kind: "youtube",
    youtubeId: "GFBo3otgdCg",
    sutraIds: ["hotohon"],
    timings: [
      { lineId: "ht01", start:  11.0 },
      { lineId: "ht02", start:  36.1 },
      { lineId: "ht03", start:  61.2 },
      { lineId: "ht04", start:  86.3 },
      { lineId: "ht05", start: 111.4 },
      { lineId: "ht06", start: 136.6 },
      { lineId: "ht07", start: 161.7 },
      { lineId: "ht08", start: 186.8 },
      { lineId: "ht09", start: 211.9 },
      { lineId: "ht10", start: 237.0 },
      { lineId: "ht11", start: 262.1 },
      { lineId: "ht12", start: 287.2 },
      { lineId: "ht13", start: 312.3 },
      { lineId: "ht14", start: 337.4 },
      { lineId: "ht15", start: 362.6 },
      { lineId: "ht16", start: 387.7 },
      { lineId: "ht17", start: 412.8 },
      { lineId: "ht18", start: 437.9 },
      { lineId: "ht19", start: 463.0 },
      { lineId: "ht20", start: 488.1 },
      { lineId: "ht21", start: 513.2 },
      { lineId: "ht22", start: 538.3 },
      { lineId: "ht23", start: 563.4 },
      { lineId: "ht24", start: 588.6 },
      { lineId: "ht25", start: 613.7 },
      { lineId: "ht26", start: 638.8 },
      { lineId: "ht27", start: 663.9 },
    ],
  },

  // ===== 勧持品第十三（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 勧持品第十三（二十行の偈）
  // YouTube ID: RxrISsOBVng  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 375.5s（6分15秒）、字幕なし（読経声のみ）。実質読誦区間: 約11〜373s
  //
  // タイミング: 冒頭のみ語句レベルで明瞭（品名「勧持品第十三」・薬王菩薩／
  //   大楽説菩薩への言及）。以降は音写崩れが著しく、silencedetectで無音
  //   区間なしを確認の上、冒頭アンカー起点に均等補間（約20.1s/行）。
  //   末尾373-375.5s付近のみ動画実終端と一致するアウトロと判断。
  //   詳細: .cache/kanjihon_merged.txt
  {
    id: "honkoji-kanjihon",
    displayTitle: "勧持品",
    title: "妙法蓮華経 勧持品第十三（本光寺 Live）",
    subtitle: "勧持品第十三 全文読誦（二十行の偈）",
    kind: "youtube",
    youtubeId: "RxrISsOBVng",
    sutraIds: ["kanjihon"],
    timings: [
      { lineId: "kn01", start:  11.0 },
      { lineId: "kn02", start:  31.1 },
      { lineId: "kn03", start:  51.2 },
      { lineId: "kn04", start:  71.3 },
      { lineId: "kn05", start:  91.4 },
      { lineId: "kn06", start: 111.6 },
      { lineId: "kn07", start: 131.7 },
      { lineId: "kn08", start: 151.8 },
      { lineId: "kn09", start: 171.9 },
      { lineId: "kn10", start: 192.0 },
      { lineId: "kn11", start: 212.1 },
      { lineId: "kn12", start: 232.2 },
      { lineId: "kn13", start: 252.3 },
      { lineId: "kn14", start: 272.4 },
      { lineId: "kn15", start: 292.6 },
      { lineId: "kn16", start: 312.7 },
      { lineId: "kn17", start: 332.8 },
      { lineId: "kn18", start: 352.9 },
      { lineId: "kn19", start: 373.0 },
    ],
  },

  // ===== 安楽行品第十四（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 安楽行品第十四（四安楽行と髻中明珠の譬え）
  // YouTube ID: 16u7E86jzWs  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 888.14s（14分48秒）、字幕なし（読経声のみ）。実質読誦区間: 約8〜888s
  //
  // タイミング: 冒頭〜260s台（四安楽行総説・身安楽行の行処／親近処・
  //   偈頌冒頭）はWhisperで語句レベル確認、原典と一字一句近い精度で
  //   対応が取れた。400-888sは「♪〜」等の反復ハルシネーションだったが、
  //   volumedetectで全区間有音（-22dB前後）を確認し均等補間で扱った。
  //   詳細: .cache/anrakugyohon_merged.txt
  {
    id: "honkoji-anrakugyohon",
    displayTitle: "安楽行品",
    title: "妙法蓮華経 安楽行品第十四（本光寺 Live）",
    subtitle: "安楽行品第十四 全文読誦（四安楽行・髻中明珠の譬え）",
    kind: "youtube",
    youtubeId: "16u7E86jzWs",
    sutraIds: ["anrakugyohon"],
    timings: [
      { lineId: "an01", start:   8.0 },
      { lineId: "an02", start:  51.0 },
      { lineId: "an03", start:  73.0 },
      { lineId: "an04", start: 107.0 },
      { lineId: "an05", start: 132.0 },
      { lineId: "an06", start: 155.0 },
      { lineId: "an07", start: 175.0 },
      { lineId: "an08", start: 191.0 },
      { lineId: "an09", start: 208.0 },
      { lineId: "an10", start: 218.0 },
      { lineId: "an11", start: 248.7 },
      { lineId: "an12", start: 260.0 },
      { lineId: "an13", start: 273.0 },
      { lineId: "an14", start: 286.0 },
      { lineId: "an15", start: 300.0 },
      { lineId: "an16", start: 313.0 },
      { lineId: "an17", start: 375.0 },
      { lineId: "an18", start: 400.0 },
      { lineId: "an19", start: 440.7 },
      { lineId: "an20", start: 481.4 },
      { lineId: "an21", start: 522.1 },
      { lineId: "an22", start: 562.8 },
      { lineId: "an23", start: 603.5 },
      { lineId: "an24", start: 644.2 },
      { lineId: "an25", start: 684.9 },
      { lineId: "an26", start: 725.6 },
      { lineId: "an27", start: 766.3 },
      { lineId: "an28", start: 807.0 },
      { lineId: "an29", start: 847.7 },
    ],
  },

  // ===== 従地涌出品第十五（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 従地涌出品第十五（地涌の菩薩の出現と弥勒の疑問）
  // YouTube ID: DL5yxRxAomA  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 737.83s（12分17秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜738s
  //
  // タイミング: 冒頭〜200s台（地涌の菩薩の眷属の数の列挙・二仏への礼拝）
  //   はWhisperで語句レベル確認、原典と一字一句近い精度で対応が取れた。
  //   200-738sは「お祈りします」「読手読手」等の反復ハルシネーションだったが、
  //   volumedetectで全区間有音を確認し均等補間で扱った。
  //   詳細: .cache/juchiyujutsuhon_merged.txt
  {
    id: "honkoji-juchiyujutsuhon",
    displayTitle: "従地涌出品",
    title: "妙法蓮華経 従地涌出品第十五（本光寺 Live）",
    subtitle: "従地涌出品第十五 全文読誦（地涌の菩薩・弥勒の疑問）",
    kind: "youtube",
    youtubeId: "DL5yxRxAomA",
    sutraIds: ["juchiyujutsuhon"],
    timings: [
      { lineId: "jy01", start:   8.0 },
      { lineId: "jy02", start:  39.0 },
      { lineId: "jy03", start:  70.0 },
      { lineId: "jy04", start: 100.0 },
      { lineId: "jy05", start: 123.0 },
      { lineId: "jy06", start: 151.0 },
      { lineId: "jy07", start: 174.0 },
      { lineId: "jy08", start: 193.0 },
      { lineId: "jy09", start: 205.0 },
      { lineId: "jy10", start: 249.4 },
      { lineId: "jy11", start: 293.8 },
      { lineId: "jy12", start: 338.2 },
      { lineId: "jy13", start: 382.6 },
      { lineId: "jy14", start: 427.0 },
      { lineId: "jy15", start: 471.4 },
      { lineId: "jy16", start: 515.8 },
      { lineId: "jy17", start: 560.2 },
      { lineId: "jy18", start: 604.6 },
      { lineId: "jy19", start: 649.0 },
      { lineId: "jy20", start: 693.4 },
    ],
  },

  // ===== 如来寿量品第十六（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 如来寿量品第十六（久遠実成と良医治子の譬え）
  // YouTube ID: 4SkckGoAqhw  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 505.01s（8分25秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜505s
  //
  // タイミング: 冒頭〜140s台（久遠実成の宣言・塵点劫の譬え）はWhisperで
  //   語句レベル確認、原典と一字一句近い精度で対応が取れた。165-505sは
  //   「聖書を読みます」「お祈りします」等の反復ハルシネーションだったが、
  //   volumedetectで全区間有音を確認し均等補間で扱った。
  //   詳細: .cache/juryohon_merged.txt
  {
    id: "honkoji-juryohon",
    displayTitle: "如来寿量品",
    title: "妙法蓮華経 如来寿量品第十六（本光寺 Live）",
    subtitle: "如来寿量品第十六 全文読誦（久遠実成・良医治子の譬え）",
    kind: "youtube",
    youtubeId: "4SkckGoAqhw",
    sutraIds: ["juryohon"],
    timings: [
      { lineId: "jr01", start:  15.0 },
      { lineId: "jr02", start:  44.0 },
      { lineId: "jr03", start:  60.0 },
      { lineId: "jr04", start:  82.0 },
      { lineId: "jr05", start:  90.0 },
      { lineId: "jr06", start: 115.0 },
      { lineId: "jr07", start: 140.0 },
      { lineId: "jr08", start: 165.0 },
      { lineId: "jr09", start: 191.2 },
      { lineId: "jr10", start: 217.4 },
      { lineId: "jr11", start: 243.6 },
      { lineId: "jr12", start: 269.8 },
      { lineId: "jr13", start: 296.0 },
      { lineId: "jr14", start: 322.2 },
      { lineId: "jr15", start: 348.4 },
      { lineId: "jr16", start: 374.6 },
      { lineId: "jr17", start: 400.8 },
      { lineId: "jr18", start: 427.0 },
      { lineId: "jr19", start: 453.2 },
      { lineId: "jr20", start: 479.4 },
    ],
  },

  // ===== 分別功徳品第十七（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 分別功徳品第十七（久遠実成を聞いた大衆の功徳）
  // YouTube ID: 5bEGLQvkNms  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 678.15s（11分18秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜678s
  //
  // タイミング: 5箇所の確認済みアンカー（総説冒頭12s・曼陀羅華の雨223s・
  //   六波羅蜜の比較276s・生きた塔の教え560s）に基づく構造配置。以降は
  //   反復ハルシネーションだったがvolumedetectで無音でないことを確認し
  //   均等補間で扱った。詳細: .cache/funbetsukudokuhon_merged.txt
  {
    id: "honkoji-funbetsukudokuhon",
    displayTitle: "分別功徳品",
    title: "妙法蓮華経 分別功徳品第十七（本光寺 Live）",
    subtitle: "分別功徳品第十七 全文読誦（久遠実成を聞いた大衆の功徳）",
    kind: "youtube",
    youtubeId: "5bEGLQvkNms",
    sutraIds: ["funbetsukudokuhon"],
    timings: [
      { lineId: "fb01", start:  12.0 },
      { lineId: "fb02", start:  42.0 },
      { lineId: "fb03", start:  72.0 },
      { lineId: "fb04", start: 102.0 },
      { lineId: "fb05", start: 132.0 },
      { lineId: "fb06", start: 162.0 },
      { lineId: "fb07", start: 192.0 },
      { lineId: "fb08", start: 222.0 },
      { lineId: "fb09", start: 231.0 },
      { lineId: "fb10", start: 240.0 },
      { lineId: "fb11", start: 249.0 },
      { lineId: "fb12", start: 258.0 },
      { lineId: "fb13", start: 267.0 },
      { lineId: "fb14", start: 276.0 },
      { lineId: "fb15", start: 299.7 },
      { lineId: "fb16", start: 323.3 },
      { lineId: "fb17", start: 347.0 },
      { lineId: "fb18", start: 370.7 },
      { lineId: "fb19", start: 394.3 },
      { lineId: "fb20", start: 418.0 },
      { lineId: "fb21", start: 441.7 },
      { lineId: "fb22", start: 465.3 },
      { lineId: "fb23", start: 489.0 },
      { lineId: "fb24", start: 512.7 },
      { lineId: "fb25", start: 536.3 },
      { lineId: "fb26", start: 560.0 },
      { lineId: "fb27", start: 619.0 },
    ],
  },

  // ===== 随喜功徳品第十八（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 随喜功徳品第十八（五十展転の随喜の功徳）
  // YouTube ID: wWxM4K2yvyI  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 388.27s（6分28秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜388s
  //
  // タイミング: 152-200s台（大施主の譬え中の四道・第五十人の随喜の
  //   功徳の比較）はWhisperで語句レベル確認、原典と一字一句近い精度で
  //   対応が取れた。200-388sは「お祭りをお祈りいたします」の反復
  //   ハルシネーションだったがvolumedetectで無音でないことを確認し
  //   均等補間で扱った。詳細: .cache/zuikikudokuhon_merged.txt
  {
    id: "honkoji-zuikikudokuhon",
    displayTitle: "随喜功徳品",
    title: "妙法蓮華経 随喜功徳品第十八（本光寺 Live）",
    subtitle: "随喜功徳品第十八 全文読誦（五十展転の随喜の功徳）",
    kind: "youtube",
    youtubeId: "wWxM4K2yvyI",
    sutraIds: ["zuikikudokuhon"],
    timings: [
      { lineId: "zk01", start:   5.0 },
      { lineId: "zk02", start:  29.5 },
      { lineId: "zk03", start:  54.0 },
      { lineId: "zk04", start:  78.5 },
      { lineId: "zk05", start: 103.0 },
      { lineId: "zk06", start: 127.5 },
      { lineId: "zk07", start: 152.0 },
      { lineId: "zk08", start: 165.3 },
      { lineId: "zk09", start: 177.7 },
      { lineId: "zk10", start: 189.0 },
      { lineId: "zk11", start: 220.8 },
      { lineId: "zk12", start: 252.7 },
      { lineId: "zk13", start: 284.5 },
      { lineId: "zk14", start: 316.3 },
      { lineId: "zk15", start: 348.2 },
      { lineId: "zk16", start: 380.0 },
    ],
  },

  // ===== 法師功徳品第十九（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 法師功徳品第十九（六根清浄の功徳）
  // YouTube ID: iQ8aCyCDfRc  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 747.97s（12分28秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜748s
  //
  // タイミング: 天龍八部への言及（約147s）・鼻根功徳中の天華の香り
  //   「摩訶曼陀羅華香」等（約300s）・天龍八部の男女両形への言及
  //   （約505s）の3箇所がWhisperで語句レベル確認、原典と一字一句近い
  //   精度で対応が取れた。それ以外は反復ハルシネーションだったが、
  //   volumedetectで無音でないことを確認し均等補間で扱った。
  //   詳細: .cache/hosshikudokuhon_merged.txt
  {
    id: "honkoji-hosshikudokuhon",
    displayTitle: "法師功徳品",
    title: "妙法蓮華経 法師功徳品第十九（本光寺 Live）",
    subtitle: "法師功徳品第十九 全文読誦（六根清浄の功徳）",
    kind: "youtube",
    youtubeId: "iQ8aCyCDfRc",
    sutraIds: ["hosshikudokuhon"],
    timings: [
      { lineId: "hk01", start:   5.0 },
      { lineId: "hk02", start:  40.5 },
      { lineId: "hk03", start:  76.0 },
      { lineId: "hk04", start: 111.5 },
      { lineId: "hk05", start: 147.0 },
      { lineId: "hk06", start: 185.3 },
      { lineId: "hk07", start: 223.5 },
      { lineId: "hk08", start: 261.8 },
      { lineId: "hk09", start: 300.0 },
      { lineId: "hk10", start: 351.3 },
      { lineId: "hk11", start: 402.5 },
      { lineId: "hk12", start: 453.8 },
      { lineId: "hk13", start: 505.0 },
      { lineId: "hk14", start: 559.0 },
    ],
  },

  // ===== 常不軽菩薩品第二十（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 常不軽菩薩品第二十（常不軽菩薩の物語）
  // YouTube ID: x5BpHXnVxRs  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 415.9s（6分56秒）、字幕なし（読経声のみ）。実質読誦区間: 約6〜416s
  //
  // タイミング: この章は特に語句レベルの確認精度が高く、品名（8s）・
  //   得大勢菩薩への呼びかけ（13s）・威音王如来とその十号（50-68s）・
  //   仏寿四十万億那由他（93s）・最後威音王如来の滅度（126s）・
  //   六根清浄と寿命延長（200s台）・雲自在灯王との出会い（238s台）・
  //   功徳成就（256s台）が原典と極めて近い精度でWhisper確認できた。
  //   詳細: .cache/jofukyohon_merged.txt
  {
    id: "honkoji-jofukyohon",
    displayTitle: "常不軽菩薩品",
    title: "妙法蓮華経 常不軽菩薩品第二十（本光寺 Live）",
    subtitle: "常不軽菩薩品第二十 全文読誦（常不軽菩薩の物語）",
    kind: "youtube",
    youtubeId: "x5BpHXnVxRs",
    sutraIds: ["jofukyohon"],
    timings: [
      { lineId: "jf01", start:   8.0 },
      { lineId: "jf02", start:  42.0 },
      { lineId: "jf03", start:  70.0 },
      { lineId: "jf04", start:  93.0 },
      { lineId: "jf05", start: 126.0 },
      { lineId: "jf06", start: 140.8 },
      { lineId: "jf07", start: 155.6 },
      { lineId: "jf08", start: 170.4 },
      { lineId: "jf09", start: 185.2 },
      { lineId: "jf10", start: 200.0 },
      { lineId: "jf11", start: 218.0 },
      { lineId: "jf12", start: 238.0 },
      { lineId: "jf13", start: 256.0 },
      { lineId: "jf14", start: 304.0 },
      { lineId: "jf15", start: 352.0 },
      { lineId: "jf16", start: 400.0 },
    ],
  },

  // ===== 如来神力品第二十一（YouTube・本光寺 Live） =====
  // Ground Truth: 妙法蓮華経 如来神力品第二十一（十神力の顕現と付嘱）
  // YouTube ID: pSWxiFG8xJY  チャンネル: 本光寺 Live (UCiw39reqgNCUzRi-mgrFA6g)
  // 収録: 334.8s（5分35秒）、字幕なし（読経声のみ）。実質読誦区間: 約5〜330s
  //
  // タイミング: 本セッション中でも屈指の高精度確認区間。天龍八部衆
  //   （76-84s）・十神力の舌相光明（84-99s）・謦欬弾指六種震動
  //   （99-112s）・付嘱の核心句「以要言之」（200-217s）・受持読誦の
  //   勧め（217-232s）・道場の宣言（237-251s）が原典と極めて近い精度
  //   でWhisper確認できた。詳細: .cache/jinrikihon_merged.txt
  {
    id: "honkoji-jinrikihon",
    displayTitle: "如来神力品",
    title: "妙法蓮華経 如来神力品第二十一（本光寺 Live）",
    subtitle: "如来神力品第二十一 全文読誦（十神力の顕現と付嘱）",
    kind: "youtube",
    youtubeId: "pSWxiFG8xJY",
    sutraIds: ["jinrikihon"],
    timings: [
      { lineId: "jr01", start:  10.0 },
      { lineId: "jr02", start:  67.0 },
      { lineId: "jr03", start:  84.0 },
      { lineId: "jr04", start:  99.0 },
      { lineId: "jr05", start: 130.0 },
      { lineId: "jr06", start: 165.0 },
      { lineId: "jr07", start: 185.0 },
      { lineId: "jr08", start: 200.0 },
      { lineId: "jr09", start: 217.0 },
      { lineId: "jr10", start: 237.0 },
    ],
  },

  // ===== 方便品 初級練習動画（YouTube・浦和円蔵寺） =====
  // Ground Truth: 妙法蓮華経方便品第二（フリガナあり）【お経練習・初級編】
  // YouTube ID: BqKMEP3TeBk  チャンネル: 浦和円蔵寺（日蓮宗）  収録: 243s (4:03)
  // 採用理由: フリガナ付き・1行下部静止表示・OCR可能・全文カバー（十如是三返含む）
  //   表示形式: 1行下部静止（フリガナ付き・2〜3句同時表示）
  //   タイトルカード: 〜19s。読経開始: 20s (h1)
  //   動画内注記: 165s「所謂諸法から最後までは、3回繰り返します。」
  //   十如是: 1回目165s / 2回目185s / 3回目208s
  //
  // OCRアンカー（D=直接確認フレーム, I=遷移フレームから逆算）:
  //   D f0020=20s(h1) D f0024=24s(h2) D f0035=35s(h3)
  //   I f0040=40s(h4≈38s) I f0050=50s(h5≈48s) I f0060=60s(h6≈58s)
  //   I f0070=70s(h10≈68s) I f0085=85s(h11≈80s) I f0090=90s(h12≈88s)
  //   I f0100=100s(h13≈97s) I f0110=110s(h14≈107s) I f0120=120s(h15≈115s)
  //   D f0120=120s(h16) D f0130=130s(h17) I f0140=140s(h18≈143s)
  //   D f0160=158s(h19) D f0165=165s(h7) D f0175=175s(h8)
  //   I f0180=180s(h9≈178s) I h20≈185s D f0195=195s(h21)
  //   I f0205=205s(h22末→h22≈200s) D f0208=208s(h23)
  //   I f0220=220s(h24≈218s) I f0225=225s(h25≈223s)
  {
    id: "enzoiji-hobenpon",
    displayTitle: "方便品第二",
    title: "妙法蓮華経方便品第二（フリガナあり）【お経練習・初級編】",
    subtitle: "浦和円蔵寺（日蓮宗）- 方便品第二 初級練習動画",
    kind: "youtube",
    youtubeId: "BqKMEP3TeBk",
    sutraIds: ["hobenpon"],
    timings: [
      // ---- 方便品 長行 (h1-h6, h10-h19) ----
      { lineId: "h1",  start:  20.0 }, // D f0020 爾時世尊。従三昧安詳而起。
      { lineId: "h2",  start:  24.0 }, // D f0024 諸仏智慧。甚深無量。
      { lineId: "h3",  start:  35.0 }, // D f0035 一切声聞。辟支仏。
      { lineId: "h4",  start:  38.0 }, // I 所以者何[h4] 初出 (f0040: 所不能知。所以者何。)
      { lineId: "h5",  start:  48.0 }, // I 尽行諸仏 初出 (f0050: 無数諸仏。尽行諸仏。)
      { lineId: "h6",  start:  58.0 }, // I 成就甚深 初出 (f0060: 名称普聞。成就甚深。)
      { lineId: "h10", start:  68.0 }, // I 舎利弗[h10] 初出 (f0070: 意趣難解。舎利弗。)
      { lineId: "h11", start:  80.0 }, // I 広演言教 初出 (f0085=85s: 引導衆生。令離諸著。)
      { lineId: "h12", start:  88.0 }, // I 所以者何[h12] 初出 (f0090: 所以者何。如来方便。)
      { lineId: "h13", start:  97.0 }, // I 舎利弗[h13] 初出 (f0100: 如来知見。広大深遠。)
      { lineId: "h14", start: 107.0 }, // I 力 初出 (f0110: 禅定。解脱。三昧。)
      { lineId: "h15", start: 115.0 }, // I 深入無際 初出 (f0120: 未曾有法。舎利弗。)
      { lineId: "h16", start: 120.0 }, // D f0120 舎利弗[h16] 初出
      { lineId: "h17", start: 130.0 }, // D f0130 舎利弗[h17] 初出 (悦可衆心。舎利弗。)
      { lineId: "h18", start: 143.0 }, // I 止 初出 (h17末: f0140=140s: 未曾有法。仏悉成就。)
      { lineId: "h19", start: 158.0 }, // D f0160 唯仏与仏。乃能究尽。
      // ---- 方便品 十如是 1回目 (h7-h9) ----
      { lineId: "h7",  start: 165.0 }, // D f0165 所謂諸法 初出（諸法実相。所謂諸法。遷移表示）
      { lineId: "h8",  start: 175.0 }, // D f0175 如是力。如是作。如是因。
      { lineId: "h9",  start: 178.0 }, // I 如是果 初出 (f0180: 如是縁。如是果。如是報。)
      // ---- 方便品 十如是 2回目 (h20-h22) ----
      { lineId: "h20", start: 185.0 }, // I h9末後 即開始（1回目と同パターン）
      { lineId: "h21", start: 195.0 }, // D f0195 如是力。如是作。如是因。(2回目)
      { lineId: "h22", start: 200.0 }, // I 如是果[2回目] 初出 (f0205=205s: 如是本末究竟等。)
      // ---- 方便品 十如是 3回目 (h23-h25) ----
      { lineId: "h23", start: 208.0 }, // D f0208 所謂諸法。(3回目、単独表示)
      { lineId: "h24", start: 218.0 }, // I 如是力[3回目] 初出 (f0220=220s確認)
      { lineId: "h25", start: 223.0 }, // I 如是果[3回目] 初出 (f0225: 如是縁。如是果。如是報。)
    ],
  },

  // ===== ローカル音声（同期デモ用・無音プレースホルダー） =====
  // start 値は仮。同期UIの動作確認用。実音源に差し替えたら実測し直すこと。
  {
    id: "hobenpon-local",
    displayTitle: "方便品（デモ）",
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
    displayTitle: "自我偈（デモ）",
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
