# Engine: contract for one shot

`engine.html` includes everything that does not change between videos: utilities, textures, sprites, text, physics, synthesizer, voice, clock, camera, post-processing, interface and capture hooks. You write the `FORMAT` block (at the very top) and the `YOUR FILM` section, which starts with the style's kit pasted between `KIT-START` and `KIT-END`. Each style has its solved example in `styles/examples/<style>.html`.

## Format

The `FORMAT` block sets size, frame rate and final look. `W`, `H`, `FPS` and `EXPO` come from it. The style says what to put in `expo`, `post`, `ink`, `light`, `paper`, `shadow` (default shadow for sprites; `null` for none) and `pixel`. The video is 16:9: a 2560 × 1440 world (or the pixel grid, below), exported at 1920 × 1080. `safe` is left at `null`. `poster` is the second that is shown before you press play: pick one where the idea is already visible.

With `pixel: true`, `w × h` is a small pixel grid (640 × 360) that the player and `record.cjs` scale up without smoothing, and `setCam` rounds the translation to whole pixels (`styles/pixel.md`).

The duration is not written anywhere: it is the sum of the shots' `dur`. At startup the engine computes `DUR` (seconds) and `NF` (frames), the player's shot bar and the final sound fade-out (0.45 s).

## Clock

Each shot sees four times:

| Name | What it is | What it is for |
|---|---|---|
| `st` | seconds since the start of the shot, continuous | physics in `step`, camera in `cam` |
| `sf` | whole frame since the start of the shot | exact events: `if (sf === 75)` |
| `sq` | `st` rounded to the exposure (`EXPO` frames) | any animation computed in `draw` |
| `e` | global exposure index | seed for `boil` |

With `expo: 1`, `sq` equals `st` and there is no held pose.

## Shot interface

```js
const S1 = {
  name: 'Cup', dur: 2.5,            // the engine computes t0 and t1, in SHOTS order
  cam(st) { return { x, y, z }; },  // frame center in world coordinates and zoom; smooth, no jumps
  build() {},                      // once on load: bakes backgrounds (backdrop/mk) and puppets (sprite)
  reset() {},                      // deterministic initial state (this.R = rng(seed)); pre-runs the physics with negative st and ends in this.snap()
  step(dt, st, sf) {},             // physics and logic only; emit({...}) for sounds that come from the physics
  snap() {},                       // copies the live state to the r* fields (rx, ry, rth...) the camera will see
  draw(ctx, st, sq, e, cam) {},    // only reads r* and sq; starts each layer with setCam(ctx, cam, p)
  score() { return []; },          // scheduled sound events, with t in global seconds (this.t0 + local)
  poke(x, y) { return false; },    // viewer click in world coordinates; true if it touched something; plays with sfx({...})
};
SHOTS.push(S1);
```

`this.t0` is already set when `build` and `score` are called. A shot can also have `energy` (0–1), which the music uses. Outside the shots, `function baseScore()` returns the video's ambient sound and music (see Music): replace the empty one that the template includes.

## Hard rules

- **Determinism.** `reset`, `step` and `draw` use only `rng(seed)`, `hash` and `noise`. `Math.random` is allowed only inside `poke`. Jumping to any frame or exporting must always give the same image.
- `draw` does not change state. Everything that moves is read from the snapshot (`r*`).
- Static and costly things (textures, noise, many pieces) are baked in `build`; a few flat shapes are faster to draw live. If a shot plays choppily, measure `__film.time()` in the browser console (one full frame; reference: 2 to 22 ms): above 25 ms, bake more of it and draw less live.
- If there is physics, the world is already alive at frame 0 of each shot: `reset` pre-runs between 60 and 150 steps.

## Shortcuts

