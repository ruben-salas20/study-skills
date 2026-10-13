---
name: investigate
description: Investigates a topic with sources and works out what you already know about it, before making the plan.
disable-model-invocation: true
---

# Investigate

Prepares the two inputs of the plan: what the sources say about the topic, and where the learner starts. The first is done by a subagent; the second, you do with the learner, at the same time.

## Steps

1. **Read the course.** `MISSION.md` and the `NOTES.md` files (the one in `<ROOT>` and the course's). Done when you know the topic, the goal, and the limits.

2. **Launch the subagent** in the background. Give it the topic, the mission's limits, the course's `Resources/` path, and this instruction: "Read `<absolute path of research-sources.md>` and follow it." That file, together with this one, is the subagent's prompt. Done when it is running.

3. **Check the baseline** while it researches.
   - Ask what they already know about the topic and what surrounds it. If they say nothing, note it and go to step 4: you start from zero.
   - Check what they say they know with 3 to 5 short questions, from the most basic to the most advanced. What someone believes they know and what they know don't always match. Stop at the first question they clearly fail.

   Done when each thing they said they knew is **checked** or **to check**.

4. **Write `BASELINE.md`** in the course folder: what they know (checked), what they thought they knew but failed, what they don't know, and the date. If you learned something about how they learn, add it to `NOTES.md`: general things go to `<ROOT>/NOTES.md`, and things specific to the course go to the course's. Done when the file exists.

5. **Collect the subagent's report.** Wait for it to finish. Cross-check its map with `BASELINE.md`: mark the prerequisites the learner doesn't have. Show the gaps and contradictions, if there are any. Done when the learner has seen them.

6. **Move on to the next skill.** Read `../study-plan/SKILL.md` and follow it, with the map, `BASELINE.md` and the missing prerequisites.
