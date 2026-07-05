# 読経アプリ 開発状況

最終更新: 2026-07-05（常不軽菩薩品第二十 実装完了・デプロイ確認済み）

このファイルは実装済み内容・QA状況・Git履歴の記録。
運用ルール・STOP条件は [MASTER_SKILL.md](./MASTER_SKILL.md)、
技術手順は [WORKFLOW.md](./WORKFLOW.md)、残タスクは [TODO.md](./TODO.md) を参照。

---

## QA品質基準

| 基準 | 内容 |
|------|------|
| Ground Truth | 採用YouTube動画の字幕表示タイミングのみ |
| 計測方法 | 動画OCR字幕表示時刻 × Whisper音声オンセット × DTW の3点照合 |
| 合格基準 | 動画字幕とアプリ字幕が目視で違和感なく一致・最後までズレない・繰り返し部分も動画どおり |

### タイミングステータス凡例

| マーク | 意味 |
|--------|------|
| ✅ 完成 | OCR/Whisper/DTW照合済み。品質基準クリア |
| ⚠️ 要再同期 | OCRアンカー不足または補間精度要改善。QA不合格 |
| ❌ 動画変更候補あり | 採用動画に字幕なし。OCR不可。別動画への差し替えが必要 |

---

## 第一段階（基本勤行）QA状況

| 読経 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|------|---------|------|-------------|------|------|
| 開経偈 | kaikyoge.ts | kingyo19 | Whisper全行一致 | ✅ 完成 | |
| 方便品第二 | hobenpon.ts | kingyo19 | Whisper+DTW照合済 | ✅ 完成 | 十如是3回繰り返し含む |
| 自我偈 | jigage.ts | kingyo19 | Whisper+DTW照合済 | ✅ 完成 | |
| 題目 | daimoku.ts | kingyo19 | Whisper単一点確認 | ✅ 完成 | |
| 回向文 | ekomon-chogyo.ts | kingyo19 | OCR字幕表示時刻に全面改訂 | ✅ 完成 | 旧実装はWhisper音声オンセット使用（字幕より1.5〜4.2s遅延）→ OCR15点アンカーで再同期 |
| 宝塔偈 | hotoge.ts | kyushu-hotoge | OCR f0016確認(ht1=765s) | ✅ 完成 | Whisper不可(高速唱念)→OCR単独。hotoge_whisper=「お祈りします」3件のみ |
| 四誓（四弘誓願） | shishi.ts | kingyo19 | OCR確認済 | ✅ 完成 | 第2回唱開始時刻採用。動画表記: 無数/無尽（標準: 無量/学） |

---

## 第三段階（各種偈）QA状況

| 偈文 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|------|---------|------|-------------|------|------|
| 宝塔偈 | hotoge.ts | XivPWmWJO2c | OCR確認済 | ✅ 完成 | 上表と同じ |
| 神力偈 | jinrikige.ts | 26UL4RmM0hY | OCR13点×全64句一致 | ✅ 完成 | 旧動画I9KKyj0BDOI（字幕なし）→見法寺字幕動画に差し替え。jr_n=20+(n-1)×3.333s、13フレーム誤差ゼロ確認 |
| 観音偈 | kannonge.ts | _CyvlLqEWUs | OCRアンカー18点(118句) | ✅ 完成 | ko57-ko62(3.75s/句)・ko63-ko74(3.0s/句)・ko112-ko115(2.6s/句)の補間レート誤差を全修正。残補間精度±2s以内。 |
| 普賢勧発偈 | fugenkanpatsuge.ts | honkoji-fugen (ht8TC7DHfS4) | Whisper large-v3 47セグメント | ✅ 完成（暫定） | **Ground Truth方式v2.0で実装**（字幕なし動画を採用）。本光寺Liveチャンネル・468s・全文46行（長行のみ、偈頌構成ではない）。テキストは大正新脩大蔵経T0262の再構成（AI knowledge、`source: ai_sample`）。Whisper音声認識と照合し章立て・語順は確認済みだが、字句レベルは原典未照合＝`provenance.status: provisional`。詳細は下記「Ground Truth方式 v2.0」参照 |

---

## 第二段階（法華経二十八品）