- `lapse(t, a, d)`: from 0 to 1 while `t` goes from `a` to `a + d`; it is the `u` of almost everything that is drawn, grows or appears.
- `onFrame(T, ev)`: true on the exact frame of event `ev`; used in `step` to give impulses to springs or release particles.
- `popIn(u)`: appearance scale with a bounce (0 → 1.12 → 1).
- `llegar(u, s)`: from 0 to 1, starting smoothly; at 75% of `u` it has overshot by `s` (0.08 by default), and at the end it returns to 1. For everything that goes from one place to another.
- `arco(a, b, u, h)`: the point `[x, y]` that goes from `a` to `b` along a curve that moves `h` away from the straight line at the middle, in either direction: upward if it goes right, leftward if it rises; with negative `h`, to the other side.
- `estirar(k)`: `[width, height]` to scale without changing the area; `k > 1` stretches vertically and `k < 1` squashes. For another direction, first rotate the canvas to the movement angle minus 90°.
- `keyframes([[t, v], …], t)`: interpolated value between keys; useful for paths with pauses (a needle that advances slowly and then jumps).
- `camPath([x, y, z], [x, y, z], dur, ease)`: returns the `cam` of a shot that goes from one framing to another.

## Shared set

When several shots take place in the same spot (the thread of an explainer, a board that gradually fills up, a network that lights up), the set is an object that lives in **global time** `T = t0 + st`: what is drawn in one shot stays there in the next, and cuts only change the camera and what happens.

```js
const HILO = {
  build() {},                      // bakes once for all shots
  reset(T0) {}, step(T, dt) {}, snap() {},
  draw(ctx, cam, T, e) {},         // global T: lapse(T, 7.8, .3) works the same in any shot
};
SHOTS.push(
  sharedShot(HILO, { name: 'P', dur: 2.5, energy: .4, cam: camPath([1280, 720, 1.2], [1300, 720, 1.25], 2.5), score: t0 => [{ t: t0 + .3125, k: 'thump' }] }),
  sharedShot(HILO, { name: 'QRS', dur: 2.5, energy: .5, cam: camPath([1300, 730, 1.16], [1320, 730, 1.22], 2.5) }),
);
```

`sharedShot(set, o)` builds the shot: it bakes the set only once and passes it the global time. Each shot's `score` receives its `t0`: write each event as `t0 + seconds inside the shot`, as in the example.

## Toolbox

- Curves and time: `clamp`, `lerp`, `inv(a,b,x)`, `smooth(a,b,x)`, `eio`, `eo`, `esine`; randomness `rng(seed)`, `hash(a,b,c)`; noise `noise(x,y)`, `fbm`, `curl(x,y,t,sc)`.
- Color: `C` (palette; a style changes it with `Object.assign(C, {...})`), `tone(hex, k, alpha)`.
- Strokes: `trimPath(pts, u)` (the first fraction `u` of a polyline, for lines that draw themselves), `cutPath(g, pts, {amp, step, seed})`, `blobPath(g, cx, cy, rx, ry, {amp, seed, rot})`, `curvePath(g, pts, closed)`, `hatch(g, x, y, w, h, {gap, ang, col, a, wob})`, `stipple(g, x, y, w, h, {n, col, r0, r1, a, dens})`, `withClip(g, pathFn, fn)`, `paperize(g, k)`.
- Text: `drawText(g, str, x, y, {size, font, weight, style, col, align, base, maxW, lh, track, stroke, sw})` draws and returns the box `{x, y, w, h, lines}`; it breaks lines with `maxW` and with `\n`. `FONTS.serif`, `FONTS.sans` and `FONTS.mono` are system fonts. A custom font is embedded as `@font-face` with `src: url(data:font/woff2;base64,...)` in the `<style>`, and used by its name; startup waits for `document.fonts.ready`. To give the text the style's material, draw it inside a `sprite()`.
- Canvases: `mk(w, h)`, `g2(canvas)`, `backdrop(w, h, {grad, vstreak, hstreak, mottle, scratches, light, glow, dark, seed})`, which is drawn at `(-128, -72)` with size `W+256 × H+144`.
- Cutouts: `sprite(w, h, ax, ay, draw, {ss, pad, shadow, paper})`. The drawing works in a `w×h` box with its origin at the top left; `(ax, ay)` is the anchor (feet, pivot). `shadow: null` and `paper: 0` give a flat figure. It is placed with `put(ctx, sp, x, y, rot, sc, {flip, sy, alpha, shadow})`.
- Physics: `new Rope(pts, {grav, damp, iters, slack})` with `pin[i]`, `ax/ay` as forces, `step(dt)`, `snap()`, `at(u)`. For things that fall gliding: `newPetal(R, x, y, {vx, vy, col, size, An})`, `petalStep(p, dt, wx, wy)`, `drawPetals(ctx, list, e)`. For the gust the viewer makes: `gustAt(x, y)`.
- Pose: `boil(id, e, amt)` returns `[dx, dy, drot]`.
- Async kit loading: if the kit defines `const KIT_READY = <promise>`, startup waits for it after the fonts and before `build()` (`3b1b` uses it for MathJax).
- Sound: events `{t, k, ...}` with `t` in global seconds; all accept `v` (volume) and `pan` (−1 to 1). The types of `k`:

