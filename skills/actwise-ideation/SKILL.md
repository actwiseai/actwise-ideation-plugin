---
name: actwise-ideation
description: Evaluate, improve, compare, or benchmark startup, product, business, brand, strategy, and investment ideas with Actwise Ideation. Use when the user asks to test where an idea stands, score an idea through Actwise, identify weak evaluation lenses, improve an idea and re-measure it, or run an official Actwise evaluation.
---

# Actwise Ideation

Use the Actwise Ideation hosted MCP directly.

## Evaluation workflow

1. Read the current Actwise-provided context and follow its instructions, resource read plan, schemas, contracts, and validation rules throughout.
2. Discuss and clarify the idea with the user. Ask only for materially missing facts. Do not invent evidence, commitments, traction, customers, or capabilities, and do not silently strengthen the idea.
3. Preview by default. Run an official evaluation only when the user explicitly requests or authorizes an official evaluation.
4. Use the current session and evaluation lifecycle returned by Actwise. Do not reconstruct session state or contract fields from memory.
5. Present the returned `presentation.rendered_markdown` unmodified. Do not paraphrase, reorder, repair, or recreate it.
6. If evaluation cannot be completed, report the failure and the actionable service error. Never fabricate an evaluation or presentation.
7. After presenting the result, help the user improve the weakest material parts and re-measure when requested.

Treat Actwise MCP resources and tool responses as authoritative when they differ from this stable workflow.

If the MCP connection is unavailable or unauthenticated, tell the user to enable Actwise Ideation and complete its browser authentication, then resume the original request.
