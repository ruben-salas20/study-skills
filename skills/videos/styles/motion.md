# Style: flat motion graphics

Clean vector, flat colors and fluid motion with bounce. It is the style of animated infographics: it reads fast, it understands itself in silence and it holds a lot of text. It serves biology, medicine, processes and history. Kit: `styles/motion.js` (paste it between `KIT-START` and `KIT-END`). Solved example (insulin and glucose, explanatory and with the animation principles): `styles/examples/motion.html`.

## FORMAT

```js
expo: 1, post: { flicker: 0, grain: 0, vignette: 0, bg: '#F3EEE4' },
ink: [27, 31, 59], light: [255, 255, 255], paper: 0, shadow: null,
```

## Rhythm

- Shots of 2.5–4.5 s. Events fall on the grid of the style's `MUSIC`: at 110 bpm, an eighth note lasts 0.27 s.
- Between shots: a hard cut or a `wipeIn` (a panel of color sweeps the screen in 0.35–0.4 s).
- Everything comes in with a bounce: `popIn` as a scale, or `life()` if it also has to leave. Each appearance is a movement.

## Color

`C.bg` (light cream) for the background, `C.ink` (ink blue) for text and outlines, and four flat colors: `C.blue`, `C.coral`, `C.sun` and `C.mint`. A shot gives prominence to three at most; the rest of the shared set is dimmed. `C.mist` for background shapes that fill the frame without competing. One flat tone per shape.

## Material

- Rounded geometric shapes (`rrect`, circles, soft curves) filled with `flat()`: a flat color plus a flat shadow offset downward (`sh`, `sa ≈ .13`). Clean surfaces: flat color and nothing else.
- Thick lines with round caps that draw themselves with `lineOn()`.
- The background always carries 3–5 large circles of `C.mist` that breathe slowly.

## Movement

- Fluid at 60 fps (`expo: 1`), without `boil`.
- Curves with character: `ease.back` to enter, `ease.elastic` for objects that fall or bounce, `eio` for the camera.
- Camera nearly still: zoom from 1.0 to 1.06 at most. The movement comes from the shapes, not the camera.
- Physics (falls, bounces) can be computed analytically: `y = y0 + g·t²` gives the exact instant of impact for the score.

## Text

`kinetic()`: word by word, rising with a bounce and staggered 0.07 s. `FONTS.display` at weight 800, size 100–130 for headlines and 60–80 for labels. Color `C.ink` on light, or `C.white` on color. At most 5 words per label.

## Sound

- Music: `MUSIC = { bpm: 110, key: 'D', mode: 'major', prog: [1, 5, 6, 4], inst: { pad: 'synth', bass: 'bass', keys: 'synth', lead: 'marimba', perc: 'click' } }`: a soft synthesizer with bass on the strong beats.
- **Sync**: `pop` for shapes that come in, `click` for small impacts and `whoosh` for sweeps.
- Ambience `studio` (almost silence).

## Review

- Cream background with 3–5 circles of `C.mist`; no third of the frame is left empty.
- At most three prominent colors per shot, each shape in a single tone.
- Each shape carries its flat shadow offset downward.
- In captures in sequence, the shapes come in with a bounce (they go past their size and come back) over several frames.
- Headlines at 100–130 px and labels at 60–80 px, weight 800, with 5 words at most, and they read in full.
