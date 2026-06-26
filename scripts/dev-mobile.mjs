#!/usr/bin/env node
/**
 * スマホ実機確認用の開発サーバ起動ランナー。
 *
 *  - Mac のローカルIP(Wi-Fi/en0優先)を自動検出
 *  - iPhone/Android から開くアクセスURLをターミナルにバナー表示
 *  - Next.js dev サーバを 0.0.0.0 で起動（同一Wi-Fi上の実機から到達可能に）
 *  - qrcode-terminal が入っていればQRコードも表示（任意・無くても動作）
 *
 * usage:
 *   npm run dev:mobile           # ポート3000
 *   PORT=4000 npm run dev:mobile # ポート変更
 */
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const PORT = process.env.PORT || "3000";
const HOST = "0.0.0.0";

// ---- ローカルIPv4を列挙（内部/ループバック除外） ----
function listLanIPv4() {
  const ifaces = os.networkInterfaces();
  const found = [];
  for (const [name, addrs] of Object.entries(ifaces)) {
    for (const a of addrs || []) {
      // Node18+: family は "IPv4" 文字列 or 4（数値）の両対応
      const isV4 = a.family === "IPv4" || a.family === 4;
      if (isV4 && !a.internal) found.push({ name, address: a.address });
    }
  }
  return found;
}

// プライベートIP(192.168 / 10 / 172.16-31)を優先し、en0(Wi-Fi)を最優先に並べる
function pickPrimary(list) {
  const isPrivate = (ip) =>
    /^192\.168\./.test(ip) ||
    /^10\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip);
  const score = (e) =>
    (e.name === "en0" ? 0 : e.name.startsWith("en") ? 1 : 2) +
    (isPrivate(e.address) ? 0 : 10);
  return [...list].sort((a, b) => score(a) - score(b))[0] || null;
}

const lan = listLanIPv4();
const primary = pickPrimary(lan);
const localUrl = `http://localhost:${PORT}`;
const netUrl = primary ? `http://${primary.address}:${PORT}` : null;

// ---- バナー表示 ----
const line = "─".repeat(54);
console.log("");
console.log(line);
console.log("  📱  読経アプリ — スマホ実機アクセス");
console.log(line);
console.log(`  PC(このMac)   : ${localUrl}`);
if (netUrl) {
  console.log(`  スマホ(同Wi-Fi): ${netUrl}   ← iPhone/Androidで開く`);
} else {
  console.log("  スマホ(同Wi-Fi): ⚠ ローカルIP未検出（Wi-Fi未接続の可能性）");
}
if (lan.length > 1) {
  console.log("  他の候補IP    :");
  for (const e of lan) {
    if (primary && e.address === primary.address) continue;
    console.log(`                  http://${e.address}:${PORT}  (${e.name})`);
  }
}
console.log(line);
console.log("  ・Mac とスマホを同じ Wi-Fi に接続してください");
console.log("  ・初回はファイアウォールの受信許可ダイアログで「許可」を選択");
console.log("  ・Ctrl+C で停止");
console.log(line);

// ---- QRコード（任意。未インストールでも無視して継続） ----
async function maybeQr() {
  if (!netUrl) return;
  try {
    const qrcode = (await import("qrcode-terminal")).default;
    console.log("  スマホのカメラで読み取り:");
    qrcode.generate(netUrl, { small: true });
    console.log(line);
  } catch {
    /* qrcode-terminal 未導入 → URLのみで継続 */
  }
}

// ---- next dev を 0.0.0.0 で起動 ----
function startNext() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(dirname, "..");
  const nextBin = path.join(root, "node_modules", ".bin", "next");
  const child = spawn(nextBin, ["dev", "-H", HOST, "-p", String(PORT)], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
  child.on("error", (err) => {
    console.error("next dev の起動に失敗:", err.message);
    process.exit(1);
  });
  const stop = () => child.kill("SIGINT");
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

await maybeQr();
startNext();
