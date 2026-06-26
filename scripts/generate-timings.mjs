#!/usr/bin/env node
/**
 * YouTube動画 → 同期歌詞タイムスタンプ 自動生成パイプライン
 *
 *   node scripts/generate-timings.mjs <youtubeId> [options]
 *
 * options:
 *   --sutras hobenpon,jigage   既存行へ割当てる対象経文ID（カンマ区切り。省略時は割当をスキップ）
 *   --model  <path>            whisper ggmlモデル（既定 models/ggml-large-v3.bin）
 *   --maxlen <n>               whisperセグメント最大文字数（既定 32。0=制限なし）
 *   --skip-download            音声DL/変換を省略（.cache に WAV がある前提）
 *   --skip-transcribe          whisper を省略（.cache に JSON がある前提）
 *
 * 出力（すべて .cache/ 配下）:
 *   <id>.16k.wav        16kHz mono 音声
 *   <id>.whisper.json   whisper 生出力
 *   <id>.draft.json     ★全文ドラフト（認識テキスト＋秒。新規経文の素材）
 *   <id>.timings.json   ★既存経文行への割当結果（sources.ts の timings に貼る形）
 *
 * ⚠ 読経はASRが苦手。出力は「人手レビュー前提のドラフト」。捏造ではなく実音声由来だが、
 *   テキスト誤認識・行境界ずれは必ず残る。確定前に経本と照合すること。
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, ".cache");

// ---- 引数 ----
const argv = process.argv.slice(2);
const youtubeId = argv.find((a) => !a.startsWith("--"));
if (!youtubeId) {
  console.error("usage: node scripts/generate-timings.mjs <youtubeId> [--sutras a,b] [--model p] [--maxlen n] [--skip-download] [--skip-transcribe]");
  process.exit(1);
}
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def;
};
const has = (name) => argv.includes(`--${name}`);
const model = opt("model", join(ROOT, "models/ggml-large-v3.bin"));
const maxlen = opt("maxlen", "32");
const sutraIds = (opt("sutras", "") || "").split(",").map((s) => s.trim()).filter(Boolean);

mkdirSync(CACHE, { recursive: true });
const wav = join(CACHE, `${youtubeId}.16k.wav`);
const rawJson = join(CACHE, `${youtubeId}.whisper.json`);
const draftOut = join(CACHE, `${youtubeId}.draft.json`);
const timingsOut = join(CACHE, `${youtubeId}.timings.json`);

const run = (cmd, args) => {
  console.error(`$ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { stdio: ["ignore", "inherit", "inherit"] });
};

// ---- 1. 音声DL + 16kHz mono WAV ----
if (!has("skip-download") && !existsSync(wav)) {
  const dl = join(CACHE, `${youtubeId}.src`);
  run("yt-dlp", ["-f", "bestaudio", "-o", `${dl}.%(ext)s`, `https://www.youtube.com/watch?v=${youtubeId}`]);
  // yt-dlp の拡張子は可変なので glob 的に探す
  const found = execFileSync("sh", ["-c", `ls ${dl}.* 2>/dev/null | head -1`]).toString().trim();
  run("ffmpeg", ["-y", "-i", found, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
}
if (!existsSync(wav)) {
  console.error(`WAV not found: ${wav}（--skip-download 指定時は事前に用意してください）`);
  process.exit(1);
}

// ---- 2. whisper 文字起こし（時刻付き） ----
if (!has("skip-transcribe") && !existsSync(rawJson)) {
  if (!existsSync(model)) {
    console.error(`model not found: ${model}`);
    process.exit(1);
  }
  const ofBase = join(CACHE, `${youtubeId}.whisper`);
  run("whisper-cli", [
    "-m", model,
    "-f", wav,
    "-l", "ja",
    "-oj",
    "-of", ofBase,
    "--max-len", String(maxlen),
    "-mc", "0",  // max-context 0: 前セグメントの文脈を持ち越さない（読経の繰り返しハルシネーション抑制）
    "-pp",
  ]);
}

// ---- 3. whisper JSON をセグメント配列へ ----
function parseWhisper(path) {
  const j = JSON.parse(readFileSync(path, "utf8"));
  const list = j.transcription || j.segments || [];
  const segs = [];
  for (const s of list) {
    // whisper.cpp: offsets.from/to(ms)、openai: start/end(sec)
    let from, to;
    if (s.offsets) {
      from = s.offsets.from / 1000;
      to = s.offsets.to / 1000;
    } else {
      from = s.start;
      to = s.end;
    }
    const text = (s.text || "").replace(/\[[^\]]*\]/g, "").trim();
    if (!text) continue;
    segs.push({ text, start: Math.round(from * 10) / 10, end: Math.round(to * 10) / 10 });
  }
  return segs;
}
const segments = parseWhisper(rawJson);
console.error(`segments: ${segments.length}`);

// ---- 文字正規化（空白・記号除去） ----
const norm = (s) =>
  (s || "")
    .replace(/[\s　]/g, "")
    .replace(/[、。，．・「」『』（）()？！?!゛゜～\-—…]/g, "");

// ---- 4. 全文ドラフト（出力A） ----
const draftLines = segments.map((s, i) => ({
  id: `seg${String(i + 1).padStart(3, "0")}`,
  text: s.text,
  start: s.start,
}));
writeFileSync(
  draftOut,
  JSON.stringify(
    {
      youtubeId,
      note: "⚠ 音声認識ドラフト。テキストは要校正。start は実音声由来の秒。",
      generatedAt: new Date().toISOString(),
      lines: draftLines,
    },
    null,
    2
  )
);
console.error(`draft -> ${draftOut} (${draftLines.length} lines)`);

// ---- 5. 既存経文行への割当（出力B / Needleman-Wunsch アライン） ----
function loadCanonical(ids) {
  // data/*.ts から id/text を素朴に抽出（簡易パーサ）
  const lines = [];
  for (const id of ids) {
    const file = join(ROOT, "src/data", `${id}.ts`);
    if (!existsSync(file)) {
      console.error(`canonical not found: ${file}`);
      continue;
    }
    const src = readFileSync(file, "utf8");
    // 行オブジェクトは { id: "h1", text: "...", ... }。id の直後が text のものだけ拾う
    // （経文/セクションの id は直後が title なので除外される）
    const re = /id:\s*"([^"]+)",\s*text:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) {
      // セクションIDなど text を持たないものは正規表現上ペアにならないので問題なし
      lines.push({ sutraId: id, lineId: m[1], text: m[2] });
    }
  }
  return lines;
}

function buildRecognizedStream(segs) {
  // 認識テキストを1本のchar列にし、各charへ時刻を割当（セグメント内は線形補間）
  const chars = [];
  const times = [];
  for (const s of segs) {
    const cs = [...norm(s.text)];
    const span = Math.max(0.001, s.end - s.start);
    cs.forEach((c, i) => {
      chars.push(c);
      times.push(s.start + (span * i) / cs.length);
    });
  }
  return { chars, times };
}

function buildCanonicalStream(canon) {
  const chars = [];
  const lineStartAt = []; // canonicalチャー位置 -> lineIndex（その行の先頭charのみ）
  const lineOf = [];      // canonicalチャー位置 -> lineIndex（全char）
  canon.forEach((ln, li) => {
    const cs = [...norm(ln.text)];
    cs.forEach((c, i) => {
      if (i === 0) lineStartAt[chars.length] = li;
      lineOf[chars.length] = li;
      chars.push(c);
    });
  });
  return { chars, lineStartAt, lineOf };
}

// 行ごとの一致度（その行のcanonical文字のうち、認識列と実際に一致した割合）
const MIN_MATCH = 0.25; // これ未満は捏造せず null
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

// Needleman-Wunsch グローバルアライン。canonical(A) を recognized(B) に対応付ける。
// 返り値: aOf[bIndex] は使わず、bForA[aIndex] = 対応するBの位置(or -1)
function align(A, B) {
  const n = A.length, m = B.length;
  const MATCH = 2, MIS = -1, GAP = -2;
  // メモリ節約のため Int8 の方向だけ全保持、スコアは2行で回す
  const dir = new Uint8Array((n + 1) * (m + 1)); // 0=diag 1=up(Aを消費,gap inB) 2=left(Bを消費,gap inA)
  let prev = new Int32Array(m + 1);
  let curr = new Int32Array(m + 1);
  for (let j = 0; j <= m; j++) { prev[j] = j * GAP; dir[j] = 2; }
  for (let i = 1; i <= n; i++) {
    curr[0] = i * GAP;
    dir[i * (m + 1)] = 1;
    const ai = A[i - 1];
    for (let j = 1; j <= m; j++) {
      const d = prev[j - 1] + (ai === B[j - 1] ? MATCH : MIS);
      const up = prev[j] + GAP;
      const left = curr[j - 1] + GAP;
      let best = d, dd = 0;
      if (up > best) { best = up; dd = 1; }
      if (left > best) { best = left; dd = 2; }
      curr[j] = best;
      dir[i * (m + 1) + j] = dd;
    }
    [prev, curr] = [curr, prev];
  }
  // traceback
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

let timings = [];
if (sutraIds.length) {
  const canon = loadCanonical(sutraIds);
  const rec = buildRecognizedStream(segments);
  const can = buildCanonicalStream(canon);
  console.error(`align: canonical ${can.chars.length} chars  vs recognized ${rec.chars.length} chars`);
  const bForA = align(can.chars, rec.chars);
  for (let p = 0; p < can.chars.length; p++) {
    const li = can.lineStartAt[p];
    if (li == null) continue;
    const ln = canon[li];
    // 一致度が低い行は捏造しない
    const ratio = lineMatchRatio(li, can, rec, bForA);
    if (ratio < MIN_MATCH) {
      timings.push({ lineId: ln.lineId, start: null, confidence: Math.round(ratio * 100) / 100 });
      continue;
    }
    // この行先頭char p に対応するBを探す（gapなら後方の最初の対応へ）
    let q = p, b = -1;
    while (q < can.chars.length) {
      if (bForA[q] >= 0) { b = bForA[q]; break; }
      if (q !== p && can.lineStartAt[q] != null) break;
      q++;
    }
    const start = b >= 0 ? Math.round(rec.times[b] * 10) / 10 : null;
    timings.push({ sutraId: ln.sutraId, lineId: ln.lineId, start, confidence: Math.round(ratio * 100) / 100 });
  }

  // ギャップ異常フィルタ: 経文ごと順に見て、直前アンカーから MAX_GAP 秒以上飛ぶ行は
  // 誤マッピングとみなし null 化（後半のハルシネーション領域への暴走を除去）
  const MAX_GAP = 90;
  const last = {};
  for (const t of timings) {
    if (t.start == null) continue;
    const prev = last[t.sutraId];
    if (prev != null && t.start - prev > MAX_GAP) {
      t.start = null;
      t.gapDropped = true;
      continue;
    }
    last[t.sutraId] = t.start;
  }
  writeFileSync(timingsOut, JSON.stringify(timings, null, 2));
  console.error(`timings -> ${timingsOut} (${timings.filter((t) => t.start != null).length}/${timings.length} mapped)`);
}

// ---- サマリ ----
console.log("\n========== SUMMARY ==========");
console.log(`video      : ${youtubeId}`);
console.log(`segments   : ${segments.length}`);
console.log(`draft      : ${draftOut}`);
if (sutraIds.length) {
  console.log(`timings    : ${timingsOut}`);
  console.log("\n--- 行ごとの一致度（confidence。低い行は捏造せず null）---");
  timings.forEach((t) =>
    console.log(`  ${t.lineId.padEnd(4)} ${t.start == null ? "（未割当）" : t.start + "s"}  conf=${t.confidence}`)
  );
  const ok = timings.filter((t) => t.start != null).sort((a, b) => a.start - b.start);
  console.log("\n--- sources.ts timings に貼り付け（confidence は除去済み）---");
  console.log(JSON.stringify(ok.map((t) => ({ lineId: t.lineId, start: t.start }))));
}
console.log("\n先頭5セグメント（認識結果の目視確認）:");
segments.slice(0, 5).forEach((s) => console.log(`  ${s.start.toFixed(1)}s  ${s.text}`));