| 品 | ファイル | 動画 | タイミングQA | 状態 | 備考 |
|----|---------|------|-------------|------|------|
| 提婆達多品第十二 | daibadatta.ts | v6tSdCVw354 | OCR 26点×5s精度確認 | ✅ 完成 | 龍女成仏。偈頌db01-db04+長行db05-db26。章前半（提婆達多物語）は動画に含まれず未収録 |
| 普賢菩薩勧発品第二十八 | fugenkanpatsuge.ts | honkoji-fugen (ht8TC7DHfS4) | Whisper large-v3 47セグメント | ✅ 完成（暫定） | 上表「普賢勧発偈」と同一実装（全文46行のため二重計上）。テキスト要原典照合 |
| 序品第一 | johon.ts | honkoji-johon (Tnqm52v9xZQ) | Whisper large-v3 6チャンク・構造アンカー確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全118行・10セクション（序分〜声聞衆〜菩薩衆〜天龍八部衆〜入定瑞相〜放光〜弥勒疑念〜弥勒偈問〜文殊答長行〜文殊重頌）。テキストは大正新脩大蔵経T0262の再構成（ai_sample）。タイミングはセクション境界を構造確認の上、行数に応じた均等補間（要DTW/OCR精密照合） |
| 方便品第二（全文） | hobenponzenbun.ts | honkoji-hobenponzenbun (S5caezkoUG0) | Whisper large-v3 7チャンク・長行部語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全71行・7セクション（長行1〜十如是〜長行2〜偈1-4）。十如是・一大事因縁・一仏乗・三止三請・五千退席を含む全文収録。既存`hobenpon.ts`（十如是抜粋のみ）とは別物。長行部（11-400s）は十如是が136-171s台に直接出現するなど語句レベルでも比較的明瞭。偈頌部（400-1328s）は音写崩れが著しくセクション境界+均等補間（要DTW/OCR精密照合） |
| 譬喩品第三 | hiyuhon.ts | honkoji-hiyuhon (D965nIz_Ufg) | Whisper large-v3 8チャンク・冒頭/火宅導入部語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全90行・5セクション（舎利弗踊躍歓喜偈・記別/四衆供養・重請/火宅の譬え本体/合譬/重頌）。三車火宅の譬え（法華経で最も著名な譬喩）を全文収録。冒頭「にじしゃりほつゆやかんぎ」・火宅導入部「長者」が136-171s台等で語句レベルでも明瞭に確認できたが、長大な譬喩・偈頌の中盤は音写崩れが著しくセクション境界+均等補間（要DTW/OCR精密照合） |
| 信解品第四 | shingehon.ts | honkoji-shingehon (1YlVyFbN8mA) | Whisper large-v3 5チャンク・volumedetectで全編有音確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全73行・5セクション（四大声聞の歓喜・窮子の譬え導入/窮子の譬え前半/後半/合譬/重頌）。長者窮子の譬えを全文収録。Whisper反復定型句（「ご視聴ありがとうございました」）が動画中盤にも出現したが、volumedetect/silencedetectで無音でないと確認し全編を実質読誦区間として扱った（要DTW/OCR精密照合。手法はWORKFLOW.md参照） |
| 薬草喩品第五 | yakusoyuhon.ts | honkoji-yakusoyuhon (LGsPXrUxDUE) | Whisper large-v3 3チャンク・volumedetectで全編有音確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全45行・4セクション（仏の称賛・導入/三草二木の譬え本体/一相一味の法/重頌）。三草二木の譬え（大雲の譬え）を全文収録（要DTW/OCR精密照合） |
| 授記品第六 | jukihon.ts | honkoji-jukihon (Gu6YDp_FMT0) | Whisper large-v3 3チャンク・冒頭/須菩提記別冒頭語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全37行・5セクション（迦葉への記別・長行/重頌/須菩提への記別/大迦旃延への記別/大目犍連への記別）。四大声聞への記別を全文収録。事前にffmpeg silencedetectで無音区間なしを確認（要DTW/OCR精密照合） |
| 化城喩品第七 | kejohon.ts | honkoji-kejohon (tXWQkYZkkgk) | Whisper large-v3 8チャンク・十二因縁区間語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全61行・6セクション（大通智勝仏の物語導入/十六王子・請法/十六沙弥の教化/十二因縁/化城の譬え本体・合譬/重頌）。化城の譬えを全文収録。831-853s付近で十二因縁（無明縁行…）の音写と直接対応する語句レベルで明瞭な区間を確認。1042-1469.5sは反復定型句だったがvolumedetect/silencedetectで無音でないと確認し全編を実質読誦区間として扱った（要DTW/OCR精密照合） |
| 五百弟子受記品第八 | gohyakuhon.ts | honkoji-gohyakuhon (Zv9gGKxP6Ro) | Whisper large-v3 4チャンク・冒頭0-198s語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全43行・6セクション（富楼那への序/記別・長行/記別・重頌/千二百羅漢の願い・五百羅漢への記別/衣裏繋珠の譬え/合譬・重頌）。衣裏繋珠の譬えを全文収録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭0-198s（品名・富楼那の描写・記別冒頭）が語句レベルで極めて明瞭（要DTW/OCR精密照合） |
| 授学無学人記品第九 | jugakuhon.ts | honkoji-jugakuhon (GRKznTuERkw) | Whisper large-v3 3チャンク・冒頭0-198s語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全22行・4セクション（阿難・羅睺羅の願い/阿難への記別/羅睺羅への記別/二千人への記別・重頌）。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭0-198s（品名・阿難羅睺羅の願い・阿難への記別冒頭）が語句レベルで極めて明瞭（要DTW/OCR精密照合） |
| 法師品第十 | hosshihon.ts | honkoji-hosshihon (un3sFgKOgpU) | Whisper large-v3 4チャンク・冒頭語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全21行・6セクション（導入・一念随喜者への記別/五種法師の功徳/塔を建てての供養・誹謗の罪/道場としての功徳・重頌/如来の衣・座・室（三軌）/守護の約束・重頌）。冒頭は品名・薬王への呼びかけ・「一偈一句乃至一念随喜者」が明瞭だったが、508-620s付近は「説明」の反復誤認識。volumedetectで無音でないことを確認し全編を実質読誦区間として扱った（要DTW/OCR精密照合） |
| 見宝塔品第十一 | hotohon.ts | honkoji-hotohon (GFBo3otgdCg) | Whisper large-v3 4チャンク・冒頭語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全27行・9セクション（宝塔の涌現・宝塔からの声/大楽説菩薩の質問/多宝仏の本願/分身諸仏の召集/娑婆世界の浄化・分身仏の来集/開塔の準備/開塔・多宝仏との対面/二仏並座/説法の勧め・付嘱の予告）。二仏並座を全文収録。既存`hotoge.ts`（宝塔偈）とは別物。冒頭は品名・宝塔の描写・「善哉善哉釈迦牟尼世尊」が明瞭だったが、260-400s付近は「説明」の反復誤認識。volumedetectで無音でないことを確認し全編を実質読誦区間として扱った（要DTW/OCR精密照合） |
| 勧持品第十三 | kanjihon.ts | honkoji-kanjihon (RxrISsOBVng) | Whisper large-v3 2チャンク・冒頭語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全19行・6セクション（薬王・大楽説菩薩の誓い/五百阿羅漢・学無学八千人の誓い/摩訶波闍波提比丘尼への記別/耶輸陀羅比丘尼への記別・二千比丘尼の歓喜/諸菩薩の誓い/有二十行の偈）。三類の強敵に耐え忍び不自惜身命を誓う「二十行の偈」（日蓮宗で最重視される一節）を全文収録。冒頭は品名・薬王菩薩／大楽説菩薩への言及が明瞭だったが、以降は音写崩れが著しくsilencedetectで無音区間なしを確認の上均等補間（要DTW/OCR精密照合） |
| 安楽行品第十四 | anrakugyohon.ts | honkoji-anrakugyohon (16u7E86jzWs) | Whisper large-v3 5チャンク・冒頭〜260s台語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全29行・13セクション（文殊師利の請問・四安楽行総説/第一身安楽行の行処/親近処その一〜三/第二親近処・諸法空観/身安楽行の重頌/第二口安楽行/第三意安楽行/第四誓願安楽行/誓願安楽行の重頌/髻中明珠の譬え/締めくくり）。四安楽行（身・口・意・誓願）と、法華経が諸経中最高であることを示す「髻中明珠の譬え」を全文収録。冒頭〜260s台（四安楽行総説・行処・親近処・偈頌冒頭）は原典と一字一句近い精度でWhisper確認できたが、400-888sは「♪〜」等の反復ハルシネーションでありvolumedetectで無音でないことを確認し均等補間（要DTW/OCR精密照合） |
| 従地涌出品第十五 | juchiyujutsuhon.ts | honkoji-juchiyujutsuhon (DL5yxRxAomA) | Whisper large-v3 4チャンク・冒頭〜200s台語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全20行・12セクション（他方の菩薩の請願と仏の制止/地涌の菩薩の出現/地涌の菩薩の眷属の数/地涌の菩薩たちの二仏への礼拝/四導師の登場・仏への問訊/弥勒の疑問・長行/弥勒の偈頌の疑問×3/分身諸仏の侍者の疑問/仏、弥勒に答える/地涌の菩薩は皆我が弟子であるという宣言）。地涌の菩薩の出現と弥勒の疑問（次章・如来寿量品の「久遠実成」への伏線）を収録。冒頭〜200s台（眷属の数の列挙・二仏への礼拝）は原典と一字一句近い精度でWhisper確認できたが、200-738sは「お祈りします」「読手読手」等の反復ハルシネーションでありvolumedetectで無音でないことを確認し均等補間（要DTW/OCR精密照合） |
| 如来寿量品第十六 | juryohon.ts | honkoji-juryohon (4SkckGoAqhw) | Whisper large-v3 3チャンク・冒頭〜140s台語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全20行・16セクション（三度の請問/如来秘密神通之力の宣言/久遠実成の宣言/塵点劫の譬え×2/常在此説法の宣言/衆生の機根に応じた方便/如来の寿命は無量であるという宣言/経典の真実性/良医治子の譬え×5/自我偈への導入）。法華経全体の教理的クライマックスである「久遠実成」の宣言（我實成佛已來。無量無邊百千萬億那由他劫）と、良医治子の譬えを収録。既存`jigage.ts`（自我偈、基本勤行で使用）とは別物で、重頌本体はjigage.tsに委ね本ファイルは長行部分と導入行のみ収録。冒頭〜140s台（久遠実成宣言・塵点劫の譬え）は原典と一字一句近い精度でWhisper確認できたが、165-505sは「聖書を読みます」等の反復ハルシネーションでありvolumedetectで無音でないことを確認し均等補間（要DTW/OCR精密照合） |
| 分別功徳品第十七 | funbetsukudokuhon.ts | honkoji-funbetsukudokuhon (5bEGLQvkNms) | Whisper large-v3 4チャンク・5箇所語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全27行・7セクション（大衆が得た利益の総説/菩薩たちが得た様々な功徳・階層別列挙/曼陀羅華の雨・諸仏への供養/一念信解の功徳/六波羅蜜との比較/弥勒の重頌/深心信解の相・生きた塔の教え）。久遠実成を聞いた大衆の様々な功徳と、「一念信解」が八十万億那由他劫の五波羅蜜の行に勝るという比較、経を持つ者のいる場所に塔を建てるべきという教えを収録。冒頭総説・曼陀羅華の雨（約223s）・六波羅蜜の比較（約276s）・生きた塔の教え（約560s）の計5箇所が原典と一字一句近い精度でWhisper確認できたが、それ以外は反復ハルシネーションでありvolumedetectで無音でないことを確認しアンカー間均等補間（要DTW/OCR精密照合） |
| 随喜功徳品第十八 | zuikikudokuhon.ts | honkoji-zuikikudokuhon (wWxM4K2yvyI) | Whisper large-v3 2チャンク・152-200s台語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全16行・6セクション（弥勒の問い/五十展転/大施主の譬え/四道の悟りと功徳の比較/聴聞・勧聴・伝達の功徳/端正な相好を得る功徳）。法華経を聞いて随喜し次々と50人に伝わった第五十人の随喜の功徳が、無量の衆生に楽具を施し阿羅漢果を得させる大施主の功徳より遥かに勝るという教理的比較を収録。152-200s台（大施主の譬え中の四道・第五十人の随喜の功徳の比較）が原典と一字一句近い精度でWhisper確認できたが、それ以外は反復ハルシネーションでありvolumedetectで無音でないことを確認し均等補間（要DTW/OCR精密照合） |
| 法師功徳品第十九 | hosshikudokuhon.ts | honkoji-hosshikudokuhon (iQ8aCyCDfRc) | Whisper large-v3 4チャンク・3箇所語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全14行・8セクション（総説/眼根功徳/耳根功徳/鼻根功徳/舌根功徳/身根功徳/意根功徳/締めくくり）。経を受持する者が得る六根（眼耳鼻舌身意）清浄の具体的な功徳（八百眼功徳・千二百耳功徳・八百鼻功徳・千二百舌功徳・八百身功徳・千二百意功徳）を収録。既存`hosshihon.ts`（法師品第十）とは全く別の章。天龍八部への言及（約147s）・鼻根功徳中の天華の香り（約300s）・天龍八部の男女両形への言及（約505s）の3箇所が原典と一字一句近い精度でWhisper確認できたが、それ以外は反復ハルシネーションでありvolumedetectで無音でないことを確認し均等補間（要DTW/OCR精密照合） |
| 常不軽菩薩品第二十 | jofukyohon.ts | honkoji-jofukyohon (x5BpHXnVxRs) | Whisper large-v3 3チャンク・多数箇所語句レベル確認 | ✅ 完成（暫定） | Ground Truth方式v2.0。全16行・7セクション（総説/威音王如来の物語/常不軽菩薩の登場と礼拝行/杖木瓦石による迫害と忍受/六根清浄と臨終後の功徳成就/常不軽菩薩＝釈迦仏自身の開示・迫害者の後の姿/教訓のまとめ）。日蓮が「不軽の行」として最も重視した章の一つを全文収録。品名・得大勢菩薩・威音王如来とその十号・仏寿四十万億那由他・六根清浄と寿命延長・雲自在灯王との出会い・功徳成就など、本セッション中でも特に高精度な語句レベル確認が多数箇所で得られた（要DTW/OCR精密照合） |
| 残7品 | — | — | 未着手 | 🔵 着手可能 | Ground Truth方式v2.0（字幕不要）により実装可能と判明。本光寺Liveチャンネルに全28品所蔵。動画IDリストは[TODO.md](./TODO.md)参照 |

