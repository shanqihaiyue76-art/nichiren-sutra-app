"use client";

import Link from "next/link";
import { getSutra } from "@/data";
import { mostRecentSutraId, useLearningSummary } from "@/lib/learningStore";

/** 最後に学習した経文へ1タップで戻れるカード。学習履歴が無ければ何も表示しない。 */
export default function ContinueCard() {
  const { ready, lastVisited } = useLearningSummary();
  if (!ready) return null;

  const id = mostRecentSutraId(lastVisited);
  if (!id) return null;
  const sutra = getSutra(id);
  if (!sutra) return null;

  return (
    <Link href={`/sutra/${id}`} className="continue-card">
      <span className="continue-card-label">続きから</span>
      <span className="continue-card-title">{sutra.title}</span>
      {sutra.subtitle && (
        <span className="continue-card-sub">{sutra.subtitle}</span>
      )}
    </Link>
  );
}
