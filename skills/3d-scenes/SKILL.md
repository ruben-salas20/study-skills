---
name: 3d-scenes
description: Makes a 3D scene with Three.js that moves and can be touched, to understand something that is better seen in three dimensions. It is embedded in a note.
disable-model-invocation: true
---

# 3D scenes

A **scene** is a single `.html` file that opens with a double click and is embedded in the **note**, the page used for studying. Only things that have to be rotated get 3D: pieces that hide each other, a mechanism or a surface; if a flat drawing explains it, keep it flat. This skill makes the scene; the explanation is written by whoever writes the note.

## Steps

1. **Choose the object and the question.** The object is a recognizable thing whose way of working *is* the idea; boxes and arrows floating in space are not an object. The question is the doubt or the wrong idea that the scene answers: "a magnifying glass enlarges what you look at, but move it a little farther away and the image flips: where does that change?" Plan 2 to 4 **moments**, states that each show something different, with a single underlying difference between them; the first one is the initial state and already answers the question. If the scene moves, seeing it in motion is one of the moments: in the note only the moments are seen. Gather the real figures first (sizes, values, times). Done when there is an object, a question and moments with what each one shows, and every number has a source you have checked or is marked as chosen, simulated or exaggerated.

2. **Copy `scene.html`** next to the note (if the person who invoked you did not say which note it goes in, ask them), or to wherever the project keeps its attachments: look at how it is organized and follow that pattern. Name in lowercase, without accents and with hyphens (`heart-beating.html`); the title with accents goes in the `<title>`. Done when the file exists.

3. **Write the scene** between the `CONTENIDO` markers, replacing the example, and in the `aria-label` of the canvas, what is seen in one sentence; the rest of the template is not touched. Each function is explained in a comment in the template.
   - **The question** goes in the hook of `cabecera()`. **The moments**, in a `grupo(…, { principal: true })` with one option per moment. In the note only the scene, the labels, that row and the `lineaCorta()` are seen: the conclusion of the state in one idea and one number. Everything else appears in full screen.
   - **What is built looks real**, because that is what makes people want to look at it: the real shape of the object, open or cut if what matters is inside, and each surface with the material of what it is. Read the recipe that its table indicates in `visual-recipes.md`. Glow and emissive only on what emits light; no neon or effects that don't mean anything.
   - **The numbers that change are seen**: 3 to 4 `cifra()`, a `relato()` that narrates the current state with its values, labels with values ("Aorta · 123 mmHg") and, if it helps, a `grafico()`. Everything comes from a single function of the state and of time, the same one that moves the pieces: those functions receive `(e, t)` and are repainted while it animates.
   - **Color means something or it isn't there**: `mat('azul')` and the other semantic ones; material tints (muscle, copper, rock) with `ampliarTemas()`.
   - **The first view already tells the idea**: many people don't rotate anything.
   - **Movement is a pure function of time and state** (`animar(t, e)`), so that `?t=` repeats the frame.
   - The template's names (`escena`, `camara`, `render`, `estado`, `t`…) are not redeclared: the scene fails at startup.
   - `linewidth` is ignored: a thick line is a tube.

   Done when each moving piece corresponds to something from step 1 (**Choose the object and the question**) and each moment is an option in the main group.

4. **Capture and look.** Always open the PNG: framing, labels overlapping and lighting are only seen by looking.

   ```sh
   chromium --headless --enable-unsafe-swiftshader --use-angle=swiftshader --window-size=700,394 \
     --virtual-time-budget=8000 --screenshot=captura.png "file://<path>/scene.html?t=1&tema=claro&formato=compacto"
   ```

   `chrome` or `google-chrome` can be used instead of `chromium`. The **compacto** format is how it looks in the note; the **completo**, in full screen with the cards (`--window-size=1400,788` and `formato=completo`). Capture each moment in compacto and claro (`&e=clave:valor,clave:valor`), one in oscuro, one in completo and each view (`&vista=`). The warnings Chromium writes in the terminal do not count: the capture is what matters. Done when no capture has an error message in red, what changes between moments is the largest thing in the framing and nothing covers it, the labels do not overlap, it is seen in both themes and, covering the text, two moments can be told apart at a glance.

5. **Hand off.** To whoever called you, or to the person: the path, the `<iframe>` and the list of what the note needs (the question, to write it above; each color by its name and each label, for the legend; each moment and view, with what it shows, for the buttons; which figures are chosen, simulated or exaggerated). If the person invoked you, copy `embed.js` next to the note and paste the question, the `iframe` and, below, a `data-3d` button per moment (and per view, if it helps) and the legend. Done when whoever writes the note can do it without opening the scene.

## Embedding in a note

```html
<iframe id="heart" src="heart-beating.html" title="Heart beating, with blood through its chambers"
        allowfullscreen loading="lazy" style="width:100%; aspect-ratio:16/9; border:0"></iframe>
<p>… <button data-3d='{"en":"heart","momento":"ejection"}'>See the ejection</button></p>
<script src="embed.js"></script>
```

The note loads `embed.js` once, copied next to it. It passes the scene the note's theme and colors, and connects each `data-3d` button to the scene: `en` is the `id` of the `iframe`, `vista` changes the framing and the other keys change the state. It reads the colors from the `/create-kit` kit (`--fondo`, `--acento`…); if the kit calls them something else, change its `DE_LA_NOTA` table and note it in `<ROOT>/IMPROVEMENTS.md`, so that the setup reapplies it after each update. Without `allowfullscreen` the ⛶ button does not work. In a Markdown note whose viewer does not allow HTML, link to the scene.
