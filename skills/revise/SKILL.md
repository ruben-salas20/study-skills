---
name: revise
description: Reviews what was missed in an assessment, with hints from least to most, and re-assesses the learner.
disable-model-invocation: true
---

# Revise

Work only on what was missed in `/assess`, not the whole subtopic.

## Steps

1. **Gather the misses.** They come from `/assess` in this conversation. If not, take the missed items from the last line for the subtopic in `Assessments/log.md`. Also read the subtopic's page. Done when you have the list of missing ideas.

2. **Recover each idea with staged hints.** For each miss, from smallest to largest:
   1. a question that points them in the right direction;
   2. the missing idea, without the full explanation;
   3. the full explanation, with an example.

   Go up a level only when the previous one is not enough. Done when the learner explains each idea in their own words.

3. **Fix the cause.** If an idea was not on the page or was not understood, fix the page. If the miss shows something about how the learner learns, add it to `NOTES.md`: general points go to `<ROOT>/NOTES.md`, and course-specific ones go to the course's own `NOTES.md`. Done when each miss has its cause addressed or ruled out.

4. **Assess again.** If you came from `/assess`, go back there. If not, read `../assess/SKILL.md` and follow it in **After studying** mode.