---

## 全体完成率

基本勤行: 7/7 = **100%**（タイミングQA全完了）
偈文: 4/4 = **100%**（普賢勧発偈 実装完了・暫定データ）
法華経: 21/28 = **75%**（提婆達多品✅・普賢菩薩勧発品第二十八✅・序品第一✅・方便品第二✅・譬喩品第三✅・信解品第四✅・薬草喩品第五✅・授記品第六✅・化城喩品第七✅・五百弟子受記品第八✅・授学無学人記品第九✅・法師品第十✅・見宝塔品第十一✅・勧持品第十三✅・安楽行品第十四✅・従地涌出品第十五✅・如来寿量品第十六✅・分別功徳品第十七✅・随喜功徳品第十八✅・法師功徳品第十九✅・常不軽菩薩品第二十✅）
題目: 0/4 = **0%**

全体（カテゴリ計上ベース）: 32/43 ≈ **74%**
※ fugenkanpatsugeは「偈文」「法華経」両方に計上されるため、実装物としては30件（重複1件）。
※ 普賢勧発偈・提婆達多品(章前半欠)・序品第一・方便品第二・譬喩品第三・信解品第四・薬草喩品第五・授記品第六・化城喩品第七・五百弟子受記品第八・授学無学人記品第九・法師品第十・見宝塔品第十一・勧持品第十三・安楽行品第十四・従地涌出品第十五・如来寿量品第十六・分別功徳品第十七・随喜功徳品第十八・法師功徳品第十九・常不軽菩薩品第二十は `provenance.status: provisional` の暫定データ。原典照合前は学習モードで「未検証」表示のまま。

---

## Git状態（2026-07-01時点）

