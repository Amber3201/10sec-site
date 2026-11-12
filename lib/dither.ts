// Pixel / dither engine shared by every canvas on the site.
// Everything is drawn at low resolution (one canvas pixel = one "cell") and scaled up with
// image-rendering: pixelated, so it stays crisp and cheap.

export type RGB = [number, number, number];
export const K: RGB = [10, 10, 10];
export const Y: RGB = [255, 214, 10];
export const B: RGB = [243, 240, 232];
export const C: RGB = [45, 91, 255];

// 8x8 ordered (Bayer) dither matrix, values 0..63
export const BAYER: number[] = (() => {
  let m = [[0]];
  for (let k = 0; k < 3; k++) {
    const n = m.length;
    const r: number[][] = [];
    for (let y = 0; y < n * 2; y++) {
      r.push([]);
      for (let x = 0; x < n * 2; x++) {
        const add = y < n ? (x < n ? 0 : 2) : x < n ? 3 : 1;
        r[y].push(m[y % n][x % n] * 4 + add);
      }
    }
    m = r;
  }
  return m.flat();
})();

export const threshold = (x: number, y: number) => (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;

export function hash(x: number, y: number, s: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
export const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ---------- abstract fields: brightness 0..1; 3 = accent pixel (fg2), 4 = second accent (fg3) ----------
export type FieldName = 'sphere' | 'windows' | 'ripple' | 'lens' | 'bars' | 'grid';
type Field = (u: number, v: number, p: number, asp: number) => number;

const sphere: Field = (u, v, p, asp) => {
  const X = (u - 0.5) * asp, Yv = v - 0.5, R = 0.4 * Math.min(asp, 1);
  const ang = 0.5 + p * 2.4;
  let lx = Math.cos(ang) * 0.75, ly = -0.45, lz = 0.55;
  const ln = Math.hypot(lx, ly, lz); lx /= ln; ly /= ln; lz /= ln;
  const dx = X / R, dy = Yv / R, dd = dx * dx + dy * dy;
  if (dd < 1) return 0.05 + Math.max(0, dx * lx + dy * ly + Math.sqrt(1 - dd) * lz) * 0.95;
  return 0.16 * Math.exp(-(Math.sqrt(dd) - 1) * 6);
};

// Website design: stacked browser windows that fan out as you scroll, on a blueprint grid
const windows: Field = (u, v, p, asp) => {
  const X = (u - 0.5) * asp, Yv = v - 0.5;
  const spread = 0.045 + 0.11 * p, hw = 0.3 * Math.min(asp, 1.25), hh = 0.21;
  for (let k = 2; k >= 0; k--) {
    const ox = (k - 1) * spread, oy = (1 - k) * spread * 0.8;
    const lx = (X - ox + hw) / (2 * hw), ly = (Yv - oy + hh) / (2 * hh);
    if (lx < 0 || lx > 1 || ly < 0 || ly > 1) continue;
    const depth = k === 2 ? 1 : k === 1 ? 0.55 : 0.32;
    let b = 0.05;
    if (lx < 0.012 || lx > 0.988 || ly < 0.018 || ly > 0.982) b = 0.95;
    else if (ly < 0.13) {
      if (k === 2 && ly > 0.045 && ly < 0.095 && ((lx > 0.03 && lx < 0.05) || (lx > 0.065 && lx < 0.085) || (lx > 0.1 && lx < 0.12))) return 3;
      b = 0.5;
    } else if (ly > 0.2 && ly < 0.46 && lx > 0.06 && lx < 0.58) b = 0.42;
    else if ((ly > 0.53 && ly < 0.57 && lx > 0.06 && lx < 0.52) || (ly > 0.61 && ly < 0.65 && lx > 0.06 && lx < 0.44) || (ly > 0.69 && ly < 0.73 && lx > 0.06 && lx < 0.48)) b = 0.8;
    else if (lx > 0.64 && lx < 0.94 && ly > 0.2 && ly < 0.73) b = 0.12 + 0.55 * (1 - (ly - 0.2) / 0.53);
    else if (ly > 0.8 && ly < 0.9 && lx > 0.06 && lx < 0.26) { if (k === 2) return 3; b = 0.9; }
    return b * depth;
  }
  const gx = X * 10 - Math.floor(X * 10), gy = Yv * 10 - Math.floor(Yv * 10);
  return gx < 0.04 || gy < 0.04 ? 0.1 : 0;
};

// Social: pulses spreading from a pixel heart
const ripple: Field = (u, v, p, asp) => {
  const X = (u - 0.5) * asp, Yv = v - 0.5, d = Math.sqrt(X * X + Yv * Yv);
  const hx = X * 3.6, hy = -Yv * 3.6 + 0.3, q = hx * hx + hy * hy - 1;
  if (q * q * q - hx * hx * hy * hy * hy < 0) return 3;
  let b = (0.5 + 0.5 * Math.cos(d * 46 - p * 16)) * Math.exp(-d * 2.4) * 0.95;
  const pts = [[-0.3, -0.24], [0.32, 0.22], [0.26, -0.3]];
  for (let i = 0; i < 3; i++) {
    const ex = X - pts[i][0] * Math.min(asp, 1.4), ey = Yv - pts[i][1], e = Math.sqrt(ex * ex + ey * ey);
    if (e < 0.022) return 3;
    b += 0.55 * (0.5 + 0.5 * Math.cos(e * 70 - p * 22 - i)) * Math.exp(-e * 11);
  }
  return b;
};

// SEO/AEO: a magnifying glass (search) holding an AI sparkle, with pulses and other sources around it
const lens: Field = (u, v, p, asp) => {
  const X = (u - 0.5) * asp, Yv = v - 0.5;
  const cx = -0.05, cy = -0.05, R = 0.17, t = 0.05;
  const dx = X - cx, dy = Yv - cy, d = Math.sqrt(dx * dx + dy * dy);
  if (Math.abs(d - R) < t / 2) return 3;
  const hx0 = cx + (R + t / 2) * 0.7071, hy0 = cy + (R + t / 2) * 0.7071;
  const qx = X - hx0, qy = Yv - hy0, along = (qx + qy) * 0.7071, across = (qx - qy) * 0.7071;
  if (along > -0.01 && along < 0.17 && Math.abs(across) < 0.035) return 3;
  if (d < R - t / 2) {
    const sz = 0.07 + 0.04 * p;
    if (Math.pow(Math.abs(dx), 2 / 3) + Math.pow(Math.abs(dy), 2 / 3) < Math.pow(sz, 2 / 3)) return 4;
    if (Math.pow(Math.abs(dx - 0.075), 2 / 3) + Math.pow(Math.abs(dy + 0.07), 2 / 3) < Math.pow(0.028, 2 / 3)) return 4;
    return 0.02;
  }
  let b = (0.5 + 0.5 * Math.cos(d * 44 - p * 16)) * Math.exp(-d * 2.6) * 0.9;
  const pts = [[-0.3, 0.22], [0.3, -0.28], [-0.26, -0.3]];
  for (let i = 0; i < 3; i++) {
    const ex = X - pts[i][0] * Math.min(asp, 1.4), ey = Yv - pts[i][1], e = Math.sqrt(ex * ex + ey * ey);
    if (e < 0.022) return 3;
    b += 0.5 * (0.5 + 0.5 * Math.cos(e * 70 - p * 22 - i)) * Math.exp(-e * 11);
  }
  return b;
};

// Rising bars (growth)
const bars: Field = (u, v, p) => {
  const n = 9, idx = Math.floor(u * n), f = u * n - idx;
  if (f < 0.18 || f > 0.82) return 0.02;
  const h = (0.12 + 0.075 * idx) * (0.35 + 0.65 * p);
  const top = 0.92 - h;
  if (v > top && v < 0.92) {
    if (idx === n - 1 && v < top + 0.04) return 3;
    return 0.35 + 0.55 * (1 - (v - top) / Math.max(h, 0.01));
  }
  if (Math.abs(v - 0.94) < 0.006) return 0.7;
  return 0.02;
};

// Dot grid (schedule / structure)
const grid: Field = (u, v, p, asp) => {
  const gx = u * 7, gy = (v * 7) / asp, fx = gx - Math.floor(gx) - 0.5, fy = gy - Math.floor(gy) - 0.5;
  const cx = Math.floor(gx), cy = Math.floor(gy);
  const rad = 0.08 + 0.3 * clamp(p * 1.4 - hash(cx, cy, 2) * 0.6);
  if (cx === 4 && cy === 2 && fx * fx + fy * fy < 0.16) return 3;
  return fx * fx + fy * fy < rad * rad ? 0.9 : 0.03;
};

export const FIELDS: Record<FieldName, Field> = { sphere, windows, ripple, lens, bars, grid };

export type FieldOpts = { fn: FieldName; fg: RGB; fg2?: RGB; fg3?: RGB; bg?: RGB; pix?: boolean };

export function renderField(img: ImageData, o: FieldOpts, prog: number) {
  const cols = img.width, rows = img.height, d = img.data, fn = FIELDS[o.fn];
  const f = o.pix ? 1 + Math.floor(prog * 5) : 1, fade = o.pix ? 1 - 0.7 * prog : 1;
  const asp = cols / rows, fg2 = o.fg2 || o.fg, fg3 = o.fg3 || fg2;
  for (let y = 0; y < rows; y++) {
    const by = Math.floor(y / f), v = (by * f + f / 2) / rows;
    for (let x = 0; x < cols; x++) {
      const bx = Math.floor(x / f), u = (bx * f + f / 2) / cols;
      let b = fn(u, v, prog, asp);
      let col = o.fg;
      if (b >= 4) { col = fg3; b = 1; } else if (b >= 2) { col = fg2; b = 1; } else b *= fade;
      const i = (y * cols + x) * 4;
      if (b > threshold(bx, by)) { d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255; }
      else if (o.bg) { d[i] = o.bg[0]; d[i + 1] = o.bg[1]; d[i + 2] = o.bg[2]; d[i + 3] = 255; }
      else d[i + 3] = 0;
    }
  }
}

// DitherSeam: the edge between two section colors slides as it moves through the viewport
export function renderSeam(img: ImageData, a: RGB, b: RGB, prog: number) {
  const cols = img.width, rows = img.height, d = img.data, shift = (prog - 0.5) * 0.9;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = (y + 0.5) / rows + shift + 0.05 * Math.sin(x * 0.13 + prog * 6) + (hash(x, y, 1) - 0.5) * 0.12;
      const col = v > threshold(x, y) ? b : a;
      const i = (y * cols + x) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
  }
}

// Turn any image into the 10sec brand dither (yellow on black). Used by the blog editor.
export function ditherImageData(src: ImageData) {
  const d = src.data, cols = src.width;
  for (let i = 0; i < d.length; i += 4) {
    const p = i / 4, x = p % cols, y = Math.floor(p / cols);
    let L = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    L = clamp((L - 0.1) * 1.3);
    const on = L > threshold(x, y);
    d[i] = on ? Y[0] : K[0]; d[i + 1] = on ? Y[1] : K[1]; d[i + 2] = on ? Y[2] : K[2]; d[i + 3] = 255;
  }
  return src;
}

// ---------- PixelLogo: boxy 8-bit "10SEC", 6x7 cells per glyph ----------
export type LogoPixel = { x: number; y: number; w: boolean; sx: number; sy: number; d: number };
export const LOGO_COLS = 38;
export const LOGO: LogoPixel[] = (() => {
  const G: Record<string, string[]> = {
    '1': ['..##..', '.###..', '..##..', '..##..', '..##..', '..##..', '.####.'],
    '0': ['######', '##..##', '##..##', '##..##', '##..##', '##..##', '######'],
    S: ['######', '##....', '##....', '######', '....##', '....##', '######'],
    E: ['######', '##....', '##....', '#####.', '##....', '##....', '######'],
    C: ['######', '##....', '##....', '##....', '##....', '##....', '######'],
  };
  const out: LogoPixel[] = [];
  '10SEC'.split('').forEach((ch, i) => {
    G[ch].forEach((row, y) => {
      row.split('').forEach((p, x) => {
        if (p !== '#') return;
        const n = out.length;
        // deterministic "random" start positions so server and client render the same
        out.push({ x: i * 7 + x, y, w: i >= 2, sx: i * 7 + x + (hash(n, 1, 9) * 16 - 8), sy: y - 6 - hash(n, 2, 9) * 10, d: hash(n, 3, 9) * 0.45 });
      });
    });
  });
  return out;
})();
