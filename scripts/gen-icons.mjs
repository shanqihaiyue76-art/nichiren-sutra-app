#!/usr/bin/env node
/**
 * PWA/ホーム画面アイコンを生成する（依存ライブラリなし・再生成可能）。
 *
 *  Node 組込みの zlib だけで PNG をエンコードし、アプリのテーマ色
 *  （温かいダーク背景＋金色のリング）で簡素なマンダラ意匠を描く。
 *  4xスーパーサンプリングで縁を滑らかにする。
 *
 *  出力: public/icons/{icon-192,icon-512,icon-maskable-512,apple-touch-icon-180}.png
 *
 * usage:
 *   node scripts/gen-icons.mjs
 */
import zlib from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---- PNG エンコーダ（8bit RGBA） ----
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

// ---- 描画（4xスーパーサンプリング） ----
const BG_TOP = [0x2a, 0x20, 0x18];
const BG_BOT = [0x1a, 0x14, 0x10];
const GOLD = [0xe8, 0xb0, 0x4b];

function render(size, artScale = 1) {
  const ss = 4;
  const W = size, H = size;
  const buf = Buffer.alloc(W * H * 4);
  const cx = W / 2, cy = H / 2, R = W / 2;
  const rOuter = 0.42 * artScale * R;
  const rInner = 0.335 * artScale * R;
  const rDot = 0.125 * artScale * R;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let ar = 0, ag = 0, ab = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const px = x + (sx + 0.5) / ss;
          const py = y + (sy + 0.5) / ss;
          const tv = py / H;
          let cr = BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * tv;
          let cg = BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * tv;
          let cb = BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * tv;
          const d = Math.hypot(px - cx, py - cy);
          if ((d <= rOuter && d >= rInner) || d <= rDot) {
            cr = GOLD[0]; cg = GOLD[1]; cb = GOLD[2];
          }
          ar += cr; ag += cg; ab += cb;
        }
      }
      const n = ss * ss, i = (y * W + x) * 4;
      buf[i] = Math.round(ar / n);
      buf[i + 1] = Math.round(ag / n);
      buf[i + 2] = Math.round(ab / n);
      buf[i + 3] = 255;
    }
  }
  return encodePng(W, H, buf);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "icons");
mkdirSync(dir, { recursive: true });

const targets = [
  ["icon-192.png", 192, 1],
  ["icon-512.png", 512, 1],
  ["icon-maskable-512.png", 512, 0.8], // マスカブル安全領域(中央80%)に収める
  ["apple-touch-icon-180.png", 180, 1],
];
for (const [name, size, scale] of targets) {
  const png = render(size, scale);
  writeFileSync(path.join(dir, name), png);
  console.log(`  [icon] public/icons/${name}  (${size}x${size}, ${png.length}B)`);
}
console.log("done.");
