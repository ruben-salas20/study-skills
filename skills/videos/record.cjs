#!/usr/bin/env node
// Exports a video to MP4, extracts loose frames, or builds a motion sheet to review it.
//   node record.cjs video.html output.mp4 [--ancho N] [--lufs -14 | --lufs no]
//   node record.cjs video.html folder/ --fotogramas 20,140,290 [--ancho N]
//   node record.cjs video.html sheet.jpg --hoja 300-440 [--n 12] [--ancho 480]
// --zonas (frames and sheet) shades in red the edges covered by the platform's interface (FORMAT.safe).
// Without --ancho, the short side comes out at 1080 px (16:9 → 1920×1080, 9:16 → 1080×1920, 4:5 → 1080×1350); on the sheet, each thumbnail measures 480 px.
// The MP4 comes out with its sound normalized to --lufs (−14 by default, the level streaming platforms normalize to) and is verified at the end.
// Launches the system Chromium (VIDEOS_CHROMIUM or `chromium` on the PATH): not every headless browser paints canvas.
'use strict';
const fs = require('fs'), path = require('path'), { spawn, execSync, execFileSync } = require('child_process');
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));

const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const zonasI = args.indexOf('--zonas'), zonas = zonasI >= 0 && !!args.splice(zonasI, 1);
const anchoPedido = +(opt('--ancho') || 0), fotos = opt('--fotogramas'), hoja = opt('--hoja'), nHoja = +(opt('--n') || 12), lufsOpt = opt('--lufs') ?? '-14';
const [entrada, salida] = args;
if (!entrada || !salida) { console.error('usage: record.cjs video.html output.mp4 [--ancho N] [--lufs -14|no] | video.html folder/ --fotogramas 20,140 | video.html sheet.jpg --hoja 300-440 [--n 12]'); process.exit(2); }

// loudness (integrated LUFS, true peak) of a file, using ffmpeg's loudnorm filter
function medir(archivo, extra = '') {
  const r = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', archivo, '-af', `loudnorm=I=-14:TP=-1:LRA=11${extra}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = r.stderr.match(/\{[\s\S]*?\}/g); return m ? JSON.parse(m[m.length - 1]) : null;
}

