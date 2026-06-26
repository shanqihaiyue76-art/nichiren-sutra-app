import Link from "next/link";
import { sources, sutras, getSutra } from "@/data";
import { hasTimings } from "@/lib/track";
import { flattenLines, isLearnable } from "@/data/types";
import HomeSummary from "@/components/HomeSummary";

export default function Home() {
  return (
    <main className="home">
      <header className="home-header">
        <h1 className="home-title">読経練習</h1>
        <p className="home-sub">聞きながら、見て、覚える</p>
      </header>

      {/* 学習サマリー（連続学習・覚えた行・直近の学習）。端末内データ。 */}
      <HomeSummary />

      {/* 経文（学習の主単位）。覚えることが目的。 */}
      <h2 className="home-section-title">経文を覚える</h2>
      <ul className="sutra-list">
        {sutras.map((sutra) => {
          const lineCount = flattenLines(sutra).length;
          const verified = isLearnable(sutra.provenance);
          return (
            <li key={sutra.id}>
              <Link href={`/sutra/${sutra.id}`} className="sutra-card">
                <div className="sutra-card-main">
                  <span className="sutra-card-title">{sutra.title}</span>
                  <span className="sutra-card-sub">{sutra.subtitle ?? ""}</span>
                </div>
                <div className="sutra-card-tags">
                  <span className="badge badge-audio">学習</span>
                  <span className="badge badge-warn">{lineCount}行</span>
                  {!verified && <span className="badge badge-warn">暫定</span>}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 音源で同期再生（機能の一部）。 */}
      <h2 className="home-section-title">音源で同期再生</h2>
      <ul className="sutra-list">
        {sources.map((s) => {
          const sutraTitles = s.sutraIds
            .map((id) => getSutra(id)?.title)
            .filter(Boolean)
            .join("・");
          return (
            <li key={s.id}>
              <Link href={`/play/${s.id}`} className="sutra-card">
                <div className="sutra-card-main">
                  <span className="sutra-card-title">{s.title}</span>
                  <span className="sutra-card-sub">{sutraTitles}</span>
                </div>
                <div className="sutra-card-tags">
                  <span className={`badge badge-${s.kind}`}>
                    {s.kind === "youtube" ? "YouTube" : "音声"}
                  </span>
                  {!hasTimings(s) && (
                    <span className="badge badge-warn">未計測</span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
