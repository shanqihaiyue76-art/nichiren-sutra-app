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
