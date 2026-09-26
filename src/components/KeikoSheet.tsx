"use client";

import Link from "next/link";
import type { KeikoGuide } from "@/data/keiko";
import KeikoPoints from "./KeikoPoints";

interface Props {
  guide: KeikoGuide;
  open: boolean;
  onClose: () => void;
}

/** 再生画面から開く、稽古の要点のボトムシート（再生は止めない） */
export default function KeikoSheet({ guide, open, onClose }: Props) {
  return (
    <>
      <div
        className={`sheet-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={`sheet ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={`${guide.name}の要点`}
      >
        <div className="sheet-handle" />
        <div className="sheet-body">
          <p className="sheet-label">稽古で教わったこと</p>
          <p className="sheet-text">{guide.name}</p>
          <p className="sheet-reading">範囲：{guide.scope}</p>
          <hr className="sheet-divider" />
          <KeikoPoints points={guide.points} />
          <Link href="/keiko" className="keiko-sheet-link">
            読経の前の準備・覚え方も見る →
          </Link>
        </div>
        <button className="sheet-close" onClick={onClose}>
          閉じる
        </button>
      </div>
    </>
  );
}