| コミット | 内容 | 状態 |
|---------|------|------|
| 9d08fe1 | miehouji-hobenpon PlaybackSource追加 | ✅ GitHub反映済 |
| 373e0e1 | miehouji-jigage PlaybackSource追加 | ✅ GitHub反映済 |
| e8f90d9 | miehouji-kannonge PlaybackSource追加 | ✅ GitHub反映済 |
| 7f34d71 | PROJECT_STATUS更新（NPL9/J1m3/BqKM調査完了・STOP条件記録） | ✅ GitHub反映済 |
| cdc2671 | 提婆達多品第十二 実装（daibadatta.ts + index.ts + sources.ts） | ✅ GitHub反映済 |
| 21c9f9b | BqKMEP3TeBk 方便品第3ソース（enzoiji-hobenpon）追加 | ✅ GitHub反映済 |
| 9411e8d | PROJECT_STATUS更新（2026-07-01 セッション記録） | ✅ GitHub反映済 |
| 1027e35 | UI: displayTitle追加・トップカード順変更・経文名表示化 | ✅ GitHub反映済 |
| 2fea5d0 | PROJECT_STATUS更新（UI改善完了） | ✅ GitHub反映済 |
| 24da8f6 | docs: デプロイ完了・本番URL確認済み | ✅ GitHub反映済 |
| 538982e | feat: 普賢菩薩勧発品第二十八を追加（fugenkanpatsuge.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 5d97f02 | docs: MASTER_SKILL.md / WORKFLOW.md / TODO.md 新設・PROJECT_STATUS.md整理 | ✅ GitHub反映済 |
| 09dc048 | feat: 序品第一を追加（johon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 6ebbd9e | docs: 序品第一 完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 906e988 | feat: 方便品第二（全文）を追加（hobenponzenbun.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| e9db634 | docs: 方便品第二（全文）完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| bb0562f | feat: 譬喩品第三を追加（hiyuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 835928d | docs: 譬喩品第三完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 1585d85 | feat: 信解品第四を追加（shingehon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 3a47ed4 | docs: 信解品第四完了を反映・volumedetect手法をWORKFLOW.mdに追記 | ✅ GitHub反映済 |
| 3bf3a72 | feat: 薬草喩品第五を追加（yakusoyuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 4107798 | docs: 薬草喩品第五完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 5986624 | feat: 授記品第六を追加（jukihon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| b269405 | docs: 授記品第六完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| f6e273f | feat: 化城喩品第七を追加（kejohon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 2efe745 | docs: 化城喩品第七完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 730811f | feat: 五百弟子受記品第八を追加（gohyakuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 2a7e392 | docs: 五百弟子受記品第八完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 8daa3fb | feat: 授学無学人記品第九を追加（jugakuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 7884fdf | docs: 授学無学人記品第九完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| 7687265 | feat: 法師品第十を追加（hosshihon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| f1cb19f | docs: 法師品第十完了を反映（PROJECT_STATUS.md / TODO.md更新） | ✅ GitHub反映済 |
| c350f6f | feat: 見宝塔品第十一を追加（hotohon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| a5c4e0f | feat: 勧持品第十三を追加（kanjihon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 1b196ba | feat: 安楽行品第十四を追加（anrakugyohon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| ecc6c36 | feat: 従地涌出品第十五を追加（juchiyujutsuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| 3da85fa | feat: 如来寿量品第十六を追加（juryohon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| eec5d42 | feat: 分別功徳品第十七を追加（funbetsukudokuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| f84e7ca | feat: 随喜功徳品第十八を追加（zuikikudokuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| da1af6b | feat: 法師功徳品第十九を追加（hosshikudokuhon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |
| a0a74ec | feat: 常不軽菩薩品第二十を追加（jofukyohon.ts + sources.ts + index.ts） | ✅ GitHub反映済・本番確認済み |

**本番URL**: https://nichiren-sutra-app.vercel.app  
**Vercel**: 2026-07-05 自動デプロイ完了・本番確認済み（/sutra/jofukyohon, /play/honkoji-jofukyohon 動作確認OK。16行・7セクション表示・YouTube埋め込み正常）  
**origin/main HEAD**: a0a74ec

---

## キャッシュ済みデータ

| キャッシュ | 内容 |
|-----------|------|
| .cache/_oN7QCtk3lk.video.mp4 | 朝夕の勤行19分（kingyo19） |
| .cache/_oN7QCtk3lk.whisper.json | Whisper large-v3 全文（147セグメント） |
| .cache/XivPWmWJO2c（hotoge_survey/） | ゆっくり読む15分（宝塔偈） |
| .cache/hotoge_frames/ | 宝塔偈 1fps フレーム（750s〜） |
| .cache/shishi_frames/ | 四誓 1fps フレーム（1048-1082s） |
| .cache/kannon_frames_1fps/ | 観音偈 1fps フレーム（f0001=18s〜f0410=427s） |
| .cache/kaikyoge_frames/ | 開経偈フレーム |
| .cache/ekomon_frames/ | 回向文フレーム（950-1044s, 95枚） |
| .cache/frames_jigage/ | 自我偈フレーム |
| .cache/jinriki_frames/ | 旧神力偈フレーム3枚（I9KKyj0BDOI・字幕なし確認済み） |
| .cache/jinriki_I9KKyj0BDOI.16k.wav | 旧神力偈音声（WAV・廃止） |
| .cache/jinriki2_26UL4RmM.mp4 | 新神力偈動画（26UL4RmM0hY・見法寺・239s） |
| .cache/jinriki2_frames/ | 新神力偈 1fps フレーム（f0001=1s〜f0239=239s、239枚） |
| .cache/hotoge_whisper.json | 宝塔偈Whisper（3セグメント・「お祈りします」のみ、タイミング用途なし） |
| .cache/hoben_miehouji.mp4 | 方便品見法寺動画（v1fPDfKHC7I・213s） |
| .cache/hoben_miehouji_frames/ | 方便品見法寺 1fps フレーム（f0001〜f0213、213枚） |
| .cache/jigage_miehouji.mp4 | 自我偈見法寺動画（ZD4kXNmeeyQ・281.5s） |
| .cache/jigage_miehouji_frames/ | 自我偈見法寺 1fps フレーム（f0001〜f0282、282枚） |
| .cache/kannonge_miehouji.mp4 | 観音偈見法寺動画（KNMoi0cDOx0・401.9s） |
| .cache/kannonge_miehouji_frames/ | 観音偈見法寺 1fps フレーム（f0001〜f0402、402枚） |
| .cache/NPL9kmcH9Tk.mp4 | 法華経の勤行通し動画（NPL9kmcH9Tk・177MB・796s）調査済み・不採用 |
| .cache/NPL9_frames/ | NPL9 1fps フレーム（f0001〜f0796、796枚） |
| .cache/J1m3JjvNnGw.mp4 | 開経偈字幕付き動画（J1m3JjvNnGw・8.8MB・100s）調査済み・不採用 |
| .cache/J1m3_frames/ | J1m3 1fps フレーム（100枚） |
| .cache/BqKMEP3TeBk.mp4 | 方便品第二フリガナあり動画（BqKMEP3TeBk・11MB・243s）浦和・円蔵寺・保留 |
| .cache/BqKMEP3TeBk_frames/ | BqKMEP3TeBk 1fps フレーム（243枚） |

---

## 採用動画一覧

