// Embeds 3D scenes (3d-scenes skill) in a note. The note puts each scene in an iframe with an id:
//   <iframe id="router" src="scenes/router-moe.html" title="…" allowfullscreen loading="lazy"
//           style="width:100%; aspect-ratio:16/9; border:0; border-radius:12px"></iframe>
// and loads this file once (copied next to the note or pasted into a <script>). It does two things:
// - a button with data-3d='{"en":"router","vista":"lado"}' sends that order to the "router" scene;
// - passes each scene the note's theme and colors, if the note defines them.
(() => {
  // Scene color ← CSS variable of the note. These are the names from the /create-kit kit; if the kit uses others, change them here.
  // The scene also accepts blue, orange, magenta and cyan.
  const DE_LA_NOTA = { bg: "--fondo", fg: "--texto", muted: "--suave", mesa: "--caja", accent: "--acento", green: "--bien", red: "--mal" };
  const escenas = () => [...document.querySelectorAll("iframe[id]")];
  // The theme comes from the note's real background; if it is transparent, from the system.
  const oscuro = () => {
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return a ? (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5 : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const tema = (f) => {
    const cs = getComputedStyle(document.documentElement), colores = {};
    for (const [n, css] of Object.entries(DE_LA_NOTA)) { const v = cs.getPropertyValue(css).trim(); if (v) colores[n] = v; }
    f.contentWindow?.postMessage({ tipo: "tema", tema: oscuro() ? "oscuro" : "claro", colores }, "*");
  };
  // A scene with loading="lazy" that has not loaded yet would lose the order: it is sent anyway (in case it was already
  // ready before this script ran) and sent again when it reports it is ready. Orders set state, so repeating one changes nothing.
  const listas = new WeakSet(), pendientes = new Map();
  const ordenar = (f, d) => f.contentWindow.postMessage({ tipo: "orden", orden: d }, "*");
  addEventListener("message", (e) => {
    if (e.data?.tipo !== "escena3d-lista") return;
    for (const f of escenas().filter((f) => f.contentWindow === e.source)) {
      listas.add(f);
      tema(f);
      if (pendientes.has(f)) { ordenar(f, pendientes.get(f)); pendientes.delete(f); }
    }
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => escenas().forEach(tema));
  new MutationObserver(() => escenas().forEach(tema)).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-tema"] });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-3d]");
    if (!b) return;
    let d;
    try { d = JSON.parse(b.dataset["3d"]); } catch { return console.error("embed: data-3d is not valid JSON: " + b.dataset["3d"]); }
    const f = d.en ? document.getElementById(d.en) : escenas()[0];
    if (!f?.contentWindow) return console.error(`embed: no scene with id "${d.en}"`);
    f.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    ordenar(f, d);
    if (!listas.has(f)) pendientes.set(f, d);
  });
})();
