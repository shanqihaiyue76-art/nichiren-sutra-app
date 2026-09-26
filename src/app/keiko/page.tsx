import Link from "next/link";
import type { Metadata } from "next";
import {
  keikoGuides,
  keikoMemorize,
  keikoMeta,
  keikoPreparation,
} from "@/data/keiko";
import KeikoPoints from "@/components/KeikoPoints";

export const metadata: Metadata = {
  title: "稽古の心得｜読経練習",
};

/** 稽古の心得（読経の前の準備・各お経で大切なこと・覚え方）。静的ページ。 */
export default function KeikoPage() {
  return (
    <main className="hub keiko-page">
      <header className="mem-header">
        <Link href="/" className="back-btn" aria-label="戻る">
          ‹
        </Link>
        <div className="mem-title-wrap">
          <span className="mem-title">稽古の心得</span>
          <span className="mem-sub">
            {keikoMeta.purpose}に向けて・{keikoMeta.date} {keikoMeta.place}（{keikoMeta.teachers}）
          </span>
        </div>
      </header>

      <p className="keiko-intro">
        稽古の録画から、はっきり聞き取れた教えだけを載せています。
        添えてある時刻は録画の位置です。
      </p>

      <section className="keiko-section">
        <h2 className="keiko-h">読経の前に（準備）</h2>
        <KeikoPoints points={keikoPreparation} />
      </section>

      {keikoGuides.map((g) => (
        <section key={g.sutraId} id={g.sutraId} className="keiko-section">
          <h2 className="keiko-h">{g.name}</h2>
          <p className="keiko-scope">稽古で読んだ範囲：{g.scope}</p>
          <KeikoPoints points={g.points} />
          <Link href={`/play/${g.sourceId}`} className="hub-mode keiko-play">
            <span className="hub-mode-title">先生の読経で練習</span>
            <span className="hub-mode-sub">稽古の録音に合わせて読む・くり返す</span>
          </Link>
        </section>
      ))}

      <section className="keiko-section">
        <h2 className="keiko-h">覚え方</h2>
        <KeikoPoints points={keikoMemorize} />
      </section>
    </main>
  );
}
