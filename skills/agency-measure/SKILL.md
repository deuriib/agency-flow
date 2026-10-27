---
name: agency-measure
description: Optional final phase of Agency-Flow. Use when agency-ship has closed and FRAME declared measure? yes. Produces docs/agency-flow/<slug>/05-measure.md — metrics against targets, per-criterion outcome vs FRAME, learnings grounded in numbers, and follow-ups ingested into a backlog. Refuses to run if measure was not declared.
---

# Agency-Flow — MEASURE

## Flow

```
previous: agency-ship — required
next:     none — this task is complete
```

## Purpose

Check whether the shipped artifact delivered what FRAME promised.
MEASURE is the phase for honest retrospective — misses are reported as
misses, not softened.

## What it does

1. Opens `docs/agency-flow/<slug>/05-measure.md`.
2. Writes:
   - **`## Metrics collected`** — every metric as
     `<metric>: <value> (target <n> — <outcome>)`.
   - **`## Per-criterion outcome vs FRAME`** — one row per FRAME
     criterion, `observed / target → outcome`.
   - **`## Learnings`** — each backed by a number from `Metrics
     collected`.
   - **`## Follow-ups`** — each with an owner and
     `Ingested: yes | no`.
3. Fills `## Assigned team` and `## Gates`; signs both or leaves
   `PENDING`.

## Hard rules

- Every metric has a target. A number without a target is decoration.
- Every learning cites a metric. "The campaign was well received" is not
  a learning.
- Every FRAME criterion appears in the outcome table. Including the ones
  that missed.
- Every follow-up has an owner and an `Ingested: yes | no` flag. `yes`
  requires the backlog entry ID or link. `no` requires the reason.
- Misses are reported as misses. MEASURE is not a marketing document.

## Refusal conditions

- FRAME did not declare `measure? yes` → refuse; state the missing
  declaration and offer to close the task at SHIP.
- A metric has no target → refuse.
- A learning has no number behind it → refuse.
- A follow-up has no owner → refuse.

## Output

- `docs/agency-flow/<slug>/05-measure.md`, complete.
- Both gates `PASS` (or `PENDING` with reasons).
- Every follow-up ingested into a backlog with an owner.

## Handoff

None. This skill closes the task. Report: slug, final outcome vs FRAME
(met / missed / exceeded per criterion), and the ingested follow-up list.

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `05-measure.md`.
- `checklist.md` — **always**. Two-gate checklist; both gates apply.
- `anti-patterns.md` — when metrics lack targets, learnings lack numbers,
  or follow-ups lack owners.
- `example-marketing.md` — when `Deliverable type` is `campaign`,
  `content`, `launch`, or any post-launch measurement project.

If FRAME did not declare `measure? yes`, refuse to run this skill and
state the missing declaration.
