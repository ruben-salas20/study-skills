// ═══ KIT · pixel art ═══
// The world is the pixel grid (FORMAT.w × FORMAT.h, e.g. 640×360) and everything is painted in integer coordinates.
Object.assign(C, { px0: '#06070d', px1: '#0d1020', px2: '#1a2138', pxLine: '#27305a', pxNode: '#3a4775', pxNodeL: '#6b7cb8', pxWhite: '#e8eeff', pxMag: '#ff2e6e', pxMagD: '#8a1640', pxCyan: '#38c8ff', pxCyanD: '#155c86', pxGold: '#ffc94a' });

// ── primitives: no antialiasing; each pixel is a 1×1 fillRect at integer coordinates ──
const pset = (ctx, x, y, col) => { ctx.fillStyle = col; ctx.fillRect(x | 0, y | 0, 1, 1); };
function prect(ctx, x, y, w, h, col, fill = true) {
  x |= 0; y |= 0; w |= 0; h |= 0; ctx.fillStyle = col;
  if (fill) ctx.fillRect(x, y, w, h); else { ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1); ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h); }
}
// Bresenham line; `dot` > 1 paints one pixel every `dot` (dotted lines); `u` < 1 cuts it short (line being drawn)
function pline(ctx, x0, y0, x1, y1, col, { dot = 1, u = 1, phase = 0 } = {}) {
  x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0; ctx.fillStyle = col;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, n = Math.max(dx, -dy), stop = Math.round(n * clamp(u, 0, 1));
  let err = dx + dy, i = 0;
  while (i <= stop) {
    if ((i + phase) % dot === 0) ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } i++;
  }
}
// point on the line at fraction u, in whole pixels (for pulses that travel along a connection)
const plerp = (x0, y0, x1, y1, u) => [Math.round(lerp(x0, x1, u)), Math.round(lerp(y0, y1, u))];
// midpoint circle: outline or fill
function pcircle(ctx, cx, cy, r, col, fill = false) {
  cx |= 0; cy |= 0; ctx.fillStyle = col; let x = r, y = 0, d = 1 - r;
  while (x >= y) {
    if (fill) { ctx.fillRect(cx - x, cy + y, 2 * x + 1, 1); ctx.fillRect(cx - x, cy - y, 2 * x + 1, 1); ctx.fillRect(cx - y, cy + x, 2 * y + 1, 1); ctx.fillRect(cx - y, cy - x, 2 * y + 1, 1); }
    else for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) ctx.fillRect(cx + a, cy + b, 1, 1);
    y++; if (d < 0) d += 2 * y + 1; else { x--; d += 2 * (y - x) + 1; }
  }
}
// diamond (marker)
function pdiamond(ctx, cx, cy, r, col, fill = false) { cx |= 0; cy |= 0; ctx.fillStyle = col; for (let k = -r; k <= r; k++) { const w = r - Math.abs(k); if (fill) ctx.fillRect(cx - w, cy + k, 2 * w + 1, 1); else { ctx.fillRect(cx - w, cy + k, 1, 1); ctx.fillRect(cx + w, cy + k, 1, 1); } } }

// ── ordered dithering (Bayer 4×4): the only way to get "transparency" and gradients in pixel art ──
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];
function dfill(ctx, x, y, w, h, col, a) { if (a <= 0) return; ctx.fillStyle = col; for (let j = y | 0; j < (y + h) | 0; j++) for (let i = x | 0; i < (x + w) | 0; i++) if (bayer(i, j) < a) ctx.fillRect(i, j, 1, 1); }
// dithered halo: a disc that fades outward (glow of a lit node)
function dglow(ctx, cx, cy, r, col, a = 1) { if (a <= 0) return; cx |= 0; cy |= 0; ctx.fillStyle = col; for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const d = Math.hypot(i, j) / r; if (d <= 1 && bayer(cx + i, cy + j) < a * (1 - d) * (1 - d)) ctx.fillRect(cx + i, cy + j, 1, 1); } }

