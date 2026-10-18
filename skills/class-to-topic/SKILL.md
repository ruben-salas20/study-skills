---
name: class-to-topic
description: Turns a class's material (transcript or notes) into topic pages, one per concept, and studies them.
disable-model-invocation: true
---

# Class to topic

For courses at an institution. The source is the class: what the teacher said outranks any other source. Starts in a new session.

## Steps

1. **Get your bearings.** The subject is, in this order: the one in the folder where the session was opened (the one with `MISSION.md`, or a higher one); the one the argument names; the only institution's subject in `<ROOT>`. If there are several and nothing decides, list them and ask. Read `<ROOT>/AGENTS.md`, `MISSION.md` and the subject's `NOTES.md` files. If there are pages for this subject with `status: new`, a previous session was left half-done: offer to resume them in step 6. The material is the one the argument indicates; if there is none, list the files in the term's `_Inbox/` for this subject and ask. Done when there is material or pages to resume.

2. **Offer the overdue reviews** with step 2 of `../study/SKILL.md`. Done when there are none or the learner has chosen.

3. **Extract the concepts.** Read the whole material and list the concepts the class teaches. For each one, search `Topics/` for whether it already has a page: if it does, it gets expanded; if not, it gets created. Also collect:
   - **obvious transcription errors**, with their corrections;
   - **inaccuracies** in the material: what seems wrong or incomplete, with the reason.

   Show all of it. Done when the learner confirms the list of concepts.

4. **Save the material** in `Resources/YYYY-MM-DD — Class — <topic>.md`, with the class date and the transcription errors corrected. Move it out of `_Inbox/`. Done when it is in `Resources/` and not in `_Inbox/`.

5. **Write the pages,** one per concept, in `Topics/` and in the course's format, before studying any of them.
   - Number them like the existing pages (for example, the syllabus unit: `U1.4`). If there are none, ask for the syllabus.
   - Recount what the class said and cite it. What you add from another source is marked as added. Each inaccuracy goes in a notice, next to what the teacher said: the learner decides.
   - Visual resources follow `../explain/resources.md`.
   - Link to what already has a page instead of repeating it.
   - Review questions only if they are part of the explanation: predicting something and checking it in an interactive resource, or a multiple-choice question whose wrong options are typical mistakes, each with its reason. Assessment belongs to `/assess`; don't close the page with questions out of habit.
   - Metadata: `status: new` and `review_on` empty.
   - Link them from the subject's index.

   Done when each confirmed concept has its page, linked from the index.

6. **Study and assess each page** with steps 5 and 6 of `../study-phase/SKILL.md`. Done when each page is assessed or the session closes.

7. **Close the session.** If pages with `status: new` remain and the session is already long, finish and say they resume with `/class-to-topic` in a new session: opened in the course folder (say its path) or with the course as argument, `/class-to-topic <course>`.
