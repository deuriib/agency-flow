---
name: agency-research
description: Optional first phase of Agency-Flow. Use when agency-flow has routed a task to research (research? yes). Produces docs/agency-flow/<slug>/00-research.md with cited findings tied to FRAME criteria previews. Refuses to run if research was not declared.
---

# Agency-Flow — RESEARCH

## Flow

```
previous: agency-flow — required
next:     agency-frame — required
```

## Purpose

Answer the questions that FRAME would otherwise invent. Produce evidence
that later phases will rely on. RESEARCH never decides the goal; it
informs it.

## What it does

1. Opens `docs/agency-flow/<slug>/00-research.md` (creates if missing).
2. Writes 1–5 **research questions**, each specific and answerable.
3. Collects **sources** for each question (URL, file path, interview ID
   — never "industry knowledge").
4. Writes **findings** with concrete numbers or quotes.
5. Adds a **`## Findings → FRAME criteria (preview)`** section mapping
   every question to a criterion FRAME will soon declare (or explicitly
   marking the finding as PROPOSE-informative).
6. Fills `## Assigned team` with domain agents + process steward.
7. Fills `## Gates`:
   - Domain gate → the researcher who owns the findings.
   - Process gate → the PM agent.
8. Signs both gates or leaves them `PENDING` with the specific failure.

## Hard rules

- Every research question must map to at least one FRAME criterion
  preview. Orphan questions fail the process gate.
- Every finding must cite a specific source. "Team experience" is not a
  source.
- Findings are **facts**, not recommendations. Recommendations belong in
  PROPOSE.
- `## Gates` must be present with both lines.

## Refusal conditions

- FRAME has not declared `research? yes` (i.e., `agency-flow` did not
  route here) → refuse. State the missing declaration and offer to hand
  off to `agency-frame`.
- The user asks to "just write some findings" without questions → refuse;
  questions come first.
- More than 5 questions → refuse; the goal is unclear; compress first.

## Output

- `docs/agency-flow/<slug>/00-research.md`, complete.
- Both gates `PASS` (or explicit `PENDING` with reasons).
- A stated `## Findings → FRAME criteria` preview that FRAME will read.

## Handoff

→ `agency-frame` with: slug, the research file path, and a note
that the FRAME domain profile must record `research? yes`.

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `00-research.md`.
- `checklist.md` — **always**. Gate checklist; run before signing either gate.
- `anti-patterns.md` — when the phase file feels "done" but a gate is failing.
- `example-marketing.md` — when the project's `Deliverable type` is
  `campaign`, `content`, `launch`, or anything non-code.

If FRAME did not declare `research? yes`, refuse to run this skill and
state the missing declaration.