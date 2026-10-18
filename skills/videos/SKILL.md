---
name: videos
description: Makes an animated explainer video with code, with music and optional voice, to understand something that changes over time. It is embedded in a note.
disable-model-invocation: true
---

# Videos

A **video** is a single `.html` file that plays in the browser, with sound and controls, and is embedded in the **note**, the page you study from. Everything comes from code: `engine.html` handles the clock, camera, text, physics, music and voice, and you write the shots. This skill makes the video; the explanation is written by whoever writes the note.

Three styles: **`3b1b`** (animated math in the style of 3Blue1Brown) if the topic has formulas or graphs; **`pixel`** (pixel art) for algorithms, data and computing; and **`motion`** (flat infographic on a light background) for everything else: biology, medicine, processes, history. Each one has its rules (`styles/<style>.md`), its kit (`styles/<style>.js`) and a solved video (`styles/examples/<style>.html`).

## Steps

1. **Set the brief.** Propose in one go the topic, the question the video answers, the length (30 to 120 s), the style and whether it has voice. Always offer voice: a voice that explains while the image shows teaches more, but only if the person has a text-to-speech tool. If the person invoked you, also ask which note it goes in. Done when the person approves the brief.

2. **Write the script.** Read the whole style. The video is **explanatory**: it teaches something with parts and an order, and by the end the viewer can name the parts.
   - **Hook**, the first 10%: the whole object, unexplained, and the question.
   - **Steps**, 75%: one concept per step, 1 to 3 shots each, in the order they are learned. Each step **shows** the event, **names** it and shows its **consequence**.
   - **Synthesis**, the final 15%: everything together, with the names in view, and the answer to the question.
   - A **thread** runs through the video: the same object or set comes back in each step (`sharedShot`, in `ENGINE.md`). Cause and effect appear together in the same frame.
   - **Labels** of 5 words at most, at most one new one per shot, stuck to what they name, at the instant of their event and for at least `0.8 s + 0.3 s per word`. With voice, the voice explains and the labels only name.

   In the chat, per shot, write: the part, what is seen, the **main action** with its anticipation, the action and the reaction in seconds (§ Animation), the exact label, the sounds that play and the duration. Done when each step covers a single concept, each one is understood from what was seen before, each shot has one main action with its three timings, and the person gives the go-ahead.

3. **Prepare the file.** Read `ENGINE.md` in full. Copy `engine.html` as `<name>.html` next to the note (or wherever the project keeps its attachments: look at how it is organized and follow that pattern). Fill in `{{TITLE}}` and `{{SYNOPSIS}}`, the `FORMAT` block with the style's values and a `poster`, and paste `styles/<style>.js` between `KIT-START` and `KIT-END`. Done when the capture in step 5 (**Build shot by shot**) runs without error.

4. **Voice**, if requested: follow `voice.md`. Done when each clip is embedded and the `dur` of each shot covers its sentence.

5. **Build shot by shot** in `YOUR FILM`. Before each shot, find a similar one in the style's example and copy what is useful. Then capture into a `review/` folder next to the video and look at three frames: `A = t0·FPS + 15`, `B` at the midpoint and `C = t1·FPS − 10`. Round every review frame up, to a multiple of `expo`, so you don't land on the pose or the previous shot.

   ```sh
   chromium --headless --enable-unsafe-swiftshader --use-angle=swiftshader --window-size=1280,720 \
     --virtual-time-budget=10000 --screenshot=review/shot3-A.png "file://<path>/<name>.html?frame=A&ui=0"
   ```

   `chrome` or `google-chrome` work instead of `chromium`; the warnings it writes to the terminal don't count. Also capture the main action in five frames: start and midpoint of the anticipation, midpoint of the action, 75% of the action (where `llegar` overshoots) and 0.3 s after it ends. Done when no capture has a red `ERROR`, the five in a row show the anticipation and, if something moves, the arc and the overshoot when it stops, whatever is not the action is still or dimmed, the framing is full (nothing important is cut off, no unintended gaps), the label reads in full at the size the style gives, and the **Review** section of the style is met.

6. **Add the sound.** The music comes from `compose(MUSIC)` with the style's `MUSIC` (`ENGINE.md`, Music). Use the style's key and its `energy` range (if it doesn't give one, 0.25 to 0.7), and give each shot its own: the lowest in the hook and the highest at the key consequence. **Every visible event sounds at that same instant**, as the style says. Done when each shot has `energy` and each event in the script has its sound in `score()`.

7. **Check the cuts.** Capture `C` of each shot and `A` of the next. Done when the thread is still recognizable from one shot to the next, no label covers what it names, and the synthesis answers the question from the hook.

8. **Deliver.** To whoever called you, or to the person: the path, the `<iframe>` and what each step shows, with its start second, so the note can explain it. If the person invoked you, paste the `iframe` into the note. Only if an MP4 is requested: `node <skill folder>/record.cjs <name>.html <name>.mp4`, which needs Node, Playwright and ffmpeg and takes about 9 s per second of video. Done when whoever writes the note can do it without seeing the video.

## Animation

How everything moves follows the principles that John Lasseter brought from traditional animation to computer animation (*Principles of Traditional Animation Applied to 3D Computer Animation*, SIGGRAPH 1987). The style decides how it looks; this table decides how it moves. If the style doesn't allow something from the table (in `pixel` there is no transparency and events fall on a time grid), use its equivalent: a darker color, the delays adjusted to the grid.

| Principle | In these videos |
|---|---|
| **Staging** | One idea per shot and a single focus: what matters comes in, moves or lights up; the rest stays still or is dimmed (alpha ~0.3). |
| **Anticipation** | Before the main action, 0.2 to 0.4 s that prepare it: a slight movement in the opposite direction, a squash or a mark where it is going to happen. What is placed for the action (a frame that arrives at the pair being compared) is part of its anticipation, not another action. |
| **Timing** | Anticipation, action and reaction, with time to read them: at least 0.5 s of action and 0.5 s of calm before the next idea. Heavy things take longer to start and to stop. |
| **Slow in and slow out** | Everything starts and stops with `eio` or with `llegar`; what appears, with `eo` or `popIn`. Linear movement only if the physics requires it (a wave that travels at fixed speed). |
| **Arcs** | What goes from one place to another follows a curve, not a straight line (`arco`). |
| **Squash and stretch** | What moves fast stretches in the direction of motion and squashes on impact or when preparing, without changing its area (`estirar`). Only in movement: what appears grows with `popIn`. Rigid things (axes, posts, text), never. |
| **Follow through and overlapping action** | When it stops, what was moving overshoots 5–12% and comes back (`llegar`). The parts of a group don't start at once: 0.05 to 0.15 s between one and the next. |
| **Secondary action** | A small reaction that reinforces the main one without competing with it: a number that changes, a pulse on the label, a ripple in the water. |
| **Exaggeration** | What is taught is exaggerated just enough to be read: more amplitude, the key change slower or bigger. If it alters a magnitude, say so in the delivery. |
| **Straight ahead and pose to pose** | What physics moves (strings, particles) is computed step by step in `step`; the rest goes between key poses (`keyframes`). |
| **Appeal** | Simple shapes recognized by their silhouette, without details that explain nothing. |

## Embedding in a note

```html
<iframe src="derivative-as-slope.html" title="Video: the derivative as the slope of the tangent"
        allowfullscreen loading="lazy" style="width:100%; aspect-ratio:16/9; border:0"></iframe>
```

In a Markdown note whose viewer doesn't support HTML, link to the video.