// ── 5×7 bitmap font (capitals, digits, accents and signs); lowercase is written in capitals ──
const FONT57 = (() => {
  const G = {
    "0": '0E11131519110E',
    "1": '040C040404040E',
    "2": '0E11010204081F',
    "3": '1F02040201110E',
    "4": '02060A121F0202',
    "5": '1F101E0101110E',
    "6": '0608101E11110E',
    "7": '1F010204080808',
    "8": '0E11110E11110E',
    "9": '0E11110F01020C',
    "A": '0E1111111F1111',
    "B": '1E11111E11111E',
    "C": '0E11101010110E',
    "D": '1C12111111121C',
    "E": '1F10101E10101F',
    "F": '1F10101E101010',
    "G": '0E11101711110F',
    "H": '1111111F111111',
    "I": '0E04040404040E',
    "J": '0702020202120C',
    "K": '11121418141211',
    "L": '1010101010101F',
    "M": '111B1515111111',
    "N": '11111915131111',
    "O": '0E11111111110E',
    "P": '1E11111E101010',
    "Q": '0E11111115120D',
    "R": '1E11111E141211',
    "S": '0F10100E01011E',
    "T": '1F040404040404',
    "U": '1111111111110E',
    "V": '11111111110A04',
    "W": '1111111515150A',
    "X": '11110A040A1111',
    "Y": '1111110A040404',
    "Z": '1F01020408101F',
    "Á": '02040E111F1111',
    "É": '02041F101E101F',
    "Í": '02040E0404040E',
    "Ó": '02040E1111110E',
    "Ú": '0204111111110E',
    "Ñ": '0D121119151311',
    "Ü": '0A00111111110E',
    " ": '00000000000000',
    ".": '00000000000C0C',
    ",": '000000000C0408',
    ":": '000C0C000C0C00',
    ";": '000C0C000C0408',
    "-": '0000001F000000',
    "+": '0004041F040400',
    "?": '0E110102040004',
    "¿": '0400040810110E',
    "!": '04040404040004',
    "¡": '04000404040404',
    "%": '18190204081303',
    "/": '00010204081000',
    "(": '02040808080402',
    ")": '08040202020408',
    "·": '00000004000000',
    "'": '04040800000000',
    "\"": '0A0A0000000000',
    "=": '00001F001F0000',
    "<": '02040810080402',
    ">": '08040201020408',
    "#": '0A0A1F0A1F0A0A',
    "_": '0000000000001F',
    "*": '00150E1F0E1500',
  };
  const out = {}; for (const k in G) { const h = G[k]; out[k] = []; for (let r = 0; r < 7; r++) out[k].push(parseInt(h.slice(r * 2, r * 2 + 2), 16)); }
  return out;
})();
// width in pixels of a text at scale s (each letter takes 5 + 1 of space)
const ptextW = (str, s = 1, gap = 1) => Math.max(0, String(str).length * (5 + gap) - gap) * s;
// pixel text: whole-number scale; `led` leaves a dark grid between pixels (display), `shade` lightens the top row
// Capitals with accents, Ñ and Ü: the whole letter and the mark on two rows above the line (rows −2 and −1).
const SIGNOS57 = { 'Á': ['A', 0x02, 0x04], 'É': ['E', 0x02, 0x04], 'Í': ['I', 0x02, 0x04], 'Ó': ['O', 0x02, 0x04], 'Ú': ['U', 0x02, 0x04], 'Ñ': ['N', 0x0D, 0x12], 'Ü': ['U', 0x00, 0x0A] };
function ptext(ctx, str, x, y, { col = C.pxWhite, s = 1, align = 'left', gap = 1, u = 1, led = false, shade = null, shadow = null } = {}) {
  str = String(str).toUpperCase(); const n = Math.ceil(str.length * clamp(u, 0, 1)), w = ptextW(str, s, gap);
  let X = (align === 'center' ? x - w / 2 : align === 'right' ? x - w : x) | 0; y |= 0;
  const blk = led && s > 2 ? s - 1 : s;
  for (let c = 0; c < n; c++) {
    const sg = SIGNOS57[str[c]], g = sg ? [sg[1], sg[2], ...FONT57[sg[0]]] : FONT57[str[c]] || FONT57['?'], r0 = sg ? -2 : 0;
    for (let i = 0; i < g.length; i++) for (let b = 0; b < 5; b++) if (g[i] >> (4 - b) & 1) {
      const r = i + r0;
      if (shadow) { ctx.fillStyle = shadow; ctx.fillRect(X + b * s + s, y + r * s + s, blk, blk); }
      ctx.fillStyle = shade && r === 0 ? shade : col; ctx.fillRect(X + b * s, y + r * s, blk, blk);
      if (led && s > 3) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(X + b * s, y + r * s, 1, 1); }
    }
    X += (5 + gap) * s;
  }
  return w;
}
// panel frame: 1 px border with clipped corners
function ppanel(ctx, x, y, w, h, { col = C.pxLine, bg = C.px1 } = {}) { prect(ctx, x + 1, y + 1, w - 2, h - 2, bg); ctx.fillStyle = col; ctx.fillRect(x + 1, y, w - 2, 1); ctx.fillRect(x + 1, y + h - 1, w - 2, 1); ctx.fillRect(x, y + 1, 1, h - 2); ctx.fillRect(x + w - 1, y + 1, 1, h - 2); }
// grayscale image (0–1 array, side n) drawn in s×s blocks, with a color for each level
function pimage(ctx, img, n, x, y, s, { ramp = [C.px1, '#3a4260', '#8a93b8', C.pxWhite], reveal = 1, seed = 1 } = {}) {
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const v = img[j * n + i]; if (v < .05 || hash(i, j, seed) > reveal) continue;
    ctx.fillStyle = ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))]; ctx.fillRect(x + i * s, y + j * s, s, s);
  }
}
// stroke raster: draws polylines (0–1 coordinates) with a round brush into an n×n 0–1 image; this is how digits are "handwritten"
function strokeImage(n, strokes, { r = .085, seed = 1 } = {}) {
  const img = new Float32Array(n * n);
  for (const pts of strokes) for (let k = 1; k < pts.length; k++) {
    const [ax, ay] = pts[k - 1], [bx, by] = pts[k];
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const px = (i + .5) / n, py = (j + .5) / n, vx = bx - ax, vy = by - ay, L = vx * vx + vy * vy || 1e-9, t = clamp(((px - ax) * vx + (py - ay) * vy) / L, 0, 1);
      const d = Math.hypot(px - ax - vx * t, py - ay - vy * t), rr = r * (.85 + .3 * hash(k, seed, 5)), v = clamp((rr - d) / (rr * .45), 0, 1);
      img[j * n + i] = Math.max(img[j * n + i], v);
    }
  }
  return img;
}
