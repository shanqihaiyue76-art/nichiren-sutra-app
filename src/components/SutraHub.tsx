"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Sutra } from "@/data/types";
import { flattenLines, isLearnable } from "@/data/types";
import {
  learnedCount,
  overallAccuracy,
  useSutraProgress,
  weakLineIds,
} from "@/lib/learningStore";

/**
 * 経文ハブ。学習の入口（経文＝学習の主単位）。
 * 進捗サマリ（覚えた/正解率/苦手/連続日数）と各学習モードへの導線。
 */
export default function SutraHub({ sutra }: { sutra: Sutra }) {
  const { stats, streak } = useSutraProgress(sutra.id);
  const total = useMemo(() => flattenLines(sutra).length, [sutra]);
  const verified = isLearnable(sutra.provenance);

  const learned = learnedCount(stats);
  const pct = total ? Math.round((learned / total) * 100) : 0;
  const acc = overallAccuracy(stats);
  const weak = weakLineIds(stats).length;

  return (
    <main className="hub">
      <header className="mem-header">
        <Link href="/" className="back-btn" aria-label="戻る">
          ‹
        </Link>
        <div className="mem-title-wrap">
          <span className="mem-title">{sutra.title}</span>
          {sutra.subtitle && <span className="mem-sub">{sutra.subtitle}</span>}
        </div>
      </header>

      {!verified && (
        <div className="mem-warn" role="alert">
          ⚠ 暫定データです（未検証）。正式な勤行本・出典の入手後に差し替えます。
        </div>
      )}

      <div className="hub-stats">
        <div className="hub-stat">
          <span className="hub-stat-num">
            {learned}
            <small>/{total}</small>
          </span>
          <span className="hub-stat-label">覚えた</span>
        </div>
        <div className="hub-stat">
          <span className="hub-stat-num">{acc === null ? "—" : `${Math.round(acc * 100)}%`}</span>
          <span className="hub-stat-label">正解率</span>
        </div>
        <div className="hub-stat">
          <span className="hub-stat-num">{weak}</span>
          <span className="hub-stat-label">苦手な行</span>
        </div>
        <div className="hub-stat">
          <span className="hub-stat-num">{streak}<small>日</small></span>
          <span className="hub-stat-label">連続学習</span>
        </div>
      </div>

      <div className="hub-progress-bar">
        <div className="hub-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <nav className="hub-modes">
        <Link href={`/memorize/${sutra.id}`} className="hub-mode">
          <span className="hub-mode-title">暗記モード</span>
          <span className="hub-mode-sub">見て覚える・段階的に隠す</span>
        </Link>
        <Link href={`/test/${sutra.id}`} className="hub-mode">
          <span className="hub-mode-title">テストモード</span>
          <span className="hub-mode-sub">訳から本文を想起・自己採点</span>
        </Link>
      </nav>
    </main>
  );
}
