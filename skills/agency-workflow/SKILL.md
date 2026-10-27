---
name: agency-workflow
description: Entry point for Agency-Flow. Use when the user asks to start a new task, project, or initiative that should follow the two-gate methodology. Captures the intent, decides whether RESEARCH applies, creates the task folder, and hands off to the correct next skill. Never writes a phase file.
---

# Agency-Flow (Entry)

## Flow

```
previous: none — this skill is the entry point
next:     agency-research  (if research is needed)
          agency-frame     (otherwise)
```

## Purpose

Turn a raw intent into a ready-to-frame task. This skill does not write
phase files; it produces the folder, the slug, and the routing decision
that the next skill depends on.

## What it does

1. Asks the user for a **one-sentence intent** (what and why).
2. If the answer is longer than one sentence, asks for compression.
   Repeatedly, until it is one sentence.
3. Derives a **kebab-case slug** (`2–5 words`, no dates, no names).
4. Verifies the slug is unique against `docs/agency-flow/`. If taken,
   appends `-v2`; never overwrites.
5. Creates `docs/agency-flow/<slug>/` (empty).
6. Makes a **routing decision**:
   - *Research needed?* Default `no`. Set `yes` only if the FRAME goal
     would otherwise rest on an assumption the team has not validated.
   - *Measure needed?* Default `no`. Set `yes` only if post-launch
     outcomes must be tracked against a metric.
7. Records both decisions as provisional. FRAME will finalize them.

## Hard rules

- Do **not** pre-create phase files. An empty file creates a false gate.
- Do **not** write `00-frame.md` from here. Hand off to `agency-frame`.
- Do **not** accept a multi-sentence intent. The goal in FRAME must be a
  single intent; capture it now.
- Do **not** accept a slug with dates (`2026-04-15`), owners, or > 5 words.

## Refusal conditions

- Intent is a list of tasks → refuse; ask for the single underlying goal.
- Intent is domain-first ("build a landing page") with no *why* → refuse;
  ask for the outcome.
- Slug collides and user wants to overwrite → refuse; propose `-v2`.

## Output

- Folder: `docs/agency-flow/<slug>/` (empty).
- Slug confirmed.
- Routing decision: `research? yes|no`, `measure? yes|no`.
- A one-paragraph task brief held in memory, to be persisted by FRAME.

## Handoff

- If `research? yes` → `agency-research` with: slug, intent, and
  the provisional `research? yes`.
- Otherwise → `agency-frame` with: slug, intent, and both
  provisional flags.

## References

Load from `references/`:

- `task-initialization.md` — **always**. Protocol for intent → slug → folder.
- `domain-profile-decision.md` — **always**. Three questions that decide
  the Domain profile.
- `slug-conventions.md` — when the derived slug is not obviously unique or
  is > 5 words.
