---
name: create-kit
description: Creates your kit of study HTML pages, with your colors and only the components you need.
disable-model-invocation: true
---

# Create kit

Builds the learner's HTML kit from `reference/`. The reference is neutral on purpose: the style comes from the learner's choices, not from the reference.

## Steps

1. **Read the reference.** `reference/README.md`, `kit.css`, and `kit.js`. Done when you know what each component does.

2. **Ask about preferences,** one at a time, offering the reference default as an option:
   - **Colors:** one accent color, and whether they want light, dark, or system-based.
   - **Font:** the system font or a specific one.
   - **Reading width** and font size.
   - **Components:** formulas, diagrams, callouts, and review. Ask which subjects they study and whether any need something of their own (circuits, charts with axes, 3D…).

   Done when there is an answer for all four.

3. **Create the kit** in `<ROOT>/_kit/`: copy the reference, change the variables in `kit.css`, and remove the components they don't want. A subject-specific component is written the first time a page needs it, not now: note it in `README.md` as pending. Done when the kit has only what was chosen.

4. **Write the paths.** Check how `<ROOT>` organizes its courses and fill in the table in `README.md` with the path relative to the kit from each folder type (course index, `Topics/`…). Done when each folder that will hold pages has its path.

5. **Test.** Fill in `templates/topic.html` with an example that uses each chosen component, open it in the learner's viewer or in the browser, and ask them to look at it in light and dark mode. Fix it until they like it. Delete the example. Done when the learner approves how it looks.

6. **Go back** to `/setup-study-skills` if you came from there, with the kit path for their `AGENTS.md`.
