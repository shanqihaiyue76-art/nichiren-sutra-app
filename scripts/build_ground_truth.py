#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OCR Canonical Draft から、評価用 Ground Truth(暫定) を整備する。

Ground Truth の定義（重要）:
  - テキスト = 動画表示テキスト（OCR抽出・暫定）。正式正解ではない。経本入手後に差替。
  - 時刻     = 画面初出時刻 first_t。⚠これは『表示時刻』であり『読誦オンセット』ではない。
               スクロール式のため表示は読誦より先行する（読み遅延）。
  - ASR非依存（OCRのみ由来）。評価はこのGT基準で行う。
               ASR出力同士の比較は評価指標として採用しない。

各句に信頼度・不確実フラグを付与。字形誤認の疑い（高信頼でも）は glyph_review に列挙
（テキストは書き換えない＝捏造修正しない。経本照合で確定する）。

usage:
  python3 scripts/build_ground_truth.py \
      --draft .cache/hobenpon_canonical_draft.json \
      --out   .cache/hobenpon_ground_truth.json
"""
import argparse
import json
import sys

# 字形誤認の疑い（経本照合で確定。ここでは“未適用の推定”として記録のみ。テキストは書き換えない）。
GLYPH_REVIEW = {
    "種種譬諭": "種種譬喩（諭→喩?）",
    "皆己具足": "皆已具足（己→已?）",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", default=".cache/hobenpon_canonical_draft.json")
    ap.add_argument("--out")
    ap.add_argument("--uncertain-conf", type=float, default=0.6,
                    help="この信頼度未満を不確実(uncertain)とする")
    a = ap.parse_args()

    d = json.load(open(a.draft, encoding="utf-8"))
    src_lines = d["lines"]

    gt_lines = []
    for ln in src_lines:
        review = list(ln.get("flags", []))
        if ln["text"] in GLYPH_REVIEW:
            review.append("glyph_form")     # 字形要確認（高信頼でも）
        uncertain = (ln["conf"] < a.uncertain_conf) or bool(review)
        gt_lines.append({
            "idx": ln["idx"],
            "text": ln["text"],
            "first_t": ln["first_t"],        # = 画面表示時刻（読誦オンセットではない）
            "conf": ln["conf"],
            "uncertain": uncertain,
            "review": review,
        })

    glyph_review = [
        {"idx": ln["idx"], "text": ln["text"], "conf": ln["conf"],
         "suspected": GLYPH_REVIEW[ln["text"]]}
        for ln in src_lines if ln["text"] in GLYPH_REVIEW
    ]

    out = {
        "role": "ground-truth",
        "sutra": "hobenpon",
        "status": "PROVISIONAL（暫定）。正式正解ではない。経本+人手オンセット確定後に差替前提。",
        "basis": "動画表示テキスト（OCR抽出 / ASR非依存）",
        "timing_semantics": (
            "first_t = 画面初出時刻。⚠読誦オンセットではない"
            "（スクロール表示は読誦より先行＝読み遅延を含む）。"
            "真の読誦オンセット絶対誤差は経本+人手ラベル後に確定（現状=未確認）。"
        ),
        "eval_policy": (
            "平均/最大誤差は本GT基準（|推定onset − first_t|）で評価する。"
            "ASR出力同士の比較は評価指標として採用しない。"
        ),
        "uncertain_conf": a.uncertain_conf,
        "counts": {
            "total": len(gt_lines),
            "uncertain": sum(1 for x in gt_lines if x["uncertain"]),
            "high_conf": sum(1 for x in gt_lines if x["conf"] >= 1.0),
        },
        "lines": gt_lines,
        "glyph_review": glyph_review,                      # 字形要確認（推定・未適用）
        "known_gaps": d.get("dropped_candidates", []),     # 欠落候補（要経本照合）
    }

    if a.out:
        json.dump(out, open(a.out, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
        print(f"[saved] {a.out}", file=sys.stderr)

    c = out["counts"]
    print("=== Ground Truth(暫定) 整備完了 ===")
    print(f"句数: {c['total']}  / 不確実(uncertain): {c['uncertain']}  / 高信頼(c=1.00): {c['high_conf']}")
    print(f"字形要確認: {len(glyph_review)}件  / 欠落候補: {len(out['known_gaps'])}件")
    print("時刻意味: first_t = 画面表示時刻（≠読誦オンセット, 読み遅延を含む）")
    print("評価方針: GT基準で誤差算出 / ASR同士の比較は不採用")


if __name__ == "__main__":
    main()
