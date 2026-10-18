---
name: study-guide
description: Tells you what to do next in your study, or explains a skill or the flow.
disable-model-invocation: true
---

# Study guide

Only reads and recommends; you decide and launch the skill. What each skill does is in the `description` of `../<skill>/SKILL.md`: read it there. The map of how they connect lives here.

## Flow map

```text
/study
├── simple → /explain
└── deep → /deep-setup
    ├── institution → /class-to-topic (each class, new session)
    └── other source → /investigate → /study-plan → /plan-phases
                      → /study-phase (each subtopic, new session)

After each page: /assess ⇄ /revise (2 failures in a row → the page is redone)
When a phase closes: /study-phase reviews the next one → /plan-phases if there are changes
When there is enough data: /improve-study
Install or update: /setup-study-skills
```

New sessions read everything from the course files: `MISSION.md`, `NOTES.md`, `BASELINE.md`, `PLAN.md` and `phases/`.

## Steps

1. **Choose the mode.** With a question as the argument, go to step 3 (**Answer the question**). Without one, go to step 2 (**Recommend the next step**).

2. **Recommend the next step.** Walk through `<ROOT>`: each folder with `MISSION.md` is a course. If there is none, recommend `/study`. If there are some, look in this order and recommend the first thing you find:
   1. pages with `review_on` earlier than today → `/study`, which offers them in scheduled review mode;
   2. pages with `status: new` → an unfinished session: `/study-phase` or `/class-to-topic`, depending on the course;
   3. material in `_Inbox/` → `/class-to-topic`;
   4. the first `[ ]` in each `PLAN.md` → `/study-phase`;
   5. 10 or more lines in the logs under `Assessments/` since the last entry in `<ROOT>/IMPROVEMENTS.md` → `/improve-study`.

   Give a single command, with the course as the argument (`/study-phase <course>`) or the folder where to open the session, and the reason in one sentence. Then, in one line, the rest of what you found. Done when you know what to type.

3. **Answer the question** with the map and, if it's about a specific skill, with its `SKILL.md`. End by saying which command to use. Done when the answer names the skill that solves your case.
