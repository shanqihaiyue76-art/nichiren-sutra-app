import Link from "next/link";
import { sources, sutras, getSutra } from "@/data";
import { hasTimings } from "@/lib/track";
import { flattenLines, isLearnable } from "@/data/types";
import { isKeikoSource, keikoGuides, keikoMeta } from "@/data/keiko";
import HomeSummary from "@/components/HomeSummary";
import TextSizeControl from "@/components/TextSizeControl";
import ContinueCard from "@/components/ContinueCard";

export default function Home() {
  const focusSutraIds = keikoGuides.map((g) => g.sutraId);
  const otherSources = sources.filter((s) => !isKeikoSource(s.id));

  return (
    <main className="home">
      <header className="home-header">
        <h1 className="home-title">読経練習</h1>
        <p className="home-sub">聞きながら、見て、覚える</p>
        <TextSizeControl />
      </header>

      {/* 度牒交付式に向けた稽古（先生の読経で練習する経文だけ）。ホームの一番上に枠で置く。 */}
      <section className="keiko-frame" aria-labelledby="keiko-frame-title">
        <h2 id="keiko-frame-title" className="keiko-frame-title">
          {keikoMeta.purpose}
        </h2>
        <p className="keiko-home-lead">
          稽古（{keikoMeta.date}）で習ったことを、先生の読経に合わせてくり返し練習する
        </p>
        <ul className="sutra-list">
          {keikoGuides.map((g) => (
            <li key={g.sourceId} className="keiko-card">
              <Link href={`/sutra/${g.sutraId}`} className="keiko-card-head">
                <span className="sutra-card-title">{g.name}</span>
                <span className="sutra-card-sub">{g.scope}</span>
              </Link>
              <div className="keiko-card-actions">
                <Link href={`/play/${g.sourceId}`} className="keiko-action primary">
                  先生の読経で練習
                </Link>
                <Link href={`/memorize/${g.sutraId}`} className="keiko-action">
                  暗記
                </Link>
                <Link href={`/test/${g.sutraId}`} className="keiko-action">
                  テスト
                </Link>
              </div>
            </li>
          ))}
          <li>
            <Link href="/keiko" className="sutra-card keiko-guide-card">
              <div className="sutra-card-main">
                <span className="sutra-card-title">稽古の心得</span>
                <span className="sutra-card-sub">読経の前の準備・大切なこと・覚え方</span>
              </div>
              <span className="keiko-guide-arrow" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* 学習サマリー（連続学習・覚えた行・直近の学習）。端末内データ。
          「覚えた行」は稽古で練習する経文だけを数える。 */}
      <HomeSummary sutraIds={focusSutraIds} />

      {/* 続きから（最後に学習した経文へ1タップ復帰）。履歴が無ければ非表示。 */}
      <ContinueCard />

      {/* 稽古以外の経文・音源。ふだんは畳んでおく。 */}
      <details className="home-more">
        <summary className="home-more-summary">その他の経文・音源（参考）</summary>

        {/* 音源で同期再生（機能の一部）。 */}
        <h2 className="home-section-title">音源で同期再生</h2>
        <ul className="sutra-list">
          {otherSources.map((s) => {
            const sutraTitles = s.sutraIds
              .map((id) => getSutra(id)?.title)
              .filter(Boolean)
              .join("・");
            return (
              <li key={s.id}>
                <Link href={`/play/${s.id}`} className="sutra-card">
                  <div className="sutra-card-main">
                    <span className="sutra-card-title">{s.displayTitle}</span>
                    <span className="sutra-card-sub">{sutraTitles}</span>
                  </div>
                  <div className="sutra-card-tags">
                    {s.sutraIds.length > 1 && (
                      <span className="badge badge-continuous">連続勤行</span>
                    )}
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
      </details>
    </main>
  );
}
