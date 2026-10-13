# Style: pixel art

Hard pixels on an almost black background, on a small grid enlarged without smoothing: the aesthetic of 8- and 16-bit consoles and of pixel-style technical visualizations. It serves algorithms, data and computing: networks, data structures, circuits, anything that gains from a screen feel. Kit: `styles/pixel.js`. Solved example (bubble sort, 11 shots, explanatory and with the animation principles): `styles/examples/pixel.html`.

## FORMAT

```js
w: 640, h: 360, fps: 60, expo: 2,
post: { flicker: 0, grain: 0, vignette: 0, bg: '#06070d' },
ink: [6, 7, 13], light: [232, 238, 255], paper: 0, shadow: null, pixel: true,
```

`pixel: true` makes `w × h` the pixel grid: the player and `record.cjs` enlarge it without smoothing. A 640×360 grid, exported ×3.

## Rhythm

- Shots of 2.5–4.5 s. Music at 120 bpm (a quarter note of 0.5 s, an eighth note of 0.25 s): the main actions fall on that grid; offsets within a group, of 0.1 s.
- Hard cut between shots. If several shots share a set (the same network, the same map), it is baked once and each shot only changes what lights up.
- Things appear pixel by pixel (`reveal` in `pimage`), are drawn (`pline` with `u`) or blink (switching visible/hidden by exposure; an anticipation blink lasts at least 0.25 s, or it doesn't show in the captures).
- `estirar` without rotating the canvas: only on what moves horizontally or vertically, along that axis.

## Color

Background `C.px0` and panels `C.px1`/`C.px2`. Structure dimmed in blues (`C.pxLine`, `C.pxNode`, `C.pxNodeL`). Two opposing accents, `C.pxMag` (magenta) and `C.pxCyan` (cyan), with their dark versions `C.pxMagD` and `C.pxCyanD` for what has already happened. `C.pxWhite` for the brightest things and `C.pxGold` as a rare third accent. Brightness transitions are done with dithering.

## Material

- Everything in integer coordinates with the kit's primitives: `pset`, `prect`, `pline` (Bresenham, with `dot` for dotted lines and `u` to draw itself), `pcircle`, `pdiamond`, `ppanel`. Only those primitives: `arc`, `stroke` and `drawText` smooth the edges and break the grid.
- Brightness and transparency with Bayer dithering: `dfill` for surfaces and `dglow` for halos.
- Small images with `pimage` (grayscale in blocks). `strokeImage` converts hand-drawn strokes into an n×n image, to draw digits, letters or icons.
- Static things (grids, dimmed connections, labels) are baked into a canvas `mk(W, H)` in `build`; in `draw` only what lights up goes.

## Movement

- `expo: 2` (30 poses per second), without `boil`.
- Fixed camera (`z: 1`); if it moves, it does so in whole pixels (the engine rounds the translation in pixel mode) and with whole-number zoom.
- What travels along a line is a 2×2 white block (`plerp` gives its position) and it leaves the line tinted behind it.

## Text

`ptext(ctx, str, x, y, {col, s, align, u, led, shade})`: 5×7 bitmap font included in the kit, with accents, Ñ, ¿ and ¡; everything comes out in capitals. `s: 1` for labels and `s: 2–3` for titles. A large display is `s: 8, led: true` (grid between pixels). `u` types it letter by letter.

## Sound

- Music: `MUSIC = { bpm: 120, key: 'A', mode: 'minor', prog: [1, 6, 3, 7], inst: { pad: null, bass: 'chipbass', keys: 'chip', lead: 'chip', perc: 'noise' } }`: 8-bit console (pulse wave, triangle bass and noise).
- **Sync**: everything that lights up sounds with `chip` an octave high (notes from `chordAt(MUSIC, t, 6)`), and what appears pixel by pixel, with short bursts of `noise`. What jumps or shifts sounds on takeoff with a `chip` of `triangle` wave, and on landing, with a short low `noise`.
- Ambience `studio`.

## Review

- In a magnified crop, each edge is a hard pixel step.
- Almost black background, structure in muted blues and magenta and cyan accents.
- Shines and halos made with dithering.
- The text uses the 5×7 font and reads in full.
- In captures in sequence, what lights up advances in order (layer by layer, pixel by pixel).
