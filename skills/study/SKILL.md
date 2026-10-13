---
name: study
description: Start studying something. Clarifies what you want to learn and whether one explanation is enough or an in-depth study is needed.
disable-model-invocation: true
---

# Study

Entry point to the flow. Finds out what the learner wants to learn and why, and sends them down the right path. This skill only asks questions: teaching starts in the next skill.

## Steps

1. **Read the context.** `<ROOT>/AGENTS.md` holds the teaching rules, and `<ROOT>/NOTES.md` holds what is known about how the learner learns. Apply both to everything that follows. Done when you have read them or checked that they don't exist.

2. **Offer overdue reviews.** Look in `<ROOT>` for topic pages whose `review_on` date is earlier than today. If there are any, list them with the days overdue and ask whether to review them before starting. For each one the learner accepts, read `../assess/SKILL.md` and follow it in **Scheduled review** mode: first test what they remember, and only review what they got wrong. Done when there are no overdue reviews or the learner has chosen.

3. **Write the brief.** Ask one question at a time, starting with what the argument doesn't say, until you can write one line for each field:
   - **What:** the topic, narrowed. "How a neural network trains", not "AI".
   - **Why:** the concrete goal. An exam on a date, a project, curiosity.
   - **Success:** what the learner will be able to do at the end that they can't do today.
   - **Limits:** time available, deadline, and what is left out.
   - **Source:** classes from an institution (what the teacher says goes) or something else.

   Done when the learner confirms the brief.

4. **Decide the depth.** **Simple:** a doubt that gets resolved in one session, with no follow-up. **Deep:** several sessions, with a plan or assessment. Propose one with its reason in one sentence; the learner chooses. Done when they have chosen.

5. **Go to the next skill.**
   - **Simple:** read `../explain/SKILL.md` and follow it with the **What** from the brief.
   - **Deep:** read `../deep-setup/SKILL.md` and follow it. Hand it the brief, which will go to `MISSION.md`, and what you learned about how the learner learns that doesn't fit in the brief, which will go to `NOTES.md`.
