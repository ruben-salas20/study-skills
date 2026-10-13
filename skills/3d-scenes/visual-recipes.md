# Visual recipes

Techniques for *realism* without post-processing, tested on the software render of the captures. Each one says when to use it: applying all of them to everything is decoration.

| If the subject has… | Recipe |
|---|---|
| Surfaces of a recognizable material (metal, water, rock, fabric, plastic) | §1 Material based on what it is |
| A quantity that varies across a surface (temperature, depth, concentration, speed) | §2 Quantity → appearance |
| Something with no defined surface that moves: fire, smoke, gas, vapor, plasma, a jet | §3 Animated volumetric effect |
| Something that really emits light (flame, filament, LED, lava, star) | §4 Local glow |
| An interior that matters and walls with thickness (organs, Earth's layers, pipes, machines, cells) | §5 Section cut |
| A landscape or natural surface over a height grid (valley, volcano, coast, glacier, field, tissue seen as a landscape) | §6 Terrain by history |
| A block of material cut along its sides or by a plane: ground, rock, ice, sediment, layered tissue | §7 Strata on sides and sections |
| Many small objects covering a surface according to its state (trees, crops, rocks, houses, cells, corals) | §8 Instanced cover with masks |
| A sheet of fluid whose movement is the cause of the phenomenon (river, tide, lava flow, ocean current, blood flow) | §9 Water with depth and flow direction |
| A soft, rounded shape or one that deforms (organs, cells, fruit, animals, eroded rocks, masses that beat or breathe) | §10 Organic geometry |
| Particles that represent a flow through compartments with valves or gates (blood through the heart, air in the lungs, water through locks, traffic through traffic lights) | §11 Particles that conserve flow |

Rules that apply to all of them: physical tints (sand, rock, artery, tempered steel) are declared with `ampliarTemas` using their own keys, not as loose hex values; everything random comes from a deterministic hash of the index, never from `Math.random`, so the capture comes out the same; and every `uT` of a shader is assigned in `actualizar(t)` with `ANIMADA` active while it is visible, so pause freezes it and `?t=` reproduces it.

## 1. Material based on what it is

Each surface gets the roughness and metalness of what it represents; the semantic color stays on top.

| Material | `metalness` | `roughness` | Notes |
|---|---|---|---|
| Polished / machined metal | 0.8–0.9 | 0.25–0.45 | needs an environment (below) or it comes out black |
| Plastic, paint | 0 | 0.4–0.6 | |
| Rock, soil, terrain | 0 | 0.85–1 | color variation with §2, not shine |
| Water | 0 | 0.05–0.2 | `transparent`, `opacity` 0.6–0.8; benefits from the environment |
| Glass | 0 | 0–0.1 | `opacity` 0.2–0.35, `depthWrite: false` |
| Organic tissue, skin | 0 | 0.5–0.7 | tone with §2 if it encodes something (oxygenation, temperature) |

**Environment, only if there is something reflective** (metal, water, glass). It is generated once and costs nothing per frame; with it, the comment in `mat()` about "high metalness comes out black" no longer applies:

```js
import('three/addons/environments/RoomEnvironment.js').then(({ RoomEnvironment }) => {   // montar() is not async
  const pmrem = new THREE.PMREMGenerator(render);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  k.pedir();
});
escena.environmentIntensity = 0.4;                 // moderate: don't flatten the directional light
alCambiarTema((n, T) => { hemi.intensity = T.hemi * 0.6; });   // the environment already provides light
// For matte surfaces (floor, pedestal) lower the reflection: material.envMapIntensity = 0.25.
```

## 2. Quantity → appearance

A quantity in the state that varies across a surface shows up on the surface (the throat of a nozzle glowing red, the darkest bed where erosion is deepest). Two parts: a **fixed gradient** in a canvas texture (where it varies) and an **intensity tied to the state** (how much):

```js
function degradado(paradas) {        // along v: the uv of LatheGeometry, TubeGeometry or a plane
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const x = c.getContext('2d'), g = x.createLinearGradient(0, 256, 0, 0);
  for (const [p, col] of paradas) g.addColorStop(p, col);
  x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const m = mat('metal', { emissiveMap: degradado([[0, '#fff'], [0.15, '#000'], [1, '#000']]) });
alCambiar((e) => { m.emissiveIntensity = analizar(e).presion / 300; });   // heat ∝ quantity
```

- Heat that glows: `emissiveMap` + `emissiveIntensity`. What does not emit light (depth, concentration): `map` or `vertexColors`, never emissive.
- On terrain, the gradient goes per vertex (`vertexColors`) from height or quantity.

## 3. Animated volumetric effect

Fire, smoke, vapor, hot gas, plasma, a jet: **layers of open geometry** (cones, cylinders or crossed planes) with a `ShaderMaterial` of animated noise, with no raymarching and no heavy particles. Core of the fragment shader, with `s` = coordinate along the effect (0 at the origin, 1 at the tail):

```glsl
float f = abs(dot(normalize(vN), normalize(vV)));            // 1 when facing us, 0 at the edge
vec3 q = vec3(s * uLargo * 5.0 - uT * uVel, vA * 1.4);       // the noise travels with time
float n = fbm(vec3(q.x * 0.9, q.yz * 3.2));                  // streaks stretched along the axis
float m = fbm(vec3(q.x * 0.45 + 7.0, q.yz * 1.3));           // large swirls
float I = smoothstep(0.0, uIni, s) * pow(max(1.0 - s, 0.0), uCaida);   // appears and fades out
I *= mix(1.0, 0.2 + 1.4 * n, uRuido);
I *= mix(1.0, smoothstep(0.0, 0.35, m + 0.55 - s), uRompe);  // the tail breaks up into shreds
vec3 col = mix(mix(uC0, uC1, smoothstep(0.0, 0.4, s)), uC2, smoothstep(0.35, 1.0, s));
gl_FragColor = vec4(col, clamp(uOpac * I * pow(f, uBorde), 0.0, 1.0));
#include <colorspace_fragment>
```

`fbm` is 3 octaves of 3D value noise:

```glsl
float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float ruido(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + 1.0), f.x), f.y), f.z);
}
float fbm(vec3 p) { return 0.5 * ruido(p) + 0.25 * ruido(p * 2.0) + 0.125 * ruido(p * 4.0); }
```

- **The edge by `N·V`** gives the look of volume: the layer fades where it is seen edge-on.
- Material: `transparent: true, depthWrite: false, side: DoubleSide`.
- Variants come from parameters, not from different shaders: fire (bright core → color → dark, additive, high `uCaida`), smoke (dark colors, normal blending, geometry that widens with `s`), gas in a container (low `uCaida`, high `uRuido`). Color and size come from the state when they are data (methane flame is bluish; kerosene flame is orange).

**Additive only on a dark background.** On the light theme `AdditiveBlending` saturates to white and the effect disappears: there, use normal blending with more saturated tones per theme. Gas inside a lit piece, also normal, or lava turns the wall white. Changing `blending` requires `material.needsUpdate = true`.

## 4. Local glow

Halo without bloom for what really emits light: an additive `Sprite` with a radial gradient, scaled by the quantity and hidden on the light theme (§3). A halo on an "important" piece is decoration.

```js
const c = document.createElement('canvas'); c.width = c.height = 128;
const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
x.fillStyle = g; x.fillRect(0, 0, 128, 128);
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c),
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
halo.material.color.setHex(0xffb060);   // emitter's tint
```

## 5. Section cut

Half of a piece removed, the wall **with its thickness hatched** as in a technical drawing, and the interior visible. No stencil pass. If only the interior flow matters, cheaper: nearly transparent casings (opacity ~0.1, no `castShadow`).

1. **Cuttable pieces are closed solids**: outer wall and inner wall with normals pointing inward (`LatheGeometry` of a closed rectangular profile; for boxes, one inside another with the inner one inverted). A cut sheet surface looks hollow.
2. **Clipping plane** on the cuttable materials:
   ```js
   render.localClippingEnabled = true;
   const plano = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);   // removes z > 0
   m.clippingPlanes = corte ? [plano] : []; m.clipShadows = true; m.side = corte ? THREE.DoubleSide : THREE.FrontSide;
   ```
3. **Back faces showing through the cut are painted as a section**: the only thing seen from behind is the inside of the wall.
   ```js
   const uCorte = { value: 0 }, uSeccion = { value: new THREE.Color() };
   alCambiarTema((n, T) => uSeccion.value.setHex(T.seccion, THREE.LinearSRGBColorSpace));
   m.onBeforeCompile = (sh) => {
     sh.uniforms.uCorte = uCorte; sh.uniforms.uSeccion = uSeccion;
     sh.fragmentShader = 'uniform float uCorte;\nuniform vec3 uSeccion;\n' + sh.fragmentShader.replace(
       '#include <dithering_fragment>', `#include <dithering_fragment>
       if (uCorte > 0.5 && !gl_FrontFacing) {
         float raya = step(mod(gl_FragCoord.x - gl_FragCoord.y, 8.0), 1.6);
         gl_FragColor = vec4(uSeccion * (1.0 - 0.3 * raya), 1.0);
       }`);
   };
   m.customProgramCacheKey = () => 'seccion';   // otherwise Three.js reuses the program without the patch
   ```
4. **Inside**, what counts: translucent fluid in the color of the legend, gas with §3, internal parts.
5. **Section color** (`seccion`, in `ampliarTemas`), distinct from all the semantic ones: neutral gray for parts and machines; for tissue, rock or wood, the tone of the cut material, light and not very saturated (pale pink in an organ, ochre in terrain). The inner cavity is darker than the cut wall, so wall and empty space can be told apart at a glance.
6. **What crosses the plane**: a cut sphere looks like a hollow ring, so particles go **behind** the plane (`z ≤ −radius`). Thin pieces that matter whole (valves, leaflets, filaments) are not clipped, even if they stick out a bit.

## 6. Terrain by history

A landscape that changes (erosion, deposition, lava, ice, crops), where **what is at each point depends on what happened to it**. A flat textured plane reads as a map glued to a slab; it looks like a model when height, color and cover come from the same quantity per cell (age, material, depth).

- **Own grid** (indexed `BufferGeometry`, one vertex per model cell), not `PlaneGeometry`: the index `c = j * NX + i` works the same for height, color, vegetation (§8) and the water texture (§9).
- **One class per cell** decides height and tint at once (old / young / recent deposit / underwater / collapsing edge). Height follows the class (recent deposits, lower, rise with age); the noise only adds micro-relief (±0.5 m).
- **Tints blended with `Color.lerp` by age** (sand → meadow → forest). What the scene counts ("the river already ran through here") has to be distinguishable from what is not: if young ground ends up the color of old ground, the figure that measures it stops being visible.
- **Steep edges turn jagged like a saw blade.** A 4-1-1-1-1 smoothing (and two more passes only in the steep zone) removes it without losing shapes 2-3 cells wide:
  ```js
  hTmp.set(h);
  for (let j = 1; j < NZ - 1; j++) for (let i = 1; i < NX - 1; i++) {
    const c = j * NX + i;
    h[c] = (4 * hTmp[c] + hTmp[c - 1] + hTmp[c + 1] + hTmp[c - NX] + hTmp[c + NX]) / 8;
  }
  ```
- **The collapsing wall is separate geometry**: a vertical strip along the edge (one vertex at the top and one at the foot per point), with the material from §7. The grid alone does not draw a scarp narrower than one cell.
- Vertical exaggeration in a constant (`wy = (h) => h * VE / 100`), explained in `ayuda()`. What sits on top (trees, houses) is **not** exaggerated, or they look like needles.
- Rebuilding 50,000 vertices + `computeVertexNormals` per frame holds up during a fast camera transition; for more, lower the resolution.

## 7. Strata on sides and sections

The edge of a layered material (side of a terrain block, geological cut, ice core, skin section). A smooth side gives away the model; the layers tell what was deposited on top of what. A single material for all edges computes the color **in the fragment** from the world height and two attributes per vertex: `aTop` (surface of that column) and `aDep` (base of the new layer; equal to `aTop` where there is none). This way the layers stay horizontal and sharp even when the geometry is a strip of two vertices per column.

```js
function matEstratos() {
  const m = new THREE.MeshStandardMaterial({ roughness: 1, side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uEstr);   // layer colors (from TEMAS via alCambiarTema) and uEsc = m per unit
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aTop, aDep;\nvarying float vTop, vDep;\nvarying vec3 vMundo;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvTop = aTop; vDep = aDep; vMundo = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uSuelo, uNueva, uA, uB, uC; uniform float uEsc;
varying float vTop, vDep; varying vec3 vMundo;
vec3 capa(float y, float top, float dep, float hor) {
  if (y > top - 0.5) return uSuelo;                            // soil with roots on top
  if (y > dep) return uNueva * (0.92 + 0.14 * step(0.8, fract(y / 0.6)));   // new layer, laminated
  float k = mod(y + 0.5 * sin(hor * 0.011), 3.4);              // old layers, somewhat wavy
  return k < 1.5 ? uA : k < 2.1 ? uB : uC;
}`)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = capa(vMundo.y * uEsc, vTop, vDep, (vMundo.x + vMundo.z) * 100.0);');
  };
  m.customProgramCacheKey = () => 'estratos';
  return m;
}
```

- **Sides**: for each edge cell of the grid, one vertex on the surface and one at the base, with their `aTop`/`aDep`; they update with the terrain.
- **Terrain section** (not the one in §5, which cuts closed solids): with the clipping plane aligned with a grid column, draw on it a strip with this material taking the height **from the grid itself**, so the edge matches the cut terrain. The water in the section goes in a separate mesh on the bed.
- Shader heights in real meters, with the scale as a uniform (`uEsc = 100 / VE`): the layers don't change thickness if the exaggeration changes.

## 8. Instanced cover with masks

Many identical things whose presence, size or color **depends on the state of the ground** (forest by age, rocks by slope, houses by flood level). Thousands of low-poly objects in **one** `InstancedMesh`; what shows is the mask, not the tree.

- **Fixed candidates**, created once on a grid with deterministic jitter; each one stores its cell and two fixed numbers (appearance threshold `a`, size variation `b`).
- **On every state change** the masks are applied and only the ones that survive are written; `count` cuts off the rest:
  ```js
  let n = 0;
  for (const k of candidatos) {
    const c = k.c;
    if (agua[c] || cauce[c] || pendiente(c) > MAX || zonaVetada(k)) continue;   // hard masks
    const dens = densidadSegun(edad[c]);                                        // soft mask: 0..1
    if (k.a > dens) continue;
    const t = tamSegun(edad[c]) * (0.8 + 0.4 * k.b);
    m4.compose(v.set(x(k), y(c), z(k)), q, s.set(0.13 * t, 0.16 * t, 0.13 * t));
    copas.setMatrixAt(n, m4);
    copas.setColorAt(n, col.setHex(t < 0.5 ? T.arbusto : T.copaJoven).lerp(tmp.setHex(T.copaVieja), madurez));
    n++;
  }
  copas.count = n; copas.instanceMatrix.needsUpdate = copas.instanceColor.needsUpdate = true;
  copas.computeBoundingSphere();   // otherwise frustum culling uses the box from the first time
  ```
- **Geometry**: `IcosahedronGeometry(0.5, 0)` moved so it rests on the ground, `flatShading: true`: 20 faces that read as a canopy in the software render. `setColorAt(0, …)` before the first use creates `instanceColor`.
- **The mask can draw history**: modulating density with age (`cos(edad / periodo)`) leaves rows of trees on old banks or fronts.
- **Masks that explain are hard**: nothing grows where the phenomenon acts (a bank being eaten by the river, an active lava flow). That gap is what makes the phenomenon visible.
- Cost: ~17,000 candidates and ~10,000 instances of 20 triangles did not move the "ready in" time of the capture; with shadows they are drawn again on the map, and with `ANIMADA`, on every frame.

## 9. Water with depth and flow direction

A sheet of fluid where **speed or stillness is part of the explanation** (faster current on the outside of a bend, isolated lake vs. river, tide, lava flow). Color by depth gives volume; the streaks that run give the cause.

- **A plane at water level** that shows only where the terrain sits below it: channels and lakes appear on their own.
- **A data texture per cell** (8-bit RGBA `DataTexture`, linear filtering) filled from the model on every change: R,G = direction (0.5 = still), B = speed, A = depth. It is read with `uv = (xz − origin) / size`, with the origin half a pixel before the first cell.
- **Color**: `mix(shallow, deep, smoothstep(…, prof))` and alpha that rises with depth, so the shore lets the bed show through. **Zero direction = still water**: a different tone (darker, greenish) and no streaks; that way an isolated lake can be told apart from a live channel without reading anything.
- **Streaks**: noise stretched in the flow frame and shifted over time, in two crossed phases so they don't stretch forever (flow maps):
  ```glsl
  vec2 d = normalize(dir + vec2(1e-4, 0.0)), p = vMundo.xz * 100.0;
  vec2 q = vec2(dot(p, d), dot(p, vec2(-d.y, d.x)));            // along / across the flow
  float f0 = fract(uT * 0.3), f1 = fract(uT * 0.3 + 0.5), w = abs(1.0 - 2.0 * f0);
  float n0 = ruido(vec2((q.x - vel * 55.0 * f0) / 22.0, q.y / 3.5));
  float n1 = ruido(vec2((q.x - vel * 55.0 * f1) / 22.0 + 17.3, q.y / 3.5 + 5.1));
  float veta = smoothstep(0.66, 0.9, mix(n0, n1, w)) * (1.0 - lago) * smoothstep(0.15, 0.6, vel);
  ```
- **Speed comes from the model**: the same function that gives the shape (here, the asymmetry from curvature) gives more speed next to the outer bank. If several stretches touch a cell, the nearest one wins.
- Material `transparent`, `depthWrite: false`, `roughness` ~0.1 and `envMapIntensity` ~1: the environment reflection, on the water only.

## 10. Organic geometry

A soft mass with smooth joins, grooves and bulges (organ, cell, fruit, animal, eroded rock). With loose spheres and cylinders you get a modeling-clay doll; the real thing comes from three things at once: **smooth joins with folds where they meet**, **relief in the material** and **what sits on top (vessels, fat) as its own geometry**.

**Shape: distance field + marching cubes, once at startup.** Each mass is an ellipsoid, a capsule or a tube, joined with `smin`. The `k` decides: large (1–1.5 cm on a heart) merges two masses into one; small (0.4–0.5) leaves a **fold**, which is an anatomical groove or a neck. An outer envelope is added with `smin` and has no cavity.

```js
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const sdVent = (x, y, z) => smin(sdElipsoide(VI, x, y, z) - 1.1, sdElipsoide(VD, x, y, z) - 0.55, 1.3);   // one mass
const sdTodo = (x, y, z) => smin(sdVent(x, y, z), sdAuriculas(x, y, z), 0.45);                          // with groove
const geo = mallaMC(sdTodo, centro, lado, 84);   // MarchingCubes → mergeVertices → Taubin → normals
```

- **Cost**: the expensive part is evaluating the field at 84³–100³ nodes. Evaluate at three levels (every 4, 2 and 1 nodes), interpolating where `|d|` exceeds the step, use cheap bounds (box or sphere) to skip distant primitives, and no `Math.hypot` or `Object.values` in the loop: from 1.9 s to 0.3 s in Node. `mc.field` wants the sign reversed (positive inside) and `isolation = 0`.
- **Smoothing**: `mergeVertices(g, 1e-4)` and 4 passes of **Taubin** (λ = 0.5, μ = −0.53) before `computeVertexNormals`: it smooths without thinning the walls. **Long tubes** (vessels, stems) are not in the field: `TubeGeometry` along a curve.
- **Deform without rebuilding the mesh** (beat, breathe, grow): each cavity scales its interior, and outside the displacement decays as 1/ρ², which conserves the wall's volume. Two vectors per vertex and cavity (`P`, `Q`) are precomputed, and per frame they are only combined with the scale factors; the same function moves tubes, fat and particles, so they don't come apart. Rest position goes in the `aRef` attribute.
- **What sits on top is placed with the field itself**: project onto the surface with Newton (6–8 steps); for a **groove**, search near a guide for the point where the two masses that form it are equally close (minimum `|dA − dB|`). That is where the vessel goes (`TubeGeometry` half-sunk) and the fat as lobes (`IcosahedronGeometry(1, 2)` with `mergeVertices` —otherwise it looks faceted—, some noise and uneven scale, in an `InstancedMesh`).
  ```js
  function aSuperficie(p) { for (let i = 0; i < 8; i++) { const d = sd(p.x, p.y, p.z); if (Math.abs(d) < 1e-3) break; p.addScaledVector(grad(p), -d); } return p; }
  ```

**Material: wet tissue with procedural relief, no UVs.** `MeshPhysicalMaterial` (`roughness` 0.4–0.5, `clearcoat` 0.4–0.6: the shine of a wet surface) and, in `onBeforeCompile`, a relief over `aRef` applied with screen derivatives. It works for marching-cube meshes and tubes, which have no UVs, and it does not slide when deformed:

```glsl
float altura(vec3 p) {   // p = vRef, in cm
  float n = 0.6 * ruido(p * uFrec) + 0.3 * ruido(p * uFrec * 2.3 + 3.1);
  float fib = sin(dot(p, vec3(0.52, 0.74, 0.42)) * uFrec * 9.0 + n * 3.0);   // oblique striations
  return 0.5 * n + uFib * 0.5 * fib;
}
// after #include <normal_fragment_maps>:
float hh = altura(vRef) * uRelieve;
vec3 sx = normalize(dFdx(-vViewPosition)), sy = normalize(dFdy(-vViewPosition)), r1 = cross(sy, normal), r2 = cross(normal, sx);
float det = dot(sx, r1) * faceDirection;
normal = normalize(abs(det) * normal - sign(det) * (dFdx(hh) * r1 + dFdy(hh) * r2));
// after #include <color_fragment>: tone variation
diffuseColor.rgb *= 0.86 + 0.26 * ruido(vRef * uFrec * 0.4 + 7.7);
```

- **Amplitude is calibrated by looking up close**: `uRelieve` 0.02–0.05 is not visible; muscle needed 0.14 (`uFrec` 1.25 per cm, striations ~0.5 cm) and fat 0.012 with high frequency. Capture with a very close hidden view (`VISTAS.zoom = { …, oculta: true }`, `-v zoom`); at normal distance the relief reads as "not plastic".
- A single material function with parameters (`relieve`, `frec`, `fibras`, and the section from §5) serves muscle, fat and vessels, with a fixed `customProgramCacheKey`: the uniforms stay per material.
- Measured cost (heart): ~42,000 mass vertices + 13 tubes + ~250 lobes, +0.3–0.6 s of startup in the capture.

## 11. Particles that conserve flow

Particles that pass through compartments separated by valves or gates (blood, air in the alveoli, locks, an intersection), when **what it shows is when they move and when they don't**. With beads moving at a fixed speed through a duct, you can't see that everything stops when the valve closes.

Each particle carries a fixed **L label**: the volume that entered before it. From the model comes, at each instant, the **accumulated volume** that has crossed each boundary; the particle is in the segment whose two boundaries surround it, at the fraction that corresponds to it. With a closed valve its counter does not advance, and the segment stays still on its own. It is a pure function of time and does not drift cycle after cycle.

```js
// Counters for one cycle, normalized so they add up exactly to the beat volume VL:
const Bsal = n * VL + salido(tc);          // what has left through the outlet valve
const Bav = Bsal + Vventriculo(tc);        // what has entered through the inlet valve = out + what is inside
const Bin = Bav + Vauricula(tc), Bfin = Bsal - Vartería(tc);
for (let k = Math.ceil(Bfin / DV); k <= Math.floor((Bin + VVEN) / DV); k++) {
  const L = k * DV;
  if (L > Bin)       p = ruta(venas,   1 - (L - Bin) / VVEN, k);
  else if (L > Bav)  p = ruta(auricula, (Bin - L) / (Bin - Bav), k);
  else if (L > Bsal) p = ruta(ventriculo, (Bav - L) / (Bav - Bsal), k);
  else               p = ruta(arteria,  (Bsal - L) / (Bsal - Bfin), k);
}
```

- Boundaries are built **from the volumes** (out + what is inside), not by integrating each flow: that way each segment has particles in proportion to its volume, and particles are never created or lost.
- Lateral offset per particle with a hash of `k`; inside a deforming cavity, the same deformation as the wall (§10). With a cut, behind the plane (§5).
- Size: ~2 mL per particle and a 0.2 cm radius gave ~300 readable particles in a 20 cm heart; with 1.5 mL and 0.3 cm they were a blob.
