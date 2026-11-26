---
name: agency-workflow
description: Entry point for Agency-Flow. Use when the user asks to start a new task, project, or initiative that should follow the two-gate methodology. Captures the intent, decides whether RESEARCH applies, creates the workspace with `flow init`, and hands off to the correct next skill. Never writes a phase artifact.
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
phase artifacts; it produces the workspace, the job id, and the routing
decision that the next skill depends on.

## What it does

1. Asks the user for a **one-sentence intent** (what and why).
2. If the answer is longer than one sentence, asks for compression.
   Repeatedly, until it is one sentence.
3. Derives a **kebab-case job id** (2–64 characters: lowercase letters,
   digits, and single hyphens; no dates, no owner names).
4. Verifies the job id is unique against `docs/agency-flow/`. If taken,
   appends `-v2`; never overwrites.
5. Runs `flow init <job-id> --intent "<one sentence>"`. The engine creates
   the canonical workspace and leaves the run `awaiting-approval`.
6. Makes a **routing decision**:
   - *Research needed?* Default `no`. Set `yes` only if the FRAME goal
     would otherwise rest on an assumption the team has not validated.
   - *Measure needed?* Default `no`. Set `yes` only if post-launch
     outcomes must be tracked against a metric.
7. Records both decisions as provisional. FRAME will finalize them.

## Hard rules

- Do **not** create phase artifacts by hand. `flow init` creates the
  workspace skeleton; each phase fills its own artifact.
- The engine writes a stub `00-intent.md`. Do **not** complete it here;
  hand off to `agency-frame`.
- Do **not** accept a multi-sentence intent. The goal in FRAME must be a
  single intent; capture it now.
- Do **not** accept a job id with dates (`2026-04-15`), owner names, or
  uppercase/underscores. `flow init` will reject it.

## Refusal conditions

- Intent is a list of tasks → refuse; ask for the single underlying goal.
- Intent is domain-first ("build a landing page") with no *why* → refuse;
  ask for the outcome.
- Job id collides and user wants to overwrite → refuse; propose `-v2`.

## Output

- Workspace: `docs/agency-flow/<job-id>/`, created by `flow init`, with
  `workflow-state.md` at `awaiting-approval`.
- Job id confirmed.
- Routing decision: `research? yes|no`, `measure? yes|no`.
- A one-paragraph task brief held in memory, to be persisted by FRAME.

## Handoff

- If `research? yes` → `agency-research` with: job id, intent, and
  the provisional `research? yes`.
- Otherwise → `agency-frame` with: job id, intent, and both
  provisional flags.

## References

Load from `references/`:

- `task-initialization.md` — **always**. Protocol for intent → job id → workspace.
- `domain-profile-decision.md` — **always**. Three questions that decide
  the Domain profile.
- `slug-conventions.md` — when the derived job id is not obviously unique or
  is longer than a few words.
