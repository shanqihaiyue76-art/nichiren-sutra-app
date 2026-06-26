"use client";

import { sutras as allSutras } from "@/data";
import { flattenLines } from "@/data/types";
import {
  activeDaysCount,
  learnedCount,
  recentActivity,
  useLearningSummary,
} from "@/lib/learningStore";

/** ホーム上部の学習サマリー（連続学習・覚えた行・直近の学習カレンダー）。 */
const DAYS = 14;

function level(count: number, max: number): number {
  if (count <= 0) return 0;
  const r = count / max;
  if (r <= 0.25) return 1;
  if (r <= 0.5) return 2;
  if (r <= 0.75) return 3;
  return 4;
}

export default function HomeSummary() {
  const { ready, activity, sutras, streak } = useLearningSummary();

  // 全経文の「覚えた」合計 / 総行数（総行数は経文データ由来）
  let learned = 0;
  let total = 0;
  for (const s of allSutras) {
    total += flattenLines(s).length;
    learned += learnedCount(sutras[s.id] ?? {});
  }

  const days = recentActivity(activity, DAYS);
  const activeDays = activeDaysCount(activity);
  const maxCount = days.reduce((m, d) => Math.max(m, d.count), 0);

  // SSR・初回描画は中身を出さず、レイアウトだけ確保（ハイドレーション不一致回避）
  if (!ready) {
    return <section className="home-summary home-summary-skeleton" aria-hidden />;
  }

  const started = activeDays > 0 || learned > 0;

  return (
    <section className="home-summary" aria-label="学習サマリー">
      <div className="home-summary-stats">
        <div className="home-summary-stat">
          <span className="home-summary-num">
            {streak}
            <small>日</small>
          </span>
          <span className="home-summary-label">連続学習</span>
        </div>
        <div className="home-summary-stat">
          <span className="home-summary-num">
            {learned}
            <small>/{total}</small>
          </span>
          <span className="home-summary-label">覚えた行</span>
        </div>
        <div className="home-summary-stat">
          <span className="home-summary-num">
            {activeDays}
            <small>日</small>
          </span>
          <span className="home-summary-label">のべ学習日</span>
        </div>
      </div>

      <div className="home-cal" role="img" aria-label={`直近${DAYS}日の学習`}>
        {days.map((d) => (
          <span
            key={d.date}
            className={`home-cal-cell home-cal-l${level(d.count, maxCount)}${
              d.today ? " home-cal-today" : ""
            }`}
            title={`${d.date}: ${d.count}`}
          />
        ))}
      </div>

      {!started && (
        <p className="home-summary-hint">
          今日から始めましょう。経文を選んで覚える・テストすると記録されます。
        </p>
      )}
    </section>
  );
}
