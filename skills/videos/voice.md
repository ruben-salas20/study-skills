# Voice

Narration recorded over the video. Only if the person wants it: it is the only part of the video that doesn't come from code.

## Generate the clips

One WAV clip per sentence of the script, with the text-to-speech tool the person has: an MCP server, an API or a local program. This repository doesn't include any. If there isn't one, say so and carry on without voice.

- **Write the sentences as they are said:** symbols and formulas in words (*f prime of x*, not `f'(x)`), and numbers spelled out when how they sound matters.
- One file per sentence, in order: `voice/01.wav`, `voice/02.wav`…
- Clip duration: `ffprobe -v error -show_entries format=duration -of csv=p=0 voice/01.wav`. Pauses within a clip, to sync an event with a word: `ffmpeg -i voice/03.wav -af silencedetect=noise=-35dB:d=0.12 -f null - 2>&1 | grep silence_`.

## Embed

The clips live inside the HTML, in the `VOICE-START … VOICE-END` block, as `{ t, v, b64 }`, and the script writes them:

```
node <skill folder>/embed-voice.cjs <slug>.html 0.5:voice/01.wav 4.2:voice/02.wav
```

Each argument is `start_second:file`. Without clips, the script removes the voice.

## Fit the shots

The script prints where each clip starts and ends. Adjust the `dur` of each shot so its sentence falls entirely over its image, with at least 0.3 s of room before the cut.

## How it sounds

The voice sounds dry and centered, follows the player (pause, jumps) and goes into the MP4. While a clip plays, `compose` lowers the music to less than half; the accents from `score()` go in the silences between sentences. With voice, the voice explains and the labels only name.
