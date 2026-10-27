---
name: agency-frame
description: First mandatory phase of Agency-Flow. Use when agency-flow has routed a task here directly, or when agency-research has closed. Produces docs/agency-flow/<slug>/00-frame.md — goal, measurable criteria, scope, domain profile, and both gates. The single most important file in the methodology.
---

# Agency-Flow — FRAME

## Flow

```
previous: agency-flow           (if research was not needed)
          agency-research  (if research was needed)
next:     agency-propose — required
```

## Purpose

Convert an intent into a written goal, measurable success criteria, and
an explicit Domain profile that every later phase will read. FRAME is the
contract that VERIFY will check against.

## What it does

1. Reads the intent and any research file produced by
   `agency-research`.
2. Opens `docs/agency-flow/<slug>/00-frame.md`.
3. Writes:
   - **Goal** (1–3 sentences, single intent, outcome-shaped).
   - **Success criteria** (≥ 2, each with a number or verifiable state).
   - **Scope** (In and Out, both non-empty).
   - **Domain profile** — `Domains involved`, `Deliverable type`,
     `Optional phases: research? yes|no — measure? yes|no`.
   - **Constraints** (each with a number or verifiable state).
4. Fills `## Assigned team` with domain agents + process steward.
5. Fills `## Gates` and signs both, or leaves `PENDING` with the exact
   failure.

## Hard rules

- Goal must fit in ≤ 3 sentences. Two intents = two projects.
- Criteria must be checkable from an artifact or a metric. "Better UX" is
  not a criterion.
- `Scope.Out` must name at least one explicit exclusion.
- Domain profile lists **producer** domains only — not review-only
  divisions.
- `research?` and `measure?` must be explicit `yes` or `no`. If
  `agency-flow` routed through research, record `research? yes`.
- Staffing must be confirmed against the available agent roster before
  the process gate can be signed.

## Refusal conditions

- Intent arrives without a slug → refuse; hand back to `agency-flow`.
- Goal cannot fit in 3 sentences → refuse; ask the user to pick one
  intent.
- Fewer than 2 measurable criteria → refuse.
- `Scope.Out` would be empty → refuse; name one exclusion.
- Domain profile lists a review-only division → refuse; producer domains
  only.

## Output

- `docs/agency-flow/<slug>/00-frame.md`, complete.
- Both gates `PASS` (or `PENDING` with named failures).
- A domain profile every downstream phase will read.

## Handoff

→ `agency-propose` with: slug, the FRAME file path, and the Domain
profile (explicitly restated in the handoff message so PROPOSE does not
have to re-read the file to start).

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `00-frame.md`.
- `checklist.md` — **always**. Gate checklist; run before signing either gate.
- `domain-profile-guide.md` — **always**. Decides the three fields
  downstream phases read.
- `anti-patterns.md` — when criteria look qualitative or `Scope.Out` is empty.
- `example-engineering.md` — when `Deliverable type` is `code` or `doc`.
- `example-marketing.md` — when `Deliverable type` is `campaign`,
  `content`, `design`, `launch`, or `research`.

For the PM-as-deliverable edge case (`Deliverable type: pm-work`), also
load `skills/agency-steward/references/pm-edge-case.md`.