---
name: assess
description: Assesses a subtopic with questions and an exercise, gives feedback, and schedules its next review.
disable-model-invocation: true
---

# Assess

Checks whether the learner reached the goal of a subtopic. It is the only skill that changes a topic's status: on its page and in the marks in `PLAN.md`.

## Modes

- **After studying:** comes from `/study-phase` or from `/revise`.
- **Scheduled review:** the page's `review_on` metadata is already past due. Comes from the offer of overdue reviews.

## Steps

1. **Prepare the test.** Read the subtopic's page, its **goal** in `phases/`, and what the phase's **Assessment** asks of it. Prepare 3 to 5 questions that differ from the page's review questions, and an exercise that applies the goal. A course from an institution has no `phases/` or `PLAN.md`: the goal comes from the page and from what the teacher said will be covered. If the course has an interactive assessment component, use it. Write the correct answer for each item for yourself before asking. Done when each item has its key.

2. **Ask one at a time.** During the test, only ask and listen: hints come from `/revise`. Done when the learner has answered everything.

3. **Grade.** Each item is marked correct, partial, or wrong, with its reason according to the key. Pass if the phase's criterion is met. State the result and which items you used to check it. For each miss, explain which idea is missing, not only what the answer was. Done when the learner has the result and the feedback.

4. **Record.** Add a line to the course's `Assessments/log.md`: date, subtopic, mode, result, missed items, and reviews done before. Done when the line exists.

5. **Update the status.** The subtopic's history in `Assessments/log.md` says whether there was a `/revise` or the page was redone, and what the previous interval was. Change `status` and `review_on` on the page and, if there is a `PLAN.md`, the subtopic's mark, at the same time:

   | Result | Status and mark | Next `review_on` |
   |---|---|---|
   | Passes after studying, no `/revise` | `in-progress`, `[~]` | in 7 days |
   | Passes after a `/revise` | `in-progress`, `[~]` | in 3 days |
   | Passes after redoing the page | `in-progress`, `[~]` | in 1 day |
   | Passes a scheduled review | `in-progress`, `[~]` | double the previous interval |
   | Passes a scheduled review of 28 days or more | `mastered`, `[x]` | empty |
   | Fails a scheduled review | `in-progress`, `[~]` | in 1 day, after `/revise` |

   A failure after studying does not change the status: follow step 6. Done when the page and `PLAN.md` say the same thing.

6. **Follow the result.**
   - **Passes:** go back to the skill that called you.
   - **Fails for the first time:** read `../revise/SKILL.md` and follow it; then repeat from step 1 with new questions.
   - **Fails after a `/revise`:** that is 2 misses in a row. After studying, go back to the skill that created the page (`/study-phase` or `/class-to-topic`) with what failed. In a scheduled review, set `review_on` to tomorrow and tell the learner that the page is redone with that skill in a new session.
