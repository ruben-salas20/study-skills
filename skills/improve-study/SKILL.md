---
name: improve-study
description: Reviews how the learner is progressing and proposes changes to the study system, using data.
disable-model-invocation: true
---

# Improve study

Adapts the system to the learner based on what was observed. Proposes changes to the rules (`<ROOT>/AGENTS.md`), the notes, and the instructions of the installed skills; applies only what the learner approves. Each change is recorded in `<ROOT>/IMPROVEMENTS.md`, to measure whether it worked and so it isn't lost when the skills are updated.

## Steps

1. **Gather the evidence** from the last entry in `IMPROVEMENTS.md` (or from the beginning, if it doesn't exist):
   - `<ROOT>/NOTES.md` and the `NOTES.md` of each course;
   - `Assessments/log.md` of each course;
   - the **Changes** section of the files in `phases/`.

   Done when you know the period and how many assessments are included.

2. **Measure earlier improvements.** For each change applied in `IMPROVEMENTS.md`, compare its metric before and after. Done when each one is marked **worked**, **did not work**, or **no data yet**.

3. **Look for patterns**, with numbers. For example:
   - scheduled reviews that fail more at one interval than at another;
   - the item type that fails most (define, apply, relate);
   - pages that had to be redone and what they had in common;
   - notes that repeat in two or more courses, which move up to the general `NOTES.md`;
   - notes that contradict each other or that the evidence already disproves.

   A pattern needs at least 3 cases. Done when each pattern has its cases counted.

4. **Propose changes** one at a time. Each proposal states: which file and which text changes, the evidence with numbers, and the metric that will show whether it worked. If an earlier change did not work, propose reverting it. Done when the learner has approved or rejected each proposal.

5. **Apply and record.** Apply what was approved. In `IMPROVEMENTS.md`, add for each proposal: date, exact change (file, text before and after), evidence, metric, and whether it was approved or rejected. A rejected proposal comes back only with new evidence. Done when each proposal has its entry.
