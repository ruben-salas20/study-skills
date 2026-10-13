---
name: study-plan
description: Turns the research and your baseline into the course's overall plan, a tree of phases and subtopics.
disable-model-invocation: true
---

# Study plan

Writes `PLAN.md`: the course tree. Each first-level branch is a **phase**; its leaves are the **subtopics**. The detail of each phase is set by `/plan-phases`.

## Steps

1. **Gather the inputs.** The subagent's map and the missing prerequisites come from `/investigate`. Read `MISSION.md`, `BASELINE.md` and the `NOTES.md` files. If you didn't come from `/investigate`, rebuild the map from the files in `Resources/`. Done when you have the map, the baseline and the limits.

2. **Build the tree.**
   - Phases go in dependency order: none uses something that appears later.
   - The missing prerequisites form the first phase.
   - What `BASELINE.md` marks as checked, and what the mission leaves out, go under **Outside the plan**, with the reason.
   - A subtopic without a reliable source gets `(gap)`.

   Done when each subtopic on the map is in a phase or under **Outside the plan**.

3. **Check that it fits.** Estimate the sessions of each phase and compare them with the mission's time and deadline. If it doesn't fit, propose what to cut or move to **Outside the plan**. Done when it fits or the learner has accepted that it doesn't.

4. **Write `PLAN.md`** in the course folder, after showing the tree and getting the learner's approval:

   ```markdown
   <!-- Structure: /plan-phases. Marks: /assess. -->
   # Plan: <Course>

   [ ] pending · [~] in progress · [x] mastered

   ## Phase 1. <Topic> (~N sessions)
   - [ ] 1.1 <Subtopic>
   - [ ] 1.2 <Subtopic> (gap)

   ## Outside the plan
   - <Subtopic>: <reason>
   ```

   The numbering (`1.2`) will be the prefix of the subtopic's page in `Topics/`. Phases carry no mark: a phase is finished when none of its subtopics is still `[ ]`. Done when the file exists.

5. **Move on to the next skill.** Read `../plan-phases/SKILL.md` and follow it.
