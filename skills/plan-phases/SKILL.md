---
name: plan-phases
description: Details the study plan's phases or redesigns them as you go along.
disable-model-invocation: true
---

# Plan phases

Writes one file per phase in `phases/` and, once `/study-plan` has created the tree, this is the only skill that changes the structure of `PLAN.md`. The marks `[ ]`, `[~]` and `[x]` belong to `/assess`: when you touch the tree, keep them.

## Modes

- **Detail:** there are no files in `phases/`. Detail all the phases.
- **Review:** they already exist. It comes from `/study-phase` with what was seen in a finished phase, or from the learner with what they want to change. Review the next phase and, if the reason calls for it, the others.

## Steps

1. **Read the course.** `PLAN.md`, `MISSION.md`, `BASELINE.md`, the `NOTES.md` files, the files in `phases/` and the `/assess` log, if they exist. Done when you know which mode you're in and, in Review mode, the reason.

2. **Write or propose the detail.** Each phase goes in `phases/<n>-<topic>.md`, with the topic in lowercase, without accents and with hyphens instead of spaces (`phases/1-the-memory-python-hides.md`), so it's easy to link:

   ```markdown
   # Phase <n>. <Topic>

   **Objective:** <what you'll be able to do at the end that you can't do today>
   **Needs:** <previous phases or subtopics>

   ## Subtopics
   ### <n.1> <Subtopic>
   - **Goal:** <one sentence that can be checked>
   - **Sources:** <links to Resources/, or "gap">
   - **Practice:** <exercise or project>

   ## Assessment
   <what has to go right to pass the phase>

   ## Changes
   - <YYYY-MM-DD>: <what changed and why>
   ```

   - **Detail:** write all the phases.
   - **Review:** propose each change with its reason, backed by what was observed: `/assess` failures, `NOTES.md`, a subtopic that turned out to be a prerequisite of another. Apply only what the learner approves, and record it under **Changes**.

   Done when each subtopic in the tree has a goal, sources and practice, and each phase has an assessment criterion.

3. **Update `PLAN.md`** if the structure changed: new subtopics with `[ ]`, removed or moved ones, estimated sessions. Link each phase to its file. Done when the tree and `phases/` say the same thing.

4. **Wrap up.** Say which phase comes next and that you start it with `/study-phase` in a new session: opened in the course folder (say its path) or with the course as argument, `/study-phase <course>`.
