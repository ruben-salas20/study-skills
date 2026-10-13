// ═══ KIT · flat motion graphics ═══
Object.assign(C, { bg: '#F3EEE4', ink: '#1B1F3B', coral: '#FF5A4E', blue: '#3A6FF7', sun: '#FFC83D', mint: '#2EC4A6', mist: '#E2DACB', white: '#FFFFFF' });
FONTS.display = '"Adwaita Sans", "Noto Sans", ' + FONTS.sans;
// curves with character: back overshoots and comes back, elastic bounces
const ease = {
  back: t => { t = clamp(t, 0, 1); const c = 1.70158; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; },
  elastic: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
  out: eo, io: eio,
};
// 0 → 1 → 0: enters with a bounce at `a`, leaves smoothly before `b` (b = null: stays)
const life = (t, a, b = null, inD = .35, outD = .25) => t < a ? 0 : t < a + inD ? ease.back((t - a) / inD) : b == null || t < b - outD ? 1 : t < b ? 1 - eio((t - (b - outD)) / outD) : 0;
function rrect(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
// flat, long shadow: the same shape, offset, in very transparent ink
function flat(g, pathFn, col, { sh = 14, sa = .13 } = {}) {
  if (sh) { g.save(); g.translate(0, sh); pathFn(g); g.fillStyle = `rgba(27,31,59,${sa})`; g.fill(); g.restore(); }
  pathFn(g); g.fillStyle = col; g.fill();
}
// line that draws itself, with round caps
function lineOn(ctx, pts, u, { col = C.ink, w = 10 } = {}) {
  const q = trimPath(pts, u); if (q.length < 2) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); q.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
}
// entry transition: a colored panel sweeps the screen and leaves in `d` seconds
function wipeIn(ctx, st, col, { d = .4, dir = 1 } = {}) {
  if (st >= d) return; const u = ease.io(st / d);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = col; const x = dir > 0 ? u * W : -u * W; ctx.fillRect(x, 0, W, H); ctx.restore();
}
// kinetic text: each word rises and appears, staggered
function kinetic(ctx, str, x, y, t0, t, { size = 110, col = C.ink, weight = 800, stagger = .07, font = FONTS.display, align = 'center' } = {}) {
  ctx.save(); ctx.font = `${weight} ${size}px ${font}`; const words = str.split(' '), sp = ctx.measureText(' ').width, ws = words.map(w => ctx.measureText(w).width);
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1); let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  words.forEach((w, i) => { const u = clamp((t - t0 - i * stagger) / .35, 0, 1); if (u > 0) { ctx.globalAlpha = eo(u); drawText(ctx, w, cx, y + (1 - ease.back(u)) * size * .5, { size, weight, col, align: 'left', font }); } cx += ws[i] + sp; });
  ctx.restore();
}
