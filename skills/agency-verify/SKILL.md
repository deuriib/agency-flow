---
name: agency-verify
description: Fourth mandatory phase of Agency-Flow. Use when agency-build has closed. Produces docs/agency-flow/<slug>/03-verify.md — evidence per FRAME criterion, findings grouped by domain, and a two-line verdict (domain gate + process gate). The verifier must not be the builder; independence is checked before the file opens.
---

# Agency-Flow — VERIFY

## Flow

```
previous: agency-build — required
next:     agency-ship — required
```

## Purpose

Check every FRAME criterion against the BUILD artifacts, with evidence,
by an agent who did not build them. VERIFY is the only phase where domain
quality is judged.

## What it does

0. **Before opening the file**, runs the independence check
   (`independence-check.md`): reads the BUILD log, extracts every agent
   named, confirms the proposed verifier is not among them. If it is,
   refuses to open VERIFY and assigns a different verifier.
1. Opens `docs/agency-flow/<slug>/03-verify.md`.
2. Writes:
   - **`## Result per criterion`** — one row per FRAME criterion with
     `PASS`/`FAIL` and concrete evidence (test name, screenshot path,
     metric snapshot).
   - **`## Findings`**, grouped by domain, each with a severity.
   - **`## Verdict`** — two lines:
     `Domain gate: <verdict>` and `Process gate: <verdict>`.
   - **`## Conditions`** — if `PASS-WITH-CONDITIONS`, each with owner and
     due date.
3. Fills `## Assigned team` and `## Gates`.
4. Signs both gates or leaves `PENDING` with the failure named.

## Hard rules

- The verifier must not appear in the BUILD log. This is checked before
  anything else is written.
- Every row has evidence. `PASS` without evidence is not a `PASS`.
- A single `FAIL` row forces the domain-gate verdict to `FAIL`, even if
  every other row is `PASS`.
- Every condition under `PASS-WITH-CONDITIONS` has an owner and a due
  date. A condition without both is not a condition.
- Domain gate is never `N/A` in VERIFY. `N/A` here means VERIFY did not
  happen.

## Refusal conditions

- Verifier equals the builder → refuse; reassign, then reopen VERIFY.
- Any `PASS` without evidence → refuse; the row is not closed.
- Verdict is `PASS` but a `FAIL` row exists → refuse; the verdict is
  inconsistent.
- `PASS-WITH-CONDITIONS` with an unowned condition → refuse.

## Output

- `docs/agency-flow/<slug>/03-verify.md`, complete.
- Domain gate verdict: `PASS | PASS-WITH-CONDITIONS | FAIL`.
- Process gate verdict: `PASS | FAIL`.
- Conditions (if any) with owner and due date, ready to be carried into
  SHIP.

## Handoff

→ `agency-ship` with: slug, the VERIFY file path, the verdict,
and the exact list of conditions (each with owner + due date) that SHIP
must carry as follow-ups.

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `03-verify.md`.
- `checklist.md` — **always**. Two-gate checklist; the domain gate is not
  optional here.
- `independence-check.md` — **always, before opening the file**. Confirms
  the verifier is not the builder.
- `anti-patterns.md` — when every row says `PASS` with no evidence, or a
  condition has no owner.
- `example-engineering.md` — when `Deliverable type` is `code` or `doc`.
- `example-marketing.md` — when `Deliverable type` is `campaign`,
  `content`, `design`, `launch`, or `research`.

If `independence-check.md` fails, refuse to open VERIFY. Do not sign a
process gate over a self-verified artifact.