(async () => {
  const exe = process.env.VIDEOS_CHROMIUM || process.env.CORTO_CHROMIUM || execSync('command -v chromium || command -v google-chrome-stable', { shell: '/bin/sh' }).toString().trim();
  const browser = await chromium.launch({ executablePath: exe, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  // setContent avoids serving the file: the browser doesn't touch the local network
  await page.setContent(fs.readFileSync(entrada, 'utf8'), { waitUntil: 'load' });
  for (let t = 0; t < 1200 && !errores.length && !(await page.evaluate(() => window.__READY === true)); t++) await new Promise(r => setTimeout(r, 100));
  if (errores.length) { console.error('Errors on the page:\n' + errores.join('\n')); process.exit(1); }
  const [W, H, FPS, PIXEL, NF, DUR, SAFE] = await page.evaluate(() => { const F = typeof FORMAT === 'undefined' ? {} : FORMAT; return [W, H, FPS, !!F.pixel, NF, DUR, F.safe || null]; }); // videos from the old engine have no FORMAT
  if (zonas && !SAFE) console.error('warning: --zonas without FORMAT.safe; there is no zone to draw');
  // shading of the zone covered by the interface, on a 2D context of w×h (for review only)
  const zonaJS = `(g, x, y, w, h, s) => { if (!s) return; g.save(); g.fillStyle = 'rgba(230,40,40,.28)'; const t = s.top * h, b = s.bottom * h, l = s.left * w, r = s.right * w; g.fillRect(x, y, w, t); g.fillRect(x, y + h - b, w, b); g.fillRect(x, y + t, l, h - t - b); g.fillRect(x + w - r, y + t, r, h - t - b); g.strokeStyle = 'rgba(255,80,80,.9)'; g.lineWidth = 2; g.strokeRect(x + l, y + t, w - l - r, h - t - b); g.restore(); }`;
  const par = n => Math.round(n / 2) * 2, ancho = par(anchoPedido || W * 1080 / Math.min(W, H)), alto = par(ancho * H / W);
  const cuadro = (f, conZonas = false) => page.evaluate(([f, w, h, q, pixel, safe, zjs]) => {
    __film.seek(f);
    const src = document.getElementById('film'), c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = !pixel; g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, w, h);
    if (safe) (0, eval)(zjs)(g, 0, 0, w, h, safe);
    return c.toDataURL('image/jpeg', q).split(',')[1];
  }, [f, ancho, alto, .93, PIXEL, conZonas ? SAFE : null, zonaJS]);

  if (hoja) {
    // motion sheet: n frames spread between A and B, in rows of 4, each with its number and second
    const [a, b] = hoja.split('-').map(Number), n = Math.max(2, nHoja), tw = par(anchoPedido || 480), th = par(tw * H / W);
    const fs_ = Array.from({ length: n }, (_, i) => Math.round(a + (b - a) * i / (n - 1)));
    const b64 = await page.evaluate(([fs_, tw, th, pixel, fps, safe, zjs]) => {
      const cols = 4, rows = Math.ceil(fs_.length / cols), c = document.createElement('canvas'); c.width = cols * tw + (cols + 1) * 6; c.height = rows * th + (rows + 1) * 6;
      const g = c.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = !pixel; g.imageSmoothingQuality = 'high';
      fs_.forEach((f, i) => {
        __film.seek(f); const x = 6 + (i % cols) * (tw + 6), y = 6 + Math.floor(i / cols) * (th + 6);
        g.drawImage(document.getElementById('film'), x, y, tw, th);
        if (safe) (0, eval)(zjs)(g, x, y, tw, th, safe);
        const lab = `f${f} · ${(f / fps).toFixed(2)} s`; g.font = '600 14px ui-monospace, monospace'; const w = g.measureText(lab).width + 10;
        g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(x, y, w, 20); g.fillStyle = '#fff'; g.fillText(lab, x + 5, y + 15);
      });
      return c.toDataURL('image/jpeg', .9).split(',')[1];
    }, [fs_, tw, th, PIXEL, FPS, zonas ? SAFE : null, zonaJS]);
    fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
    fs.writeFileSync(salida, Buffer.from(b64, 'base64')); console.log(`${salida} · frames ${fs_.join(',')}`);
  } else if (fotos) {
    fs.mkdirSync(salida, { recursive: true });
    for (const f of fotos.split(',').map(Number)) {
      const p = path.join(salida, `f${String(f).padStart(3, '0')}.jpg`);
      fs.writeFileSync(p, Buffer.from(await cuadro(f, zonas), 'base64')); console.log(p);
    }
  } else {
    const base = salida.replace(/\.mp4$/i, ''), wav = base + '.wav', wavN = base + '.norm.wav';
    fs.writeFileSync(wav, Buffer.from(await page.evaluate(() => __film.wav()), 'base64'));
    // loudness: two loudnorm passes (measure and correct linearly), so it sounds at streaming level without compressing the mix
    let audio = wav;
    if (lufsOpt !== 'no') {
      const I = +lufsOpt, m = medir(wav);
      if (m && isFinite(+m.input_i)) {
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', `loudnorm=I=${I}:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`, '-ar', '48000', wavN]);
        audio = wavN;
      }
    }
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', audio,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = 0; f < NF; f++) {
      const buf = Buffer.from(await cuadro(f), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % FPS === FPS - 1) process.stderr.write(`\r${f + 1}/${NF} frames · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    ff.stdin.end();
    const code = await new Promise(r => ff.on('close', r));
    for (const f of [wav, wavN]) if (fs.existsSync(f)) fs.unlinkSync(f);
    if (code) { console.error('\nffmpeg failed'); process.exit(1); }
    // check: the duration matches DUR and the sound exists
    const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', salida]).toString().trim(), fin = medir(salida);
    const ok = Math.abs(dur - DUR) <= 1.5 / FPS, lufs = fin && isFinite(+fin.input_i) ? `${(+fin.input_i).toFixed(1)} LUFS · peak ${(+fin.input_tp).toFixed(1)} dBTP` : 'NO SOUND';
    console.log(`\n${salida} · ${ancho}×${alto} · ${FPS} fps · ${dur.toFixed(3)} s (DUR ${DUR.toFixed(3)} s${ok ? '' : ' · MISMATCH'}) · ${lufs}`);
    if (!ok || lufs === 'NO SOUND') process.exitCode = 1;
  }
  if (errores.length) { console.error('Errors on the page:\n' + errores.join('\n')); process.exit(1); }
  await browser.close();
  process.exit(process.exitCode || 0);
})().catch(e => { console.error(e.message); process.exit(1); });
