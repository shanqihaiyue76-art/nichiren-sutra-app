# VERIFIED_STATUS.md — 経文別 完成度トラッカー

レベル定義は [QA_GUIDELINES.md](./QA_GUIDELINES.md)。
更新ルール: 昇格作業を行ったコミットに本ファイルの更新を必ず含める。

凡例 — 原典: ✅=T0262全文照合済 / △=スポット確認のみ / ✗=未照合
タイミング: ✅=±0.5s確認済 / △=アンカー確認済+補間 / ✗=未検証
スマホ: ✅=375px確認済 / ✗=未確認

## 基本勤行・偈文

| id | 品名 | 原典 | タイミング | スマホ | Level | 完成日 |
|----|------|------|-----------|--------|-------|--------|
| kaikyoge | 開経偈 | ✗※ | △ | ✗ | C | — |
| hobenpon | 方便品（十如是） | ✅ | △ | ✗ | B | 2026-07-07 |
| jigage | 自我偈 | ✅ | △ | ✗ | B | 2026-07-07 |
| daimoku | 題目 | ✅ | △ | ✗ | B | 2026-07-07 |
| ekomon-chogyo | 回向文 | ✗※ | △ | ✗ | C | — |
| hotoge | 宝塔偈 | ✅ | △ | ✗ | B | 2026-07-07 |
| shishi | 四誓 | ✗※ | △ | ✗ | C | — |
| jinrikige | 神力偈 | ✅ | △ | ✗ | B | — |
| kannonge | 観音偈 | ✗ | △ | ✗ | C | — |
| fugenkanpatsuge | 普賢勧発偈 | ✗ | △ | ✗ | C | — |

※ kaikyoge/ekomon-chogyo/shishiはT0262（法華経本文）に対応箇所がない別系統の
典礼文（開経偈・回向文・四弘誓願は法華経以外にも広く用いられる一般的な仏教
儀礼文）のため、T0262原典照合の対象外。現状のocr_draft（基準動画の字幕
OCRで全行確認済み）を維持。Level A化には別途、実際の経本原本との照合が必要。

**T0262照合の副産物**: jigage（自我偈）とhotoge（宝塔偈）の照合で、ダウンロード
したNTU PDF（T09n0262.pdf）自体に3箇所の異同（j10苦海/苦惱・j25-26念,道/意,慧・
ht3即/則）を発見。いずれも複数の日蓮宗寺院サイトでの独立引用と照合し、既存の
動画OCR由来テキストが標準的読誦文と一致することを確認、既存表記を維持した
（PDF側の異同として記録。詳細は各ファイルのprovenance.noteを参照）。

## 法華経二十八品

| id | 品 | 原典 | タイミング | スマホ | Level | 完成日 |
|----|-----|------|-----------|--------|-------|--------|
| johon | 1 序品 | △(jo01のみ) | △ | ✗ | B | — |
| hobenponzenbun | 2 方便品全文 | ✗ | △ | ✗ | B | — |
| hiyuhon | 3 譬喩品 | ✗ | △ | ✗ | B | — |
| shingehon | 4 信解品 | ✗ | △ | ✗ | B | — |
| yakusoyuhon | 5 薬草喩品 | ✗ | △ | ✗ | B | — |
| jukihon | 6 授記品 | ✗ | △ | ✗ | B | — |
| kejohon | 7 化城喩品 | ✗ | △ | ✗ | B | — |
| gohyakuhon | 8 五百弟子受記品 | ✗ | △ | ✗ | B | — |
| jugakuhon | 9 授学無学人記品 | ✗ | △ | ✗ | B | — |
| hosshihon | 10 法師品 | ✗ | △ | ✗ | B | — |
| hotohon | 11 見宝塔品 | ✗ | △ | ✗ | B | — |
| daibadatta | 12 提婆達多品 | ✗ | △ | ✗ | B | — |
| kanjihon | 13 勧持品 | ✗ | △ | ✗ | B | — |
| anrakugyohon | 14 安楽行品 | ✗ | △ | ✗ | B | — |
| juchiyujutsuhon | 15 従地涌出品 | ✗ | △ | ✗ | B | — |
| juryohon | 16 如来寿量品 | ✗ | △ | ✗ | B | — |
| funbetsukudokuhon | 17 分別功徳品 | ✗ | △ | ✗ | B | — |
| zuikikudokuhon | 18 随喜功徳品 | ✗ | △ | ✗ | B | — |
| hosshikudokuhon | 19 法師功徳品 | ✗ | △ | ✗ | B | — |
| jofukyohon | 20 常不軽菩薩品 | ✗ | △ | ✗ | B | — |
| jinrikihon | 21 如来神力品 | ✗ | △ | ✗ | B | — |
| zokuruihon | 22 嘱累品 | ✗ | △ | ✗ | B | — |
| yakuohon | 23 薬王菩薩本事品 | ✗ | △ | ✗ | B | — |
| myoonhon | 24 妙音菩薩品 | ✗ | △ | ✗ | B | — |
| kannonhon | 25 観世音菩薩普門品（長行） | ✗ | △ | ✗ | B | — |
| daranihon | 26 陀羅尼品 | ✗ | △ | ✗ | B | — |
| myoshogonnohon | 27 妙荘厳王本事品 | ✗ | △ | ✗ | B | — |
| （fugenkanpatsuge） | 28 普賢菩薩勧発品 | ✗ | △ | ✗ | C | — |

## 集計

- Level A: 0 / 37
- Level B: 32 / 37（原典verified 5件: jinrikige, hobenpon, jigage, daimoku, hotoge / 残27件はWhisper語句確認記録あり）
- Level C: 5 / 37（kaikyoge, ekomon-chogyo, shishi, hobenponzenbun, fugenkanpatsuge等）
- 次の目標: verified化した5経文のタイミング精密化（W2）+ スマホ確認でLevel A化
