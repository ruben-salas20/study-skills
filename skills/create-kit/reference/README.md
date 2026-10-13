# Study pages kit

HTML pages start from a template in `templates/` and only write markup: the kit handles the font, the light and dark colors, formulas, and diagrams.

| Template | For |
|---|---|
| `topic.html` | a page in `Topics/` |
| `index.html` | the index of a course |

The optional sections of each template are in an HTML comment: add them only if they add value.

## Loading and paths

In the `<head>`, after the `<meta>` tags:

```html
<link rel="stylesheet" href="<path to kit>/kit.css">
<script src="<path to kit>/kit.js"></script>
```

`kit.js` goes without `defer`. The path is relative to the page: {{table of paths based on the learner's folder layout}}.

## Metadata

```html
<meta name="course" content="Rust">
<meta name="key" content="rust/1.2">     <!-- unique; used by review -->
<meta name="status" content="new">       <!-- new, in-progress, mastered -->
<meta name="review_on" content="">       <!-- YYYY-MM-DD of the next review -->
```

## Components

- **Formulas:** `$…$` inline and `$$…$$` in display mode. The kit loads KaTeX only if the page has a `$`.
- **Diagrams:** `<pre class="mermaid">…</pre>`. The kit loads Mermaid only if there is one.
- **Callouts:** `<div class="aviso">`; for common mistakes, `<div class="aviso error-comun">`.
- **Review:** `<section class="repaso">` with one `<div class="q">` per question. Open: only the question `<p>`; the kit adds the answer box. Multiple choice: an `<ol class="ops">` with one `<li data-correcta>` and each distractor with `data-por="why not"`; the kit shuffles, checks the answer when chosen, and shows the `.explica`. At the end, add "Send review", which fires a `kit:review` event on `window` with the answers, for any app hosting the page to listen to, and also leaves them in the console.

`window.Kit` provides `Kit.meta` (the `<meta>` tags it read) and `Kit.enviar(datos)`.