| 動画ID | タイトル | 用途 | 字幕 |
|--------|---------|------|------|
| _oN7QCtk3lk | 朝夕の勤行（19分）| kaikyoge/hobenpon/jigage/daimoku/ekomon-chogyo/shishi | あり（スクロール蓄積型） |
| XivPWmWJO2c | ゆっくり読む日蓮宗のお経【15分】(長崎県日蓮宗青年会) | hotoge | あり |
| ~~I9KKyj0BDOI~~ | ~~日蓮宗 お経 妙法蓮華経 如来神力品第二十一~~ | ~~jinrikige~~（廃止） | **なし** |
| 26UL4RmM0hY | 【お経練習・字幕有り】妙法蓮華経如来神力品第二十一 神力偈（見法寺法務チャンネル） | jinrikige | あり（2句同時白表示） |
| _CyvlLqEWUs | 観音経 慈悲と救いであらゆる願いが叶う偈文・7分 字幕（高野山真言宗 松島龍戒） | kannonge | あり |
| v1fPDfKHC7I | 【お経練習・字幕あり】妙法蓮華経方便品第二（見法寺法務チャンネル） | hobenpon (miehouji-hobenpon) | あり（2句同時白表示・213s） |
| ZD4kXNmeeyQ | 【お経練習・字幕有り】妙法蓮華経如来寿量品第十六 自我偈（見法寺法務チャンネル） | jigage (miehouji-jigage) | あり（2句同時白表示・281.5s） |
| KNMoi0cDOx0 | 【お経練習・字幕有り】妙法蓮華経観世音菩薩普門品第二十五 観音偈（見法寺法務チャンネル） | kannonge (miehouji-kannonge) | あり（2句同時白表示・401.9s） |
| ht8TC7DHfS4 | 妙法蓮華経 普賢菩薩勧発品第二十八（本光寺 Live） | fugenkanpatsuge (honkoji-fugen) | **なし**（Ground Truth方式v2.0＝Whisper音声認識を採用。本光寺Liveチャンネルは法華経全28品を字幕なしで所蔵） |
| Tnqm52v9xZQ | 妙法蓮華経 序品第一（本光寺 Live） | johon (honkoji-johon) | **なし**（Ground Truth方式v2.0。1114s、実質読誦0〜約1023.5s） |
| S5caezkoUG0 | 妙法蓮華経 方便品第二（本光寺 Live） | hobenponzenbun (honkoji-hobenponzenbun) | **なし**（Ground Truth方式v2.0。1336s、実質読誦約11〜1328.4s） |
| D965nIz_Ufg | 妙法蓮華経 譬喩品第三（本光寺 Live） | hiyuhon (honkoji-hiyuhon) | **なし**（Ground Truth方式v2.0。1596s、実質読誦約9.4〜1588.8s） |
| 1YlVyFbN8mA | 妙法蓮華経 信解品第四（本光寺 Live） | shingehon (honkoji-shingehon) | **なし**（Ground Truth方式v2.0。882s、volumedetectで全編有音確認の上、実質読誦約8〜880s） |
| LGsPXrUxDUE | 妙法蓮華経 薬草喩品第五（本光寺 Live） | yakusoyuhon (honkoji-yakusoyuhon) | **なし**（Ground Truth方式v2.0。508.9s、volumedetectで全編有音確認の上、実質読誦約5〜505s） |
| Gu6YDp_FMT0 | 妙法蓮華経 授記品第六（本光寺 Live） | jukihon (honkoji-jukihon) | **なし**（Ground Truth方式v2.0。509.7s、silencedetectで無音区間なしを確認の上、実質読誦約0〜505s） |
| tXWQkYZkkgk | 妙法蓮華経 化城喩品第七（本光寺 Live） | kejohon (honkoji-kejohon) | **なし**（Ground Truth方式v2.0。1470.07s、volumedetect/silencedetectで無音区間なしを確認の上、実質読誦約11〜1469.5s） |
| Zv9gGKxP6Ro | 妙法蓮華経 五百弟子受記品第八（本光寺 Live） | gohyakuhon (honkoji-gohyakuhon) | **なし**（Ground Truth方式v2.0。666.7s、事前silencedetectで無音区間なしを確認の上、実質読誦約13〜662s） |
| GRKznTuERkw | 妙法蓮華経 授学無学人記品第九（本光寺 Live） | jugakuhon (honkoji-jugakuhon) | **なし**（Ground Truth方式v2.0。417.4s、事前silencedetectで無音区間なしを確認の上、実質読誦約13〜411s） |
| un3sFgKOgpU | 妙法蓮華経 法師品第十（本光寺 Live） | hosshihon (honkoji-hosshihon) | **なし**（Ground Truth方式v2.0。624.4s、事前silencedetectで無音区間なしを確認の上、実質読誦約11〜624.4s） |
| GFBo3otgdCg | 妙法蓮華経 見宝塔品第十一（本光寺 Live） | hotohon (honkoji-hotohon) | **なし**（Ground Truth方式v2.0。689s、事前silencedetectで無音区間なしを確認の上、実質読誦約11〜689s） |
| RxrISsOBVng | 妙法蓮華経 勧持品第十三（本光寺 Live） | kanjihon (honkoji-kanjihon) | **なし**（Ground Truth方式v2.0。375.5s、事前silencedetectで無音区間なしを確認の上、実質読誦約11〜373s） |
| 16u7E86jzWs | 妙法蓮華経 安楽行品第十四（本光寺 Live） | anrakugyohon (honkoji-anrakugyohon) | **なし**（Ground Truth方式v2.0。888.14s、事前silencedetectで無音区間なしを確認の上、実質読誦約8〜888s） |
| DL5yxRxAomA | 妙法蓮華経 従地涌出品第十五（本光寺 Live） | juchiyujutsuhon (honkoji-juchiyujutsuhon) | **なし**（Ground Truth方式v2.0。737.83s、事前silencedetectで無音区間なしを確認の上、実質読誦約5〜738s） |
| 4SkckGoAqhw | 妙法蓮華経 如来寿量品第十六（本光寺 Live） | juryohon (honkoji-juryohon) | **なし**（Ground Truth方式v2.0。505.01s、事前silencedetectで無音区間なしを確認の上、実質読誦約5〜505s） |
| 5bEGLQvkNms | 妙法蓮華経 分別功徳品第十七（本光寺 Live） | funbetsukudokuhon (honkoji-funbetsukudokuhon) | **なし**（Ground Truth方式v2.0。678.15s、事前silencedetectで無音区間なしを確認の上、実質読誦約5〜678s） |
| wWxM4K2yvyI | 妙法蓮華経 随喜功徳品第十八（本光寺 Live） | zuikikudokuhon (honkoji-zuikikudokuhon) | **なし**（Ground Truth方式v2.0。388.27s、事前silencedetectで無音区間なしを確認の上、実質読誦約5〜388s） |
| iQ8aCyCDfRc | 妙法蓮華経 法師功徳品第十九（本光寺 Live） | hosshikudokuhon (honkoji-hosshikudokuhon) | **なし**（Ground Truth方式v2.0。747.97s、事前silencedetectで無音区間なしを確認の上、実質読誦約5〜748s） |
| x5BpHXnVxRs | 妙法蓮華経 常不軽菩薩品第二十（本光寺 Live） | jofukyohon (honkoji-jofukyohon) | **なし**（Ground Truth方式v2.0。415.9s、事前silencedetectで冒頭5.16秒のみの無音を確認の上、実質読誦約6〜416s） |

### 調査済み・不採用動画（追加調査 2026-06-30）

| 動画ID | タイトル | 判定 | 理由 |
|--------|---------|------|------|
| NPL9kmcH9Tk | お経の王様 法華経の勤行 聴き流すだけでも絶大の効果【字幕付】(13:16) | ❌ 不採用 | 標準日蓮宗勤行の通し動画（開経偈+方便品+自我偈+神力品+観音経+題目+宝塔偈）。全セクション既完成。字幕形式はスクロール多行同時表示（タイミング精度低） |
| J1m3JjvNnGw | 開経偈（字幕付き）【お経練習】【妙法蓮華経】(1:40) | ❌ 不採用 | 字幕は日本語訳文（「百千万劫にも遭い奉ること難し」）。漢字本文のOCRグラウンドトゥルースとして不適。開経偈は既完成 |
| BqKMEP3TeBk | 妙法蓮華経方便品第二（フリガナあり）【お経練習・初級編】(4:04) | ⬜ 保留 | 浦和・円蔵寺。フリガナ付き1行下部表示形式。全文カバー確認（十如是含む）。hobenponは既に2ソース完成のため3ソース目として低優先。字幕ありでOCR可能 |

