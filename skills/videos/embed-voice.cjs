#!/usr/bin/env node
// Embeds narration clips in a video: puts them in the VOICE-START … VOICE-END block of the HTML.
//   node embed-voice.cjs video.html 1.25:voice/line1.wav 6.0:voice/line2.mp3 [--v 1]
//   node embed-voice.cjs video.html            (no clips: removes the voice)
// Each clip is start_second:file. Prints the duration of each clip so the shots can be fitted to the voice.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const args = process.argv.slice(2), vi = args.indexOf('--v'), v = vi < 0 ? 1 : +args.splice(vi, 2)[1];
const [html, ...clips] = args;
if (!html) { console.error('usage: embed-voice.cjs video.html [t:file ...] [--v 1]'); process.exit(2); }
const items = clips.map(c => {
  const i = c.indexOf(':'), t = +c.slice(0, i), f = c.slice(i + 1);
  if (!(t >= 0) || !fs.existsSync(f)) { console.error(`invalid clip: ${c}`); process.exit(2); }
  const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
  console.log(`${t.toFixed(3)} s → ${(t + dur).toFixed(3)} s  (${dur.toFixed(3)} s)  ${f}`);
  return `  { t: ${t}, v: ${v}, b64: '${fs.readFileSync(f).toString('base64')}' },`;
});
const src = fs.readFileSync(html, 'utf8'), re = /(\/\/ VOICE-START[^\n]*\n)[\s\S]*?(\/\/ VOICE-END)/;
if (!re.test(src)) { console.error('the HTML has no VOICE-START … VOICE-END block'); process.exit(1); }
fs.writeFileSync(html, src.replace(re, (_, a, b) => `${a}const VOICE = [\n${items.join('\n')}\n];\n${b}`));
console.log(`${items.length} clip(s) in ${html}`);
