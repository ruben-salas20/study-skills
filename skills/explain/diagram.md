# Text diagrams

The learner reads the chat in a terminal: Mermaid shows up as code without drawing. Choose the smallest view that keeps the idea clear, put it next to the sentence that supports it, and show only the elements the idea needs.

- **Flow or relationship between parts:** box diagram in a `text` block. Before showing it, run it through `python3 <this skill's folder>/check-diagram.py` and fix each line it flags until it says `0 errors`. Then read each arrow and confirm it reaches the right box. Paste the final diagram into your answer: the learner doesn't see the output of the commands.

  ```text
  ┌──────┐  light, water, CO₂  ┌─────────────┐  glucose  ┌────────┐
  │ Leaf ├────────────────────►│ Chloroplast ├──────────►│ Plant  │
  └──────┘                     └──────┬──────┘           └────────┘
                                      │ releases
                                      ▼
                                    ┌────┐
                                    │ O₂ │
                                    └────┘
  ```

- **Hierarchy or classification:** tree.

  ```text
  Real numbers
  ├── Rational
  │   ├── Integers
  │   └── Fractions
  └── Irrational (√2, π)
  ```

- **Procedure or algorithm:** pseudocode, one step per line.

  ```text
  solve ax² + bx + c = 0
    compute Δ = b² − 4ac
    if Δ < 0: no real solutions
    else: x = (−b ± √Δ) / 2a
  ```

- **Comparing two or more things:** table.

- **Programming topics:** also a `diff` when what changed matters, or a file tree with the responsibility of each file.
