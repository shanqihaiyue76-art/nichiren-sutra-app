#!/usr/bin/env node
/**
 * 手法A PoC ランナー（NW全文アライン）。
 *
 *   OCR Canonical Draft（かんじ列・暫定正規）↔ Whisper認識（かんじ列・補助）を
 *   Needleman-Wunsch でグローバルアラインし、句ごとのオンセット時刻を割当てる。
 *   表示用は正規（ここではOCR暫定）を使用し、Whisperは時刻供給の補助に限定。
 *   一致度が低い句は捏造せず null（未割当）。
 *
 *   QA指標を算出:
 *     - 割当成功率 / 未割当率
 *     - 平均誤差 / 最大誤差（参照＝OCR初出時刻 first_t。オフセット除去後の残差で評価）
 *     - 処理時間（NWアライン本体の壁時計）
 *     - 単調性違反数（同期表示では時刻が逆行してはならない）
 *
 *   ⚠ 参照の限界: OCR first_t は「画面に出た時刻」で、読誦オンセットは画面出現より
 *     遅れる（スクロール依存の読み遅延）。よって誤差は読み遅延ノイズを含む上界。
 *     真の絶対誤差は経本＋人手オンセット確定後に再評価する。
 *
 * usage:
 *   node scripts/nw_align_draft.mjs \
 *     --draft .cache/hobenpon_canonical_draft.json \
 *     --whisper .cache/_oN7QCtk3lk.whisper.json \
 *     [--window 175,386] [--min-match 0.25] [--max-gap 90] \
 *     [--out .cache/hobenpon_methodA_nw.json]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def;
};
const draftPath = opt("draft", ".cache/hobenpon_canonical_draft.json");
const whisperPath = opt("whisper", ".cache/_oN7QCtk3lk.whisper.json");
const outPath = opt("out", null);
const MIN_MATCH = parseFloat(opt("min-match", "0.25"));
const MAX_GAP = parseFloat(opt("max-gap", "90"));
const win = opt("window", null);
const [winA, winB] = win ? win.split(",").map(Number) : [null, null];

for (const p of [draftPath, whisperPath]) {
  if (!existsSync(p)) { console.error(`not found: ${p}`); process.exit(1); }
}

// ---- 文字正規化（空白・約物除去。かんじ/かなはそのまま） ----
const norm = (s) =>
  (s || "")
    .replace(/[\s　]/g, "")
    .replace(/[、。，．・「」『』（）()？！?!゛゜～\-—…]/g, "");

// ---- Whisper → セグメント（time付） ----
function parseWhisper(path) {
  const j = JSON.parse(readFileSync(path, "utf8"));
  const list = j.transcription || j.segments || [];
  const segs = [];
  for (const s of list) {
    let from, to;
    if (s.offsets) { from = s.offsets.from / 1000; to = s.offsets.to / 1000; }
    else { from = s.start; to = s.end; }
    const text = (s.text || "").replace(/\[[^\]]*\]/g, "").trim();
    if (!text) continue;
    if (winA != null && (to < winA || from > winB)) continue; // 区間外は除外
    segs.push({ text, start: Math.round(from * 10) / 10, end: Math.round(to * 10) / 10 });
  }
  return segs;
}

// ---- 認識テキスト → char列（セグメント内で時刻を線形補間） ----
function buildRecognizedStream(segs) {
  const chars = [], times = [];
  for (const s of segs) {
    const cs = [...norm(s.text)];
    const span = Math.max(0.001, s.end - s.start);
    cs.forEach((c, i) => { chars.push(c); times.push(s.start + (span * i) / cs.length); });
  }
  return { chars, times };
}

// ---- 正規（OCR draft）→ char列（行境界つき） ----
function buildCanonicalStream(canon) {
  const chars = [], lineStartAt = [], lineOf = [];
  canon.forEach((ln, li) => {
    [...norm(ln.text)].forEach((c, i) => {
      if (i === 0) lineStartAt[chars.length] = li;
      lineOf[chars.length] = li;
      chars.push(c);
    });
  });
  return { chars, lineStartAt, lineOf };
}

// ---- Needleman-Wunsch（A=canonical を B=recognized に対応付け） ----
function align(A, B) {
  const n = A.length, m = B.length;
  const MATCH = 2, MIS = -1, GAP = -2;
  const dir = new Uint8Array((n + 1) * (m + 1)); // 0=diag 1=up 2=left
  let prev = new Int32Array(m + 1), curr = new Int32Array(m + 1);
  for (let j = 0; j <= m; j++) { prev[j] = j * GAP; dir[j] = 2; }
  for (let i = 1; i <= n; i++) {
    curr[0] = i * GAP; dir[i * (m + 1)] = 1;
    const ai = A[i - 1];
    for (let j = 1; j <= m; j++) {
      const d = prev[j - 1] + (ai === B[j - 1] ? MATCH : MIS);
      const up = prev[j] + GAP, left = curr[j - 1] + GAP;
      let best = d, dd = 0;
      if (up > best) { best = up; dd = 1; }
      if (left > best) { best = left; dd = 2; }
      curr[j] = best; dir[i * (m + 1) + j] = dd;
    }
    [prev, curr] = [curr, prev];
  }
  const bForA = new Int32Array(n).fill(-1);
  let i = n, j = m;
  while (i > 0 || j > 0) {
    const d = dir[i * (m + 1) + j];
    if (i > 0 && j > 0 && d === 0) { bForA[i - 1] = j - 1; i--; j--; }
    else if (i > 0 && d === 1) { i--; }
    else { j--; }
  }
  return bForA;
}

function lineMatchRatio(li, can, rec, bForA) {
  let total = 0, hit = 0;
  for (let q = 0; q < can.chars.length; q++) {
    if (can.lineOf[q] !== li) continue;
    total++;
    const b = bForA[q];
    if (b >= 0 && can.chars[q] === rec.chars[b]) hit++;
  }
  return total ? hit / total : 0;
}

// ===== 実行 =====
const draft = JSON.parse(readFileSync(draftPath, "utf8"));
const canon = draft.lines.map((l) => ({ idx: l.idx, text: l.text, first_t: l.first_t }));
const segments = parseWhisper(whisperPath);
const rec = buildRecognizedStream(segments);
const can = buildCanonicalStream(canon);

console.error(`canonical: ${canon.length}句 / ${can.chars.length}字   recognized: ${segments.length}seg / ${rec.chars.length}字` +
  (winA != null ? `   window=[${winA},${winB}]s` : "   window=full"));

const t0 = performance.now();
const bForA = align(can.chars, rec.chars);
const alignMs = performance.now() - t0;

// 句ごとオンセット割当
const rows = [];
for (let p = 0; p < can.chars.length; p++) {
  const li = can.lineStartAt[p];
  if (li == null) continue;
  const ln = canon[li];
  const ratio = lineMatchRatio(li, can, rec, bForA);
  let onset = null;
  if (ratio >= MIN_MATCH) {
    let q = p, b = -1;
    while (q < can.chars.length) {
      if (bForA[q] >= 0) { b = bForA[q]; break; }
      if (q !== p && can.lineStartAt[q] != null) break;
      q++;
    }
    onset = b >= 0 ? Math.round(rec.times[b] * 10) / 10 : null;
  }
  rows.push({ idx: ln.idx, text: ln.text, first_t: ln.first_t,
              onset, conf: Math.round(ratio * 100) / 100 });
}

// ギャップ異常フィルタ（直前アンカーから MAX_GAP 秒超の飛びは誤対応として null 化）
let lastOnset = null;
for (const r of rows) {
  if (r.onset == null) continue;
  if (lastOnset != null && r.onset - lastOnset > MAX_GAP) { r.onset = null; r.gapDropped = true; continue; }
  lastOnset = r.onset;
}

// ===== QA指標 =====
const total = rows.length;
const mapped = rows.filter((r) => r.onset != null);
const nMapped = mapped.length;
const nNull = total - nMapped;

// 参照(OCR first_t)との残差。オフセット(中央値=読み遅延の推定)を除去して評価。
const resid = mapped.map((r) => r.onset - r.first_t).sort((a, b) => a - b);
const median = resid.length ? resid[Math.floor(resid.length / 2)] : 0;
const absErr = mapped.map((r) => Math.abs((r.onset - r.first_t) - median));
const meanErr = absErr.length ? absErr.reduce((a, b) => a + b, 0) / absErr.length : 0;
const maxErr = absErr.length ? Math.max(...absErr) : 0;
// 参考: オフセット未除去の生差
const rawAbs = mapped.map((r) => Math.abs(r.onset - r.first_t));
const rawMean = rawAbs.length ? rawAbs.reduce((a, b) => a + b, 0) / rawAbs.length : 0;
const rawMax = rawAbs.length ? Math.max(...rawAbs) : 0;

// 単調性違反（mapped句のオンセットが前句より早い回数）
let monoViol = 0, prevO = -Infinity;
for (const r of mapped) { if (r.onset < prevO) monoViol++; prevO = Math.max(prevO, r.onset); }

const pct = (x) => `${(100 * x).toFixed(1)}%`;
console.log("\n================ 手法A（NW全文アライン）QAレポート ================");
console.log(`対象           : 方便品 ${total}句`);
console.log(`Ground Truth   : 動画表示テキスト(OCR暫定/ASR非依存)。時刻=画面表示時刻 first_t`);
console.log(`認識ソース     : Whisper large-v3（補助・時刻供給のみ。評価基準には不使用）`);
console.log(`NWスコア       : match=2 mismatch=-1 gap=-2 / MIN_MATCH=${MIN_MATCH} / MAX_GAP=${MAX_GAP}s`);
console.log(`照合粒度       : 文字(かんじ)レベル。読み(かな)は不使用`);
console.log("--------------------------------------------------------------");
console.log(`割当成功率     : ${pct(nMapped / total)}  (${nMapped}/${total})`);
console.log(`未割当率       : ${pct(nNull / total)}  (${nNull}/${total})`);
console.log(`平均誤差(GT基準): ${rawMean.toFixed(2)}s   （|onset − GT表示時刻| 生差。評価はGT基準/ASR同士は不採用）`);
console.log(`最大誤差(GT基準): ${rawMax.toFixed(2)}s   （同上）`);
console.log(`  ├系統オフセット: ${median.toFixed(1)}s   （表示→読誦の読み遅延＝onset−first_t の中央値）`);
console.log(`  └残差ジッタ    : 平均 ${meanErr.toFixed(2)}s / 最大 ${maxErr.toFixed(2)}s   （オフセット除去後＝整列のばらつき）`);
console.log(`単調性違反     : ${monoViol}件   （mappedオンセットの逆行回数。同期表示の健全性）`);
console.log(`処理時間(NW)   : ${alignMs.toFixed(1)}ms   （${can.chars.length}×${rec.chars.length} DP）`);
console.log(`注: GT時刻は画面表示時刻。真の読誦オンセット絶対誤差は経本+人手ラベル後に確定（現状=未確認）。`);
console.log("--------------------------------------------------------------");
console.log("句ごと割当（⚠=未割当 / g=gap除外）:");
for (const r of rows) {
  const m = r.onset == null ? (r.gapDropped ? "g" : "⚠") : " ";
  const o = r.onset == null ? "  --  " : `${r.onset.toFixed(1)}s`;
  console.log(`${m}${String(r.idx).padStart(3)} c=${r.conf.toFixed(2)} ocr=${r.first_t.toFixed(1)}s nw=${o.padStart(7)}  ${r.text}`);
}

if (outPath) {
  writeFileSync(outPath, JSON.stringify({
    method: "A-NW", sutra: "hobenpon",
    note: "手法A: NW全文アライン(OCR暫定かんじ↔Whisperかんじ)。Whisperは補助(時刻供給のみ)。低一致はnull(捏造なし)。",
    ground_truth: "動画表示テキスト(OCR暫定/ASR非依存)。時刻=画面表示時刻 first_t。経本入手後に差替。",
    eval_policy: "平均/最大誤差はGT基準(生差 gt_*_err_s)を主指標とする。ASR出力同士の比較は不採用。",
    params: { MATCH: 2, MIS: -1, GAP: -2, MIN_MATCH, MAX_GAP, window: winA != null ? [winA, winB] : "full" },
    metrics: {
      total, mapped: nMapped, unmapped: nNull,
      assign_rate: nMapped / total, unassign_rate: nNull / total,
      // GT基準(主指標): |onset − first_t| の生差
      gt_mean_err_s: rawMean, gt_max_err_s: rawMax,
      // 内訳: 系統オフセット(読み遅延) と 残差ジッタ(オフセット除去後)
      est_read_lag_s: median, residual_mean_err_s: meanErr, residual_max_err_s: maxErr,
      mono_violations: monoViol, align_ms: alignMs,
    },
    lines: rows,
  }, null, 2));
  console.error(`[saved] ${outPath}`);
}
