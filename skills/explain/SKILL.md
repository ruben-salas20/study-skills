---
name: explain
description: Explains a topic, or the last thing in the conversation, as text, diagram, HTML or video.
disable-model-invocation: true
---

# Explain

A custom, disposable explanation, in whatever format is easiest to understand.

## Steps

1. **Find out how to teach this learner.** This works inside and outside the study folder. If they exist, `<ROOT>/AGENTS.md` says how to teach and `<ROOT>/NOTES.md` says how the learner learns. If not, explain in plain language: the main point first, short sentences, everyday words, and each technical term explained the first time. If you're in a project, take the examples from its code and its real names. Done when you know which rules to explain by.

2. **Set the topic.** With arguments, the topic is the argument without the format word. Without arguments, it's the last thing in the conversation. If the conversation is empty, ask. Done when you state the topic in one line.

3. **Investigate briefly:** where the learner starts from and what the sources say, without a subagent and without writing files.
   - **Background:** if what you read in step 1 or the conversation already shows what they know about the topic, move on. If not, ask 1 or 2 short questions that check it, instead of asking whether they know it: what someone thinks they know and what they actually know don't always match.
   - **Sources:** consult 1 to 3 sources using the criteria in step 3 of `../investigate/research-sources.md` and cite them in the output. If the topic comes from the project's code, that code is the main source.

   Done when you know where they start from and each fact you'll give has its source.

4. **Set the format.** If the argument starts with `text`, `diagram`, `html` or `video`, use that one. If not, ask and recommend the one that fits best:
   - **Text:** one idea or a short answer.
   - **Diagram:** parts and how they connect, a flow, a hierarchy, a procedure.
   - **HTML:** something to explore, compare or interact with.
   - **Video:** a process that changes over time.

   Done when there is a format.

5. **Set what the learner takes away.** Write for yourself one to three ideas that the learner must be able to repeat in their own words at the end, from the one that matters most to the one that matters least. Done when each idea fits in one sentence and together they answer the topic.

6. **Make it.**
   - **Text:** in the chat, as long as the ideas from step 5 require.
   - **Diagram:** follow `diagram.md`, in the chat.
   - **HTML:** follow `html.md`.
   - **Video:** follow `../videos/SKILL.md` and come back here with what it delivers.

   Files go to the path the learner gives or, if none, to the current folder; always give the full path of each file created. Done when each idea from step 5 appears in the output.
