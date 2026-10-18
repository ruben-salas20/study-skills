---
name: study-phase
description: Studies the next subtopic of the plan. Creates its page, you study it, and it gets assessed.
disable-model-invocation: true
---

# Study phase

One study session: one or several short subtopics of the current phase. It starts in a new session; everything you need is in the course files.

## Steps

1. **Get your bearings.** The course is, in this order: the one in the folder where the session was opened (the one with `MISSION.md`, or a higher one); the one the argument names; the only one in `<ROOT>` with `PLAN.md`. If there are several and nothing decides, list them and ask. Read `<ROOT>/AGENTS.md`, `PLAN.md`, `MISSION.md`, `BASELINE.md` and the `NOTES.md` files. The subtopic is the first `[ ]` in the tree, and the current phase is its phase: read its file in `phases/`. If that subtopic already has a page, the previous session was left half-done and you resume it. Done when you state course, phase and subtopic in one line.

2. **Offer the overdue reviews** with step 2 (**Offer overdue reviews**) of `../study/SKILL.md`. Done when there are none or the learner has chosen.

3. **Research the phase** if it's their first session, that is, if no subtopic of the phase has a page. Launch a subagent with `../investigate/research-sources.md`, limited to this phase's subtopics and their gaps, and wait for its report. Show the gaps and contradictions it brings. Done when it has finished or the phase was already researched.

4. **Write the page** `Topics/<n.m> <Subtopic>`, in the course's format.
   - First, search `Topics/` for what already exists: what already has a page gets linked, not repeated.
   - Pursue the subtopic's **goal** from the phase file and rely on its sources in `Resources/`, citing them.
   - Visual resources follow `../explain/resources.md`.
   - Review questions only if they are part of the explanation: predicting something and checking it in an interactive resource, or a multiple-choice question whose wrong options are typical mistakes, each with its reason. Assessment belongs to `/assess`; don't close the page with questions out of habit.
   - Metadata: `status: new` and `review_on` empty.
   - Link it from the course index.

   Done when the page is linked from the index and each key claim has its source or is your own reasoning.

5. **Study the page with the learner.** Open it and let them read it. Answer their questions. When a question shows the page isn't understood, fix the page as well as answering. What you learn about how they learn goes to `NOTES.md`: general things go to `<ROOT>/NOTES.md`, and things specific to the course go to the course's. Done when the learner says they're ready.

6. **Assess.** Follow `../assess/SKILL.md` and come back here with its result. If it comes back after 2 failures in a row, rewrite the page from a different angle, with what failed, check `BASELINE.md` for a missing prerequisite, and go back to step 5 (**Study the page with the learner**).

7. **Close the session.**
   - **Subtopics remain in the phase:** if the next one is short and the session is still brief, go back to step 4 (**Write the page**) with it. If not, finish and say that you continue with `/study-phase` in a new session: opened in the course folder (say its path) or with the course as argument, `/study-phase <course>`.
   - **Phase finished** (no `[ ]` left): review the next phase with what was observed (failures, doubts, `NOTES.md`). If it needs changes, read `../plan-phases/SKILL.md` and follow it in **Review** mode. If not, say which phase starts.
