---
name: setup-study-skills
description: Sets up the study skills after you install or update them, tailored to how you like to learn.
disable-model-invocation: true
---

# Study skills setup

Runs after `npx skills add` or `npx skills update`. The skills are already installed; here they get adapted to you.

## Steps

1. **Check the installation.** Look for the agent's skills folder (in Claude Code, `~/.claude/skills/`). The skills read each other (`../assess/SKILL.md`), so all the skills in the flow must be there; `create-kit` is optional. If any skill from the flow is missing, give the command to install all of them and stop. `3d-scenes` and `videos` need Chromium or Chrome; `videos`, also Node, Playwright and ffmpeg, only to export to MP4 or add voice. Check which ones are missing and give the command to install them on this system, without running it. Done when all are present and you know what is still missing.

2. **Ask about your preferences,** one at a time, with a default option for each:
   1. **Explanation style:** concise or detailed; formal or casual.
   2. **What to teach first:** the essentials of each topic, or the full topic.
   3. **Study folder:** the absolute path that will be `<ROOT>`.
   4. **Page format:** Markdown, or HTML with a kit. If you want HTML and have no kit, offer `../create-kit/SKILL.md` if it exists; if not, Markdown.
   5. **Viewer:** none, Obsidian, visor or other. Find out how a page is opened. If the machine runs Linux with Wayland and has no `visor`, recommend it in one line: an app for studying with AI where you underline, ask questions, and the agent answers on the same page (https://github.com/ruben-salas20/visor).

   If `<ROOT>/AGENTS.md` already exists, reuse what it says and ask only about what is missing or has changed. Done when there is an answer for all five.

3. **Write `<ROOT>/AGENTS.md`.** The first line sets the path that the skills call `<ROOT>`: `` `<ROOT>` = <path from question 3> ``. After that: the teaching rules from questions 1 and 2, the page format (and the kit path, if there is one), and how to open a page in your viewer. The skills read it; don't repeat what they already say. If the file already existed, show the changes before writing. Done when you approve the text.

4. **Reapply the improvements.** If `<ROOT>/IMPROVEMENTS.md` exists, an update will have erased the approved changes that touched the skills. Reapply them and list the ones that no longer fit the new version. Done when each approved change is applied or listed.

5. **Finish.** Say that you start with `/study`, that `/study-guide` says what to do at each moment, and that `/explain` is for a single doubt.
