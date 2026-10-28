import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const publicDir = path.join(process.cwd(), 'public');
fs.mkdirSync(publicDir, { recursive: true });

// 1. Write crisp vector SVG icon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="55%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)" />
  <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="6" />
  <text x="256" y="320" font-family="'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', sans-serif" font-size="250" font-weight="900" fill="#ffffff" text-anchor="middle">汉</text>
  <text x="256" y="438" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="800" fill="#7dd3fc" letter-spacing="6" text-anchor="middle">MANDARIN</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg, 'utf8');

// 2. Pure Node.js PNG generator (creates valid RGBA PNGs with rounded navy/sky gradient & geometric "MP" emblem)
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createIconPng(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const radius = Math.round(size * 0.22);

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0; // filter type 0
    for (let x = 0; x < size; x++) {
      const idx = rowStart + 1 + x * 4;

      // Rounded rect mask
      let inside = true;
      const dx = x < radius ? radius - x : x >= size - radius ? x - (size - radius - 1) : 0;
      const dy = y < radius ? radius - y : y >= size - radius ? y - (size - radius - 1) : 0;
      if (dx > 0 && dy > 0 && dx * dx + dy * dy > radius * radius) {
        inside = false;
      }

      if (!inside) {
        raw[idx] = 0;
        raw[idx + 1] = 0;
        raw[idx + 2] = 0;
        raw[idx + 3] = 0;
        continue;
      }

      // Diagonal gradient (#0284c7 -> #0f172a)
      const t = (x + y) / (2 * size);
      let r = Math.round(2 * (1 - t) + 15 * t);
      let g = Math.round(132 * (1 - t) + 23 * t);
      let b = Math.round(199 * (1 - t) + 42 * t);

      // Inner border highlight
      const pad = Math.round(size * 0.08);
      const bThick = Math.max(2, Math.round(size * 0.015));
      if (
        (x >= pad && x < pad + bThick && y >= pad && y < size - pad) ||
        (x >= size - pad - bThick && x < size - pad && y >= pad && y < size - pad) ||
        (y >= pad && y < pad + bThick && x >= pad && x < size - pad) ||
        (y >= size - pad - bThick && y < size - pad && x >= pad && x < size - pad)
      ) {
        r = 56;
        g = 189;
        b = 248;
      }

      // Stylized "中" (Middle Kingdom / Mandarin) geometric calligraphy emblem in center
      const nx = (x / size - 0.5) * 2; // -1 to 1
      const ny = (y / size - 0.5) * 2;
      const stroke = 0.085;

      const inVerticalCenter = Math.abs(nx) < stroke && Math.abs(ny) < 0.58;
      const inBoxTop = Math.abs(ny + 0.25) < stroke * 0.85 && Math.abs(nx) < 0.44;
      const inBoxBottom = Math.abs(ny - 0.18) < stroke * 0.85 && Math.abs(nx) < 0.44;
      const inBoxLeft = Math.abs(nx + 0.40) < stroke * 0.85 && ny >= -0.32 && ny <= 0.25;
      const inBoxRight = Math.abs(nx - 0.40) < stroke * 0.85 && ny >= -0.32 && ny <= 0.25;

      if (inVerticalCenter || inBoxTop || inBoxBottom || inBoxLeft || inBoxRight) {
        r = 255;
        g = 255;
        b = 255;
      }

      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createIconPng(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createIconPng(512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createIconPng(180));
console.log('Generated public/icon.svg, icon-192.png, icon-512.png, apple-touch-icon.png');
