"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 学習データ層（ローカル保存・ログイン不要・端末内のみ）。
 *
 * プロジェクト方針: NO login / NO server。すべて localStorage に持つ。
 * SSR安全: window 不在時は空を返し、書き込みは無視する。
 *
 * 保持するもの:
 *  - 経文ごと・行ごとの成績（覚えたフラグ / 出題回数 / 自己採点◯✕ / 最終学習）
 *    → 学習履歴・苦手行の自動抽出・進捗表示の基盤
 *  - 日別アクティビティ（YYYY-MM-DD → 操作回数）
 *    → 連続学習（streak）チャレンジの基盤
 */
const KEY = "dokyo.learning.v2";
const KEY_V1 = "dokyo.learning.v1";

/** 1行ぶんの学習成績。 */
export interface LineStat {
  /** 手動の「覚えた」フラグ */
  learned: boolean;
  /** テスト等で出題された回数 */
  seen: number;
  /** 自己採点◯（覚えていた）回数 */
  correct: number;
  /** 自己採点✕（あやふや）回数 */
  incorrect: number;
  /** 最終学習日時(ISO) */
  lastReviewed?: string;
}

interface SutraProgress {
  /** lineId -> 成績 */
  lines: Record<string, LineStat>;
  /** 最終学習日時(ISO) */
  lastVisited?: string;
}

interface Store {
  version: 2;
  /** sutraId -> 進捗 */
  sutras: Record<string, SutraProgress>;
  /** YYYY-MM-DD -> その日の学習操作回数 */
  activity: Record<string, number>;
}

function emptyStore(): Store {
  return { version: 2, sutras: {}, activity: {} };
}

export function emptyStat(): LineStat {
  return { learned: false, seen: 0, correct: 0, incorrect: 0 };
}

function nowISO(): string {
  return new Date().toISOString();
}

function todayKey(): string {
  // ローカルタイムの YYYY-MM-DD
  const d = new Date();
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

/** v1（{learned, lastVisited}）が残っていれば v2 へ移行する。 */
function migrateV1(): Store | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY_V1);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const store = emptyStore();
    const learned: Record<string, string[]> = p?.learned ?? {};
    for (const [sutraId, ids] of Object.entries(learned)) {
      const lines: Record<string, LineStat> = {};
      for (const id of ids as string[]) lines[id] = { ...emptyStat(), learned: true };
      store.sutras[sutraId] = { lines, lastVisited: p?.lastVisited?.[sutraId] };
    }
    window.localStorage.setItem(KEY, JSON.stringify(store));
    return store;
  } catch {
    return null;
  }
}

function read(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return migrateV1() ?? emptyStore();
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object") return emptyStore();
    return { version: 2, sutras: p.sutras ?? {}, activity: p.activity ?? {} };
  } catch {
    return emptyStore();
  }
}

function write(s: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* 容量超過・プライベートモード等は黙って無視 */
  }
}

function ensure(s: Store, sutraId: string): SutraProgress {
  if (!s.sutras[sutraId]) s.sutras[sutraId] = { lines: {} };
  return s.sutras[sutraId];
}

function bumpActivity(s: Store): void {
  const k = todayKey();
  s.activity[k] = (s.activity[k] ?? 0) + 1;
}

// ===== 純粋セレクタ（コンポーネントから利用） =====

/** 「覚えた」行数。 */
export function learnedCount(stats: Record<string, LineStat>): number {
  return Object.values(stats).filter((s) => s.learned).length;
}

/** セッション横断の自己採点正解率（0..1）。出題ゼロなら null。 */
export function overallAccuracy(stats: Record<string, LineStat>): number | null {
  let c = 0;
  let n = 0;
  for (const s of Object.values(stats)) {
    c += s.correct;
    n += s.seen;
  }
  return n > 0 ? c / n : null;
}

/** ある行が「苦手」か。出題実績があり、正答率<0.6 または ✕が2回以上。 */
export function isWeak(s: LineStat): boolean {
  if (s.seen <= 0) return false;
  return s.correct / s.seen < 0.6 || s.incorrect >= 2;
}

