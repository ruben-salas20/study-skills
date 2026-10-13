# Visual resources in pages

If `<ROOT>/AGENTS.md` has its own rules for visual resources, those rules win.

None is used by default: each one has to show something the text alone can't (a circuit, the shape of a function, how several concepts connect, a procedure with branches). A three-step sequence, a definition or the comparison of two things goes in text or a table. Usually one per page, with one concept per resource.

| Resource | For | In Markdown pages |
|---|---|---|
| **Mermaid** | relationships where position doesn't matter: concept maps, flows with decisions, hierarchies, states | if the viewer in `AGENTS.md` draws it; if not, a text diagram from `diagram.md`. If it isn't stated, ask |
| **JavaScript** | exact things: circuits, graphs with real axes, geometry, vectors. Drawn with code, not hand-written SVG | in a separate HTML page, linked |
| **Excalidraw** | things that aren't just boxes and arrows: drawings, images, diagrams where the place of each part means something. In `.excalidraw` (JSON) format, if the viewer opens it | same |
| **3D** | when the third dimension is the information. Follow `../3d-scenes/SKILL.md` and come back here with what it delivers | embedded with `iframe` if the viewer supports HTML; otherwise linked |
| **Video** | a process that can't be understood without movement. Propose it before making it; afterwards, follow `../videos/SKILL.md` and come back here with what it delivers | embedded with `iframe` if the viewer supports HTML; otherwise linked |

A resource is interactive only when moving something teaches something: dragging a resistor and seeing how the voltage changes. In that case, show the working recalculating, not just the result. If not, it stays fixed. If the course has a kit, use its components.
