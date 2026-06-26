"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Sutra } from "@/data/types";
import { flattenLines, isLearnable } from "@/data/types";
import { learnedCount, useSutraProgress } from "@/lib/learningStore";

/**
 * 暗記モード（記憶系）。
 *
 * 段階的マスキングで「見て覚える→隠して思い出す」を支援する。
 * - 全表示   : 本文・読み・訳をすべて表示
 * - 読み隠し : 読みをぼかす（訳は手がかり。タップで確認）
 * - 暗唱     : 本文・読みをぼかし、訳だけを手がかりに想起（タップで答え合わせ）
 * 行ごとの「覚えた」は端末内に永続化（useSutraProgress）。
 *
 * 内容に非依存（任意のSutra構造で動作）。provisional データには警告を出し、
 * 正規データ差し替え後もそのまま使える。
 */

type Stage = "all" | "hideReading" | "recall";

const STAGES: { key: Stage; label: string }[] = [
  { key: "all", label: "全表示" },
  { key: "hideReading", label: "読み隠し" },
  { key: "recall", label: "暗唱" },
];

const STAGE_HINT: Record<Stage, string> = {
  all: "本文・読み・現代語訳をすべて表示します。",
  hideReading: "読みを伏せます。訳を手がかりに読みを思い出し、行をタップで確認。",
  recall: "本文と読みを伏せます。訳だけを手がかりに暗唱し、行をタップで答え合わせ。",
};

export default function MemorizeBody({ sutra }: { sutra: Sutra }) {
  const [stage, setStage] = useState<Stage>("all");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const { stats, markLearned, reset } = useSutraProgress(sutra.id);

  const total = useMemo(() => flattenLines(sutra).length, [sutra]);
  const learned = learnedCount(stats);
  const pct = total ? Math.round((learned / total) * 100) : 0;
  const verified = isLearnable(sutra.provenance);

  // ステージを切り替えたら「めくり」をリセット
  useEffect(() => setRevealed(new Set()), [stage]);

  const peek = (lineId: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return next;
    });

  return (
    <main className="memorize">
      <header className="mem-header">
        <Link href={`/sutra/${sutra.id}`} className="back-btn" aria-label="戻る">
          ‹
        </Link>
        <div className="mem-title-wrap">
          <span className="mem-title">{sutra.title}・暗記</span>
          {sutra.subtitle && <span className="mem-sub">{sutra.subtitle}</span>}
        </div>
      </header>

      {!verified && (
        <div className="mem-warn" role="alert">
          ⚠ 暫定データです（未検証）。正式な勤行本・出典の入手後に差し替えます。
        </div>
      )}

      <div className="mem-progress">
        <div className="mem-progress-bar">
          <div className="mem-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="mem-progress-text">
          {learned}/{total} 覚えた
        </span>
      </div>

      <div className="mem-stages" role="tablist" aria-label="表示レベル">
        {STAGES.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={stage === s.key}
            className={`mem-stage ${stage === s.key ? "active" : ""}`}
            onClick={() => setStage(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="mem-hint">{STAGE_HINT[stage]}</p>

      <div className="mem-body">
        {sutra.sections.map((section) => (
          <section key={section.id} className="mem-section">
            <h2 className="mem-section-title">{section.title}</h2>
            {section.lines.map((line) => {
              const isLearned = stats[line.id]?.learned ?? false;
              const isRevealed = revealed.has(line.id);
              const textBlurred = stage === "recall" && !isRevealed;
              const readingBlurred = stage !== "all" && !isRevealed;
              return (
                <div
                  key={line.id}
                  className={`mem-line ${isLearned ? "learned" : ""}`}
                >
                  <button
                    type="button"
                    className="mem-line-tap"
                    onClick={() => peek(line.id)}
                    aria-label="タップして確認"
                  >
                    <span className={`mem-text ${textBlurred ? "mem-blur" : ""}`}>
                      {line.text}
                    </span>
                    {line.reading && (
                      <span
                        className={`mem-reading ${readingBlurred ? "mem-blur" : ""}`}
                      >
                        {line.reading}
                      </span>
                    )}
                    <span className="mem-translation">{line.translation}</span>
                  </button>
                  <button
                    type="button"
                    className={`mem-learned-btn ${isLearned ? "on" : ""}`}
                    onClick={() => markLearned(line.id, !isLearned)}
                    aria-pressed={isLearned}
                  >
                    {isLearned ? "覚えた ✓" : "覚えた"}
                  </button>
                </div>
              );
            })}
          </section>
        ))}
      </div>

      <div className="mem-footer">
        <button type="button" className="mem-reset" onClick={reset}>
          この経文の進捗をリセット
        </button>
      </div>
    </main>
  );
}
