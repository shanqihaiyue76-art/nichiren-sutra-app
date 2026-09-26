import type { KeikoPoint } from "@/data/keiko";

/**
 * 稽古で教わったことの箇条書き。出どころ（稽古録画の時刻／録音から計測）を添える。
 * フックを使わないので、サーバー・クライアントどちらのコンポーネントからも使える。
 */
export default function KeikoPoints({ points }: { points: KeikoPoint[] }) {
  return (
    <ol className="keiko-points">
      {points.map((p) => (
        <li key={p.text} className="keiko-point">
          <span className="keiko-point-text">{p.text}</span>
          {p.note && <span className="keiko-point-note">{p.note}</span>}
          {(p.at || p.measured) && (
            <span className="keiko-point-src">
              {p.measured ? "録音から計測" : `稽古の録画 ${p.at}`}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
