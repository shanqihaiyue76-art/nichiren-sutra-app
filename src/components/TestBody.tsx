"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Sutra, SutraLine } from "@/data/types";
import { isLearnable } from "@/data/types";
import { isWeak, useSutraProgress } from "@/lib/learningStore";

/**
 * テストモード（記憶系）。
 *
 * 現代語訳を手がかりに本文（と読み）を想起 → 答え合わせ → 自己採点(◯/✕)。
 * 読経は音声採点できないため自己採点方式（Anki等と同様）。結果は
 * useSutraProgress に記録し、苦手行の自動抽出・学習履歴に反映する。
 *
 * 出題範囲: 全行 / 苦手のみ（過去の自己採点から自動抽出）。
 */

interface Entry {
  line: SutraLine;
  sectionTitle: string;
}

type Phase = "config" | "quiz" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TestBody({ sutra }: { sutra: Sutra }) {
  const { stats, recordResult } = useSutraProgress(sutra.id);
  const verified = isLearnable(sutra.provenance);

  const allEntries = useMemo<Entry[]>(
    () =>
      sutra.sections.flatMap((sec) =>
        sec.lines.map((line) => ({ line, sectionTitle: sec.title })),
      ),
    [sutra],
  );

  const weakCount = useMemo(
    () => Object.values(stats).filter(isWeak).length,
    [stats],
  );

  const [phase, setPhase] = useState<Phase>("config");
  const [onlyWeak, setOnlyWeak] = useState(false);
  const [doShuffle, setDoShuffle] = useState(true);
  const [queue, setQueue] = useState<Entry[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);

  const start = () => {
    let pool = allEntries;
    if (onlyWeak) pool = pool.filter((e) => isWeak(stats[e.line.id] ?? { learned: false, seen: 0, correct: 0, incorrect: 0 }));
    if (pool.length === 0) pool = allEntries; // 苦手が無ければ全行
    const q = doShuffle ? shuffle(pool) : pool;
    setQueue(q);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setPhase("quiz");
  };

  const grade = (correct: boolean) => {
    const entry = queue[idx];
    if (!entry) return;
    recordResult(entry.line.id, correct);
    setResults((r) => [...r, { id: entry.line.id, correct }]);
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setRevealed(false);
    } else {
      setPhase("done");
    }
  };

  // ---- 設定画面 ----
  if (phase === "config") {
    return (
      <main className="test">
        <header className="mem-header">
          <Link href={`/sutra/${sutra.id}`} className="back-btn" aria-label="戻る">
            ‹
          </Link>
          <div className="mem-title-wrap">
            <span className="mem-title">{sutra.title}・テスト</span>
            {sutra.subtitle && <span className="mem-sub">{sutra.subtitle}</span>}
          </div>
        </header>

        {!verified && (
          <div className="mem-warn" role="alert">
            ⚠ 暫定データです（未検証）。正式な勤行本・出典の入手後に差し替えます。
          </div>
        )}

        <p className="test-lead">
          現代語訳を手がかりに本文を思い出し、答え合わせをして自己採点します。
        </p>

        <div className="test-config">
          <button
            type="button"
            className={`test-opt ${!onlyWeak ? "active" : ""}`}
            onClick={() => setOnlyWeak(false)}
          >
            全行（{allEntries.length}）
          </button>
          <button
            type="button"
            className={`test-opt ${onlyWeak ? "active" : ""}`}
            onClick={() => setOnlyWeak(true)}
            disabled={weakCount === 0}
          >
            苦手のみ（{weakCount}）
          </button>
        </div>
        <label className="test-check">
          <input
            type="checkbox"
            checked={doShuffle}
            onChange={(e) => setDoShuffle(e.target.checked)}
          />
          順番をシャッフルする
        </label>

        <button type="button" className="test-start" onClick={start}>
          はじめる
        </button>
      </main>
    );
  }

  // ---- 結果画面 ----
  if (phase === "done") {
    const correct = results.filter((r) => r.correct).length;
    const rate = results.length ? Math.round((correct / results.length) * 100) : 0;
    return (
      <main className="test">
        <header className="mem-header">
          <Link href={`/sutra/${sutra.id}`} className="back-btn" aria-label="戻る">
            ‹
          </Link>
          <div className="mem-title-wrap">
            <span className="mem-title">テスト結果</span>
            <span className="mem-sub">{sutra.title}</span>
          </div>
        </header>

        <div className="test-result">
          <div className="test-score">{rate}%</div>
          <div className="test-score-sub">
            {correct} / {results.length} 正解
          </div>
        </div>

        <div className="test-actions">
          <button type="button" className="test-start" onClick={() => setPhase("config")}>
            もう一度
          </button>
          <Link href={`/memorize/${sutra.id}`} className="test-link">
            暗記モードで復習
          </Link>
          <Link href={`/sutra/${sutra.id}`} className="test-link ghost">
            経文トップへ
          </Link>
        </div>
      </main>
    );
  }

  // ---- 出題画面 ----
  const entry = queue[idx];
  if (!entry) return null;
  const { line, sectionTitle } = entry;
  return (
    <main className="test">
      <header className="mem-header">
        <Link href={`/sutra/${sutra.id}`} className="back-btn" aria-label="中断">
          ‹
        </Link>
        <div className="mem-title-wrap">
          <span className="mem-title">
            {idx + 1} / {queue.length}
          </span>
          <span className="mem-sub">{sutra.title}・テスト</span>
        </div>
      </header>

      <div className="test-progress">
        <div
          className="test-progress-fill"
          style={{ width: `${(idx / queue.length) * 100}%` }}
        />
      </div>

      <div className="test-card">
        <span className="test-section">{sectionTitle}</span>
        <p className="test-prompt">{line.translation}</p>

        {revealed ? (
          <div className="test-answer">
            <span className="test-answer-text">{line.text}</span>
            {line.reading && (
              <span className="test-answer-reading">{line.reading}</span>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="test-reveal"
            onClick={() => setRevealed(true)}
          >
            答えを見る
          </button>
        )}
      </div>

      {revealed && (
        <div className="test-grade">
          <button
            type="button"
            className="test-grade-btn ng"
            onClick={() => grade(false)}
          >
            ✕ あやふや
          </button>
          <button
            type="button"
            className="test-grade-btn ok"
            onClick={() => grade(true)}
          >
            ◯ 覚えていた
          </button>
        </div>
      )}
    </main>
  );
}
