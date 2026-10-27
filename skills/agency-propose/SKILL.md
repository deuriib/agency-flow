---
name: agency-propose
description: Second mandatory phase of Agency-Flow. Use when agency-frame has closed. Produces docs/agency-flow/<slug>/01-propose.md — approach with a rejected alternative, deliverables grouped by domain, risks with mitigations, verification plan per criterion, and cross-domain dependencies with owner + date. No artifact is produced here.
---

# Agency-Flow — PROPOSE

## Flow

```
previous: agency-frame — required
next:     agency-build — required
```

## Purpose

Decide **what will be produced, by whom, by when, and how it will be
verified** before any artifact exists. PROPOSE is the plan that BUILD
executes and VERIFY checks against.

## What it does

1. Reads `00-frame.md`. Extracts the goal, criteria, domain profile, and
   constraints.
2. Opens `docs/agency-flow/<slug>/01-propose.md`.
3. Writes:
   - **Approach** — 2–4 sentences plus one rejected alternative and why.
   - **Planned deliverables**, grouped by domain, each naming the FRAME
     criterion it supports.
   - **Risks** — each with a mitigation and a severity.
   - **Verification plan** — one row per FRAME criterion, naming the
     domain that will verify it.
   - **Cross-domain dependencies** — `<what> — Owner: <agent> — Due: <date>`
     format. No exceptions.
4. Fills `## Assigned team` and `## Gates`; signs or leaves `PENDING`.

## Hard rules

- Every FRAME criterion must appear under at least one planned
  deliverable.
- Every deliverable must name the criterion it supports.
- Every cross-domain dependency must have an owner and a due date.
  Malformed lines fail the process gate.
- The approach must state a rejected alternative. A plan without a
  rejected alternative is a restatement, not a decision.
- Any scope change revealed by PROPOSE is recorded as `## Deviations from
  FRAME` and FRAME is reopened — not absorbed silently.

## Refusal conditions

- No `00-frame.md` exists → refuse; hand back to `agency-frame`.
- FRAME criteria cannot be satisfied by any deliverable → refuse; reopen
  FRAME.
- A dependency has no owner or no date → refuse; PROPOSE does not close.
- No verification plan → refuse; VERIFY cannot function without one.

## Output

- `docs/agency-flow/<slug>/01-propose.md`, complete.
- Both gates `PASS` (or `PENDING` with reasons).
- A dependency plan with every row owning an agent and a date.

## Handoff

→ `agency-build` with: slug, the PROPOSE file path, and the
deliverable list restated by domain.

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `01-propose.md`.
- `checklist.md` — **always**. Gate checklist; run before signing either gate.
- `dependency-format.md` — **always**. Cross-domain dependency lines are
  grepped by the process steward; a malformed line fails the process gate.
- `anti-patterns.md` — when deliverables do not map to criteria, or
  dependencies lack owners.
- `example-engineering.md` — when `Deliverable type` is `code` or `doc`.
- `example-marketing.md` — when `Deliverable type` is `campaign`,
  `content`, `design`, `launch`, or `research`.