/** 苦手行のID一覧。 */
export function weakLineIds(stats: Record<string, LineStat>): string[] {
  return Object.entries(stats)
    .filter(([, s]) => isWeak(s))
    .map(([id]) => id);
}

/** 今日を起点に連続して学習した日数（今日に活動がなければ0）。 */
export function computeStreak(activity: Record<string, number>): number {
  let streak = 0;
  const d = new Date();
  // 今日から1日ずつ遡り、活動のある連続日数を数える
  for (;;) {
    const z = (n: number) => String(n).padStart(2, "0");
    const key = `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
    if ((activity[key] ?? 0) > 0) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** 日別アクティビティ1日ぶん（カレンダー表示用）。 */
export interface ActivityDay {
  /** YYYY-MM-DD（ローカル） */
  date: string;
  /** その日の学習操作回数 */
  count: number;
  /** 今日か */
  today: boolean;
}

/** 直近 days 日の日別アクティビティ（古い→新しい順）。 */
export function recentActivity(
  activity: Record<string, number>,
  days: number,
): ActivityDay[] {
  const z = (n: number) => String(n).padStart(2, "0");
  const today = todayKey();
  const out: ActivityDay[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  for (let i = 0; i < days; i += 1) {
    const key = `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
    out.push({ date: key, count: activity[key] ?? 0, today: key === today });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** これまでに学習した日数（活動のある日の総数）。 */
export function activeDaysCount(activity: Record<string, number>): number {
  let n = 0;
  for (const v of Object.values(activity)) if (v > 0) n += 1;
  return n;
}

// ===== フック =====

/**
 * ある経文の学習進捗を扱うフック。
 * マウント時に復元し、各操作で localStorage に永続化する。
 */
export function useSutraProgress(sutraId: string) {
  const [stats, setStats] = useState<Record<string, LineStat>>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = read();
    setStats({ ...(s.sutras[sutraId]?.lines ?? {}) });
    setStreak(computeStreak(s.activity));
  }, [sutraId]);

  const update = useCallback(
    (mutate: (s: Store, p: SutraProgress) => void) => {
      const s = read();
      const p = ensure(s, sutraId);
      mutate(s, p);
      p.lastVisited = nowISO();
      write(s);
      setStats({ ...p.lines });
      setStreak(computeStreak(s.activity));
    },
    [sutraId],
  );

  /** 「覚えた」フラグの設定。 */
  const markLearned = useCallback(
    (lineId: string, learned: boolean) => {
      update((s, p) => {
        const st = p.lines[lineId] ?? emptyStat();
        st.learned = learned;
        st.lastReviewed = nowISO();
        p.lines[lineId] = st;
        bumpActivity(s);
      });
    },
    [update],
  );

  /** テスト等の自己採点結果を記録（correct=◯）。 */
  const recordResult = useCallback(
    (lineId: string, correct: boolean) => {
      update((s, p) => {
        const st = p.lines[lineId] ?? emptyStat();
        st.seen += 1;
        if (correct) st.correct += 1;
        else st.incorrect += 1;
        st.lastReviewed = nowISO();
        p.lines[lineId] = st;
        bumpActivity(s);
      });
    },
    [update],
  );

  /** この経文の進捗を全消去。 */
  const reset = useCallback(() => {
    update((s) => {
      s.sutras[sutraId] = { lines: {} };
    });
  }, [update, sutraId]);

  return { stats, streak, markLearned, recordResult, reset };
}

/**
 * 全経文を横断した学習サマリーを読むフック（ホーム表示用・読み取り専用）。
 * マウント後に localStorage を一度読むだけで、書き込みはしない。
 * SSR/初回描画は ready=false（空）で、ハイドレーション不一致を避ける。
 */
export function useLearningSummary() {
  const [activity, setActivity] = useState<Record<string, number>>({});
  const [sutras, setSutras] = useState<
    Record<string, Record<string, LineStat>>
  >({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = read();
    setActivity(s.activity);
    const bySutra: Record<string, Record<string, LineStat>> = {};
    for (const [id, p] of Object.entries(s.sutras)) bySutra[id] = p.lines;
    setSutras(bySutra);
    setReady(true);
  }, []);

  return { ready, activity, sutras, streak: computeStreak(activity) };
}