| Family | `k` (parameters) |
|---|---|
| Notes | `mb` music box, `piano`, `marimba`, `synth` (`bright`), `blip` (`dur`), `chip` (`dur`, `wave`: `pulse`, `square`, `triangle`), `pluck` (string, `f`): all with `n: 'G5'` or `f` in Hz |
| Chords and basses | `chord` (`ns`, `strum`), `strings` (`n` or `ns`, `dur`), `bass` (`n`), `chipbass` (`n`) |
| Knocks and scrapes | `tick`, `click`, `thump`, `pop` (`f`), `clink` (ceramic), `creak` (creak), `bloom` (bud), `noise` (`dur`, `hz`) |
| Material | `rustle` (paper), `cloth` (cloth), `chalk` (chalk, `dur`), `whoosh` (gust: `dur`, `p0`, `p1`, `f0`, `f1`), `flap` (flutter), `chirp` (chirp) |
| Ambient | `bed` (`kind`: `room`, `street`, `field`, `stage`, `studio`, `lab`, `soft`; `dur`) |

## Music

The background music is written by `compose(MUSIC)`, which returns the events for the whole video; it goes in `baseScore()` next to the ambient sound:

```js
const MUSIC = { bpm: 96, key: 'C', mode: 'major', prog: [1, 6, 4, 5], inst: { pad: 'strings', bass: 'bass', keys: 'marimba', lead: 'piano', perc: null }, seed: 7 };
function baseScore() { return [{ t: 0, k: 'bed', kind: 'room', dur: DUR }, ...compose(MUSIC)]; }
```

- `key` and `mode` (`major` or `minor`) set the key; `prog` are the progression's degrees, one chord per bar, looping. `seed` changes the melody. `v` (1 by default) raises or lowers all the music, and `tail` (2.2 s) is the length of the final chord's tail.
- `inst` assigns an instrument to each layer, or `null` to remove it: `pad` (`strings`, `synth` or `chip`), `bass` (`bass` or `chipbass`), `keys` and `lead` (`piano`, `marimba`, `mb`, `synth`, `blip`, `pluck` or `chip`) and `perc` (`tick`, `click` or `noise`). The layers are already balanced with each other and with the effects.
- The **energy** of each shot (`energy`, from 0 to 1, in the shot object; `.5` if missing) decides what plays in each bar: always the background and the bass; from `.3`, an arpeggio in quarter notes; from `.55`, the melody; from `.6`, the arpeggio moves to eighth notes; and from `.7`, the pulse. A calm hook goes at `.25`, the steps between `.4` and `.6`, and the climax at `.7` or more.
- The ending is automatic: half a bar of dominant (V) and the tonic (I) in all layers, `tail` seconds before the end.
- With voice, the music drops to less than half while each clip plays.
- An accent in a shot (a note that marks an event) uses `chordAt(MUSIC, t)`, which gives the notes of the chord playing at global second `t`, so it stays in tune.
- The effects (chalk, `tick`, `pop`, `whoosh`…) and the accents go in each shot's `score()`.

## Sync

The sound rule for all styles: **every visible event sounds at that same instant**. An event is anything the eye registers as a moment: something appears, is dropped, lands, is traced, lights up or suddenly changes. Scheduled events sound from `score()`; those produced by physics (a bounce, a petal touching the ground) sound with `emit()` inside `step`. Each style says what sounds each kind of event.

## Voice

Narration (only if the user asks for it) is in `voice.md`: how it is embedded, how the shots are fitted and how the music lowers.

## Capture hooks

`window.__film.seek(f)`, `.time()`, `.wav()` and `.info()`; the globals `W`, `H`, `FPS`, `DUR` and `NF`. URL parameters: `?frame=N`, `?t=s`, `?ui=0` (no controls) and `?smooth=1` (no held pose). The review and `record.cjs` use them.
