---
name: deep-setup
description: Sets up an in-depth study. Creates the folder for the course or subject, its index, MISSION.md and NOTES.md.
disable-model-invocation: true
---

# Deep setup

Creates the place where an in-depth study will live. Each later skill creates its own folders (`Topics/`, `Resources/`, `Assessments/`…) the first time it writes to them; here only what is used from the start gets created.

## Steps

1. **Get the brief.** It comes from `/study` in this conversation. If it isn't there, make it with step 3 (**Write the brief**) of `../study/SKILL.md`. Done when you have all five fields confirmed.

2. **Choose the location.** Look at how `<ROOT>` is organized and follow that pattern. If it's empty:
   - **Institution source:** `<ROOT>/Institution/<period>/<Subject>/`, with `_Inbox/` in the period folder for class material. Ask for the period if you don't know it.
   - **Other source:** `<ROOT>/Self-taught/<Course>/`.

   If the folder already exists, show what it contains and ask whether to update its `MISSION.md` or pick another name. Done when the learner confirms the path.

3. **Create the folder and its index.** The index is named like the folder and uses the format of the other indexes in `<ROOT>`; if there are none, Markdown. Link it from the top-level index (the period or area index), if one exists. Done when the index exists and the top-level index, if there is one, links to it.

4. **Write the documents.**
   - `MISSION.md`: the five brief fields, one per line, and today's date.
   - **Notes:** what applies to any topic goes to `<ROOT>/NOTES.md`; what is specific to this course goes to its `NOTES.md`. Create each file only if it has something to store.

   Done when everything `/study` found out is in one of these files.

5. **Go to the next skill.**
   - **Institution source:** finish. Say that each class is processed with `/class-to-topic` in a new session: opened in the course folder (give its path) or with the course as the argument, `/class-to-topic <course>`.
   - **Other source:** read `../investigate/SKILL.md` and follow it.