---

## Ground Truth方式 v2.0（2026-07-01 移行）

従来方式（字幕付き動画必須・OCR中心）では、普賢勧発偈および法華経二十八品の残り大半に
字幕付き練習動画が存在せず STOP していた。そこで新方式（動画選定優先順位・Ground Truth採用順・
テキスト来歴ポリシー）に移行し、STOPを解除した。詳細は [MASTER_SKILL.md](./MASTER_SKILL.md) 参照。

**発見**: 本光寺 Live チャンネル（UCiw39reqgNCUzRi-mgrFA6g）が法華経全28品を字幕なしで所蔵。
これにより残り26品すべてに動画ソースのめどが立った。

---

## 次回タスク優先順位

残タスク・法華経二十八品の確定動画IDリストは [TODO.md](./TODO.md) を参照。

### ✅ 完了タスク履歴

1. **提婆達多品第十二** (commit cdc2671, 2026-07-01): daibadatta.ts新規作成・sources.ts・index.ts登録。法華経 1/28。
2. **BqKMEP3TeBk** (commit 21c9f9b, 2026-07-01): 方便品 第3PlaybackSource (enzoiji-hobenpon)。OCR25フレーム確認。
3. **UI改善** (commit 1027e35, 2026-07-01): `displayTitle`（経文名）フィールドを PlaybackSource に追加。全11音源に付与。トップ画面を「音源で同期再生」→「経文を覚える」順に変更。再生ヘッダー・タイムスタンプ画面でも YouTubeタイトルの代わりに経文名を表示。Build 0エラー確認済み。
4. **普賢菩薩勧発品第二十八** (commit 538982e, 2026-07-01): Ground Truth方式v2.0で実装。fugenkanpatsuge.ts（全46行・6セクション）+ sources.ts（honkoji-fugen, ht8TC7DHfS4）+ index.ts登録。Whisper large-v3 47セグメントでタイミング確定、テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み。偈文 4/4、法華経 2/28。
5. **ドキュメント体系整理** (commit 5d97f02, 2026-07-02): MASTER_SKILL.md / WORKFLOW.md / TODO.md新設、PROJECT_STATUS.mdは実装済み内容・QA状況・Git履歴の記録に整理。プロンプト肥大化・API 400エラー回避のため、再開時は4ファイル参照で完結する構成に変更。
6. **序品第一** (commit 09dc048, 2026-07-03): Ground Truth方式v2.0で実装。johon.ts（全118行・10セクション: 序分/声聞衆/菩薩衆/天龍八部衆/入定瑞相/放光/弥勒疑念/弥勒偈問/文殊答長行/文殊重頌）+ sources.ts（honkoji-johon, Tnqm52v9xZQ）+ index.ts登録。Whisper large-v3（6チャンク・フォアグラウンド実行）でセクション構造を確認、字句レベルは連続読誦の音写崩れが著しく取得不能のため構造アンカー+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/johon, /play/honkoji-johon）。法華経 3/28。
7. **方便品第二（全文）** (commit 906e988, 2026-07-03): Ground Truth方式v2.0で実装。hobenponzenbun.ts（全71行・7セクション: 長行1/十如是/長行2/偈1-4）+ sources.ts（honkoji-hobenponzenbun, S5caezkoUG0）+ index.ts登録。既存`hobenpon.ts`（十如是抜粋のみ）とは別ファイル。Whisper large-v3（7チャンク）で長行部（11-400s）は十如是が136-171s台に直接出現するなど語句レベルでも比較的明瞭に確認できたが、長大な偈頌部（400-1328s）は音写崩れが著しくセクション境界+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合、三止三請・五千退席・一大事因縁・一仏乗の全教理を収録）。Build 0エラー・本番デプロイ確認済み（/sutra/hobenponzenbun, /play/honkoji-hobenponzenbun）。法華経 4/28。
8. **譬喩品第三** (commit bb0562f, 2026-07-03): Ground Truth方式v2.0で実装。hiyuhon.ts（全90行・5セクション: 舎利弗踊躍歓喜偈・記別/四衆供養・重請/火宅の譬え本体/合譬/重頌）+ sources.ts（honkoji-hiyuhon, D965nIz_Ufg）+ index.ts登録。三車火宅の譬え（法華経で最も著名な譬喩）を全文収録。Whisper large-v3（8チャンク）で冒頭（舎利弗踊躍歓喜）・火宅導入部（「長者」の直接出現）は語句レベルでも比較的明瞭に確認できたが、長大な譬喩・偈頌の中盤は音写崩れが著しくセクション境界+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/hiyuhon, /play/honkoji-hiyuhon）。法華経 5/28。
9. **信解品第四** (commit 1585d85, 2026-07-03): Ground Truth方式v2.0で実装。shingehon.ts（全73行・5セクション: 四大声聞の歓喜・窮子の譬え導入/窮子の譬え前半/後半/合譬/重頌）+ sources.ts（honkoji-shingehon, 1YlVyFbN8mA）+ index.ts登録。長者窮子の譬えを全文収録。**方法論の修正**: Whisper反復定型句（「ご視聴ありがとうございました」）が動画中盤（200-400s）にも出現したため、`ffmpeg volumedetect`/`silencedetect`で実際に音量を確認したところ無音ではなかった（全編mean_volume約-22dB）。従来の「反復定型句＝無音（アウトロ）」という判断基準を修正し、全編を実質読誦区間として扱った（WORKFLOW.mdに追記）。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/shingehon, /play/honkoji-shingehon）。法華経 6/28。
10. **薬草喩品第五** (commit 3bf3a72, 2026-07-03): Ground Truth方式v2.0で実装。yakusoyuhon.ts（全45行・4セクション: 仏の称賛・導入/三草二木の譬え本体/一相一味の法/重頌）+ sources.ts（honkoji-yakusoyuhon, LGsPXrUxDUE）+ index.ts登録。三草二木の譬え（大雲の譬え）を全文収録。Whisper反復定型句（「お祈りします」）が全体の約60%（200-508.9s）に出現したが、信解品と同様volumedetect/silencedetectで無音でないことを確認し全編を実質読誦区間として扱った。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/yakusoyuhon, /play/honkoji-yakusoyuhon）。法華経 7/28。
11. **授記品第六** (commit 5986624, 2026-07-03): Ground Truth方式v2.0で実装。jukihon.ts（全37行・5セクション: 迦葉への記別・長行/重頌/須菩提への記別/大迦旃延への記別/大目犍連への記別）+ sources.ts（honkoji-jukihon, Gu6YDp_FMT0）+ index.ts登録。四大声聞（迦葉・須菩提・迦旃延・目犍連）への記別を全文収録。Whisper large-v3（3チャンク）で冒頭タイトル・須菩提への記別冒頭（約208.6s）が語句レベルで明瞭に確認でき強いアンカーとなった。事前にffmpeg silencedetectで無音区間なしを確認済み。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/jukihon, /play/honkoji-jukihon。/playは初回404後リトライで200確認、Vercelエッジ伝播遅延と判断）。法華経 8/28。
12. **化城喩品第七** (commit f6e273f, 2026-07-03): Ground Truth方式v2.0で実装。kejohon.ts（全61行・6セクション: 大通智勝仏の物語導入/十六王子・請法/十六沙弥の教化/十二因縁/化城の譬え本体・合譬/重頌）+ sources.ts（honkoji-kejohon, tXWQkYZkkgk）+ index.ts登録。化城の譬え（法華経の代表的譬喩の一つ）を全文収録。Whisper large-v3（8チャンク）で831-853s付近が十二因縁（無明縁行…／無明滅則行滅…）の音写と直接対応する語句レベルで明瞭に確認できた。1042-1469.5sは「お祈りします」の反復誤認識だったが、volumedetect（複数地点）・silencedetect（全編スキャン）で無音でないことを確認し全編を実質読誦区間として扱った。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/kejohon, /play/honkoji-kejohon）。法華経 9/28。
13. **五百弟子受記品第八** (commit 730811f, 2026-07-03): Ground Truth方式v2.0で実装。gohyakuhon.ts（全43行・6セクション: 富楼那への序/記別・長行/記別・重頌/千二百羅漢の願い・五百羅漢への記別/衣裏繋珠の譬え/合譬・重頌）+ sources.ts（honkoji-gohyakuhon, Zv9gGKxP6Ro）+ index.ts登録。衣裏繋珠の譬えを全文収録。事前にffmpeg silencedetectで無音区間なしを確認してから着手（化城喩品での学習を活かし効率化）。冒頭0-198s（品名・富楼那の描写・記別冒頭）が語句レベルで極めて明瞭に確認でき、原典と一字一句近い精度で対応が取れた。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/gohyakuhon, /play/honkoji-gohyakuhon）。法華経 10/28。
14. **授学無学人記品第九** (commit 8daa3fb, 2026-07-04): Ground Truth方式v2.0で実装。jugakuhon.ts（全22行・4セクション: 阿難・羅睺羅の願い/阿難への記別/羅睺羅への記別/二千人への記別・重頌）+ sources.ts（honkoji-jugakuhon, GRKznTuERkw）+ index.ts登録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭0-198s（品名・阿難羅睺羅の願い・阿難への記別冒頭）が語句レベルで極めて明瞭に確認でき、原典と一字一句近い精度で対応が取れた。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/jugakuhon, /play/honkoji-jugakuhon）。法華経 11/28。
15. **法師品第十** (commit 7687265, 2026-07-04): Ground Truth方式v2.0で実装。hosshihon.ts（全21行・6セクション: 導入・一念随喜者への記別/五種法師の功徳/塔を建てての供養・誹謗の罪/道場としての功徳・重頌/如来の衣・座・室（三軌）/守護の約束・重頌）+ sources.ts（honkoji-hosshihon, un3sFgKOgpU）+ index.ts登録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭（品名・薬王への呼びかけ・「一偈一句乃至一念随喜者」）が語句レベルで明瞭に確認できたが、508-620s付近は「説明」の反復誤認識でありvolumedetectで無音でないことを確認し全編を実質読誦区間として扱った。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/hosshihon, /play/honkoji-hosshihon）。法華経 12/28。
16. **見宝塔品第十一** (commit c350f6f, 2026-07-04): Ground Truth方式v2.0で実装。hotohon.ts（全27行・9セクション: 宝塔の涌現・宝塔からの声/大楽説菩薩の質問/多宝仏の本願/分身諸仏の召集/娑婆世界の浄化・分身仏の来集/開塔の準備/開塔・多宝仏との対面/二仏並座/説法の勧め・付嘱の予告）+ sources.ts（honkoji-hotohon, GFBo3otgdCg）+ index.ts登録。二仏並座（法華経曼荼羅の中核図像の由来）を全文収録。既存`hotoge.ts`（宝塔偈）とは別ファイル。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭（品名・宝塔の「住在空中」描写・「善哉善哉釈迦牟尼世尊」）が語句レベルで明瞭に確認できたが、260-400s付近は「説明」の反復誤認識でありvolumedetectで無音でないことを確認し全編を実質読誦区間として扱った。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/hotohon, /play/honkoji-hotohon）。法華経 13/28。
17. **勧持品第十三** (commit a5c4e0f, 2026-07-04): Ground Truth方式v2.0で実装。kanjihon.ts（全19行・6セクション: 薬王・大楽説菩薩の誓い/五百阿羅漢・学無学八千人の誓い/摩訶波闍波提比丘尼への記別/耶輸陀羅比丘尼への記別・二千比丘尼の歓喜/諸菩薩の誓い/有二十行の偈）+ sources.ts（honkoji-kanjihon, RxrISsOBVng）+ index.ts登録。三類の強敵に耐え忍び不自惜身命を誓う「二十行の偈」（日蓮宗で最重視される一節の一つ）を全文収録。提婆達多品第十二は既存`daibadatta.ts`（別動画）で完成済みのためスキップ。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭（品名・薬王菩薩／大楽説菩薩への言及）は語句レベルで明瞭に確認できたが、以降は音写崩れが著しく構造アンカー+均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/kanjihon, /play/honkoji-kanjihon）。法華経 14/28。
18. **安楽行品第十四** (commit 1b196ba, 2026-07-04): Ground Truth方式v2.0で実装。anrakugyohon.ts（全29行・13セクション: 文殊師利の請問・四安楽行総説/第一身安楽行の行処/親近処その一〜三/第二親近処・諸法空観/身安楽行の重頌/第二口安楽行/第三意安楽行/第四誓願安楽行/誓願安楽行の重頌/髻中明珠の譬え/締めくくり）+ sources.ts（honkoji-anrakugyohon, 16u7E86jzWs）+ index.ts登録。四安楽行（身・口・意・誓願）と、法華経が諸経中最高であることを示す「髻中明珠の譬え」を全文収録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭〜260s台（四安楽行総説・身安楽行の行処／親近処・偈頌冒頭）はWhisper large-v3（5チャンク）で原典と一字一句近い精度の語句レベル確認ができ、複数の直接対応セグメントを構造アンカーとして採用。400-888sは「♪〜」の反復ハルシネーションだったがvolumedetectで無音でないことを確認し均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/anrakugyohon, /play/honkoji-anrakugyohon）。法華経 15/28。
19. **従地涌出品第十五** (commit ecc6c36, 2026-07-04): Ground Truth方式v2.0で実装。juchiyujutsuhon.ts（全20行・12セクション: 他方の菩薩の請願と仏の制止/地涌の菩薩の出現/地涌の菩薩の眷属の数/地涌の菩薩たちの二仏への礼拝/四導師の登場・仏への問訊/弥勒の疑問・長行/弥勒の偈頌の疑問×3/分身諸仏の侍者の疑問/仏、弥勒に答える/地涌の菩薩は皆我が弟子であるという宣言）+ sources.ts（honkoji-juchiyujutsuhon, DL5yxRxAomA）+ index.ts登録。地涌の菩薩の出現と弥勒の疑問（次章・如来寿量品の「久遠実成」revelationへの伏線）を収録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭〜200s台（地涌の菩薩の眷属の数の列挙・二仏への礼拝）はWhisper large-v3（4チャンク）で原典と一字一句近い精度の語句レベル確認ができ、複数の直接対応セグメントを構造アンカーとして採用。200-738sは「お祈りします」「読手読手」の反復ハルシネーションだったがvolumedetectで無音でないことを確認し均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/juchiyujutsuhon, /play/honkoji-juchiyujutsuhon）。法華経 16/28。
20. **如来寿量品第十六** (commit 3da85fa, 2026-07-04): Ground Truth方式v2.0で実装。juryohon.ts（全20行・16セクション: 三度の請問/如来秘密神通之力の宣言/久遠実成の宣言/塵点劫の譬え×2/常在此説法の宣言/衆生の機根に応じた方便/如来の寿命は無量であるという宣言/経典の真実性/良医治子の譬え×5/自我偈への導入）+ sources.ts（honkoji-juryohon, 4SkckGoAqhw）+ index.ts登録。法華経全体の教理的クライマックスである「久遠実成」の宣言（我實成佛已來。無量無邊百千萬億那由他劫）と、子が毒薬を飲み父の死の方便によって目覚める「良医治子の譬え」を収録。既存`jigage.ts`（自我偈、基本勤行で使用）とは重複を避け、長行部分と導入行のみ収録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭〜140s台（久遠実成宣言・塵点劫の譬え）はWhisper large-v3（3チャンク）で原典と一字一句近い精度の語句レベル確認ができた。165-505sは「聖書を読みます」「お祈りします」の反復ハルシネーションだったがvolumedetectで無音でないことを確認し均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/juryohon, /play/honkoji-juryohon）。法華経 17/28。
21. **分別功徳品第十七** (commit eec5d42, 2026-07-05): Ground Truth方式v2.0で実装。funbetsukudokuhon.ts（全27行・7セクション: 大衆が得た利益の総説/菩薩たちが得た様々な功徳・階層別列挙/曼陀羅華の雨・諸仏への供養/一念信解の功徳/六波羅蜜との比較/弥勒の重頌/深心信解の相・生きた塔の教え）+ sources.ts（honkoji-funbetsukudokuhon, 5bEGLQvkNms）+ index.ts登録。久遠実成を聞いた大衆の様々な功徳と、「一念信解」が八十万億那由他劫の間五波羅蜜を行じるよりも勝るという教理的比較、経を持つ者のいる場所に塔を建てるべきという「生きた塔」の教えを収録。事前にffmpeg silencedetectで無音区間なしを確認済み。冒頭総説・曼陀羅華の雨（約223s）・六波羅蜜の比較（約276s）・生きた塔の教え（約560s）の計5箇所がWhisper large-v3（4チャンク）で原典と一字一句近い精度の語句レベル確認ができた。それ以外は反復ハルシネーションだったがvolumedetectで無音でないことを確認しアンカー間均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/funbetsukudokuhon, /play/honkoji-funbetsukudokuhon）。法華経 18/28。
22. **随喜功徳品第十八** (commit f84e7ca, 2026-07-05): Ground Truth方式v2.0で実装。zuikikudokuhon.ts（全16行・6セクション: 弥勒の問い/五十展転/大施主の譬え/四道の悟りと功徳の比較/聴聞・勧聴・伝達の功徳/端正な相好を得る功徳）+ sources.ts（honkoji-zuikikudokuhon, wWxM4K2yvyI）+ index.ts登録。法華経を聞いて随喜し次々と50人に伝わった第五十人の随喜の功徳が、無量の衆生に楽具を施し阿羅漢果を得させる大施主の功徳より遥かに勝るという教理的比較を収録。事前にffmpeg silencedetectで無音区間なしを確認済み。152-200s台（大施主の譬え中の四道・第五十人の随喜の功徳の比較）がWhisper large-v3（2チャンク）で原典と一字一句近い精度の語句レベル確認ができた。それ以外は反復ハルシネーションだったがvolumedetectで無音でないことを確認し均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/zuikikudokuhon, /play/honkoji-zuikikudokuhon）。法華経 19/28。
23. **法師功徳品第十九** (commit da1af6b, 2026-07-05): Ground Truth方式v2.0で実装。hosshikudokuhon.ts（全14行・8セクション: 総説/眼根功徳/耳根功徳/鼻根功徳/舌根功徳/身根功徳/意根功徳/締めくくり）+ sources.ts（honkoji-hosshikudokuhon, iQ8aCyCDfRc）+ index.ts登録。経を受持・読誦・解説・書写する者が得る六根（眼耳鼻舌身意）清浄の具体的な功徳（八百眼功徳・千二百耳功徳・八百鼻功徳・千二百舌功徳・八百身功徳・千二百意功徳）を収録。既存`hosshihon.ts`（法師品第十）とは全く別の章であることに注意。事前にffmpeg silencedetectで無音区間なしを確認済み。天龍八部への言及（約147s）・鼻根功徳中の天華の香り「摩訶曼陀羅華香」等（約300s）・天龍八部の男女両形への言及（約505s）の3箇所がWhisper large-v3（4チャンク）で原典と一字一句近い精度の語句レベル確認ができた。それ以外は反復ハルシネーションだったがvolumedetectで無音でないことを確認し均等補間でタイミング暫定配置。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/hosshikudokuhon, /play/honkoji-hosshikudokuhon）。法華経 20/28。
24. **常不軽菩薩品第二十** (commit a0a74ec, 2026-07-05): Ground Truth方式v2.0で実装。jofukyohon.ts（全16行・7セクション: 総説/威音王如来の物語/常不軽菩薩の登場と礼拝行/杖木瓦石による迫害と忍受/六根清浄と臨終後の功徳成就/常不軽菩薩＝釈迦仏自身の開示・迫害者の後の姿/教訓のまとめ）+ sources.ts（honkoji-jofukyohon, x5BpHXnVxRs）+ index.ts登録。日蓮が「不軽の行」として最も重視した章の一つを全文収録：遠い過去の威音王如来（二万億仏が同名で相続）の物語、増上慢の比丘たちの中で現れた常不軽菩薩が万人を礼拝し「あなたは仏になる」と唱え続け杖木瓦石の迫害を忍受した物語、臨終での六根清浄・寿命延長、以後次々と仏に値って教化を続けた末に釈迦仏自身がこの常不軽菩薩であったと明かす結末までを収録。yt-dlpの一時的な403エラーはリトライで解決（法師品第十以来の既知パターン）。事前にffmpeg silencedetectで冒頭5.16秒のみの無音を確認。品名・得大勢菩薩・威音王如来とその十号・仏寿四十万億那由他・最後威音王如来の滅度・六根清浄と寿命延長・雲自在灯王との出会い・功徳成就など、本セッション中でも特に高精度な語句レベル確認がWhisper large-v3（3チャンク）で多数箇所において得られた。テキストはAI再構成（`ai_sample`/`provisional`、要原典照合）。Build 0エラー・本番デプロイ確認済み（/sutra/jofukyohon, /play/honkoji-jofukyohon）。法華経 21/28。
