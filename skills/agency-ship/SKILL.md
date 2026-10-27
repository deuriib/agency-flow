---
name: agency-ship
description: Fifth mandatory phase of Agency-Flow. Use when agency-verify has closed with PASS or PASS-WITH-CONDITIONS. Produces docs/agency-flow/<slug>/04-ship.md — user-facing release notes, version/tag, changelog, references to all four prior phases, and follow-ups carried from VERIFY. Domain gate is always N/A here; it was passed at VERIFY.
---

# Agency-Flow — SHIP

## Flow

```
previous: agency-verify — required
next:     agency-measure  (if FRAME declared measure? yes)
          none — this task is complete (if measure? no)
```

## Purpose

Deliver the artifact. SHIP consumes an artifact already verified in
VERIFY. Its job is publication, documentation, and closure — not quality
judgment.

## What it does

1. Reads `03-verify.md`. Confirms the verdict is `PASS` or
   `PASS-WITH-CONDITIONS`.
2. Opens `docs/agency-flow/<slug>/04-ship.md`.
3. Writes:
   - **Release notes** in user-facing language (not dev jargon).
   - **Version / tag** following the repo's convention.
   - **Changelog** covering every artifact in `02-build.md`.
   - **References** — all four prior phase files, with VERIFY's verdict
     quoted exactly.
   - **`## Follow-ups carried from VERIFY`** — every VERIFY condition,
     with owner and due date.
4. Fills `## Assigned team` and `## Gates` — the Gates block **must**
   show `Domain gate: N/A — passed at VERIFY`.
5. Signs only the process gate.

## Hard rules

- Domain gate in SHIP is always `N/A`. If a domain gate appears, VERIFY
  did not close and SHIP is blocked.
- VERIFY verdict is quoted exactly. `PASS-WITH-CONDITIONS` is never
  paraphrased as `PASS`.
- Every VERIFY condition is carried as a follow-up with owner and date.
  Missing conditions block the process gate.
- Changelog is a bijection with BUILD's `## Artifacts produced` (modulo
  grouping). Missing or extra entries fail the process gate.
- No new work is introduced in SHIP. New scope reopens FRAME or becomes a
  MEASURE follow-up.

## Refusal conditions

- No `03-verify.md` exists → refuse; hand back to `agency-verify`.
- VERIFY verdict is `FAIL` → refuse; SHIP cannot open.
- A VERIFY condition has no owner or date → refuse; conditions must be
  complete before SHIP closes.
- Changelog does not match BUILD's artifacts → refuse; state the
  mismatch.

## Output

- `docs/agency-flow/<slug>/04-ship.md`, complete.
- Process gate `PASS` (or `PENDING` with reasons).
- Follow-ups ready to be carried into MEASURE (if applicable) or into the
  backlog.

## Handoff

- If FRAME declared `measure? yes` → `agency-measure` with: slug,
  the SHIP file path, the follow-up list, and the measurement window.
- If `measure? no` → task complete; report slug and closure.

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `04-ship.md`.
- `checklist.md` — **always**. Process-gate-only checklist; there is no
  domain gate in SHIP.
- `anti-patterns.md` — when VERIFY conditions are missing from
  `## Follow-ups carried from VERIFY`, or the VERIFY verdict is
  paraphrased.
- `example-engineering.md` — when `Deliverable type` is `code` or `doc`.
- `example-marketing.md` — when `Deliverable type` is `campaign`,
  `content`, `design`, `launch`, or `research`.
