---
name: agency-build
description: Third mandatory phase of Agency-Flow. Use when agency-propose has closed. Produces docs/agency-flow/<slug>/02-build.md — one log row per FRAME criterion with the artifact that satisfies it, deviations from PROPOSE, artifacts grouped by domain, and handoffs marked Done or Pending. Domain gate is always N/A here.
---

# Agency-Flow — BUILD

## Flow

```
previous: agency-propose — required
next:     agency-verify — required
```

## Purpose

Produce the artifacts PROPOSE approved. BUILD is production, not review.
The domain gate is `N/A` by design — domain quality is verified in
`agency-verify` by an independent agent.

## What it does

1. Reads `01-propose.md`. Extracts the deliverable list, verification
   plan, and dependency graph.
2. Opens `docs/agency-flow/<slug>/02-build.md`.
3. Writes:
   - **`## Log`** — one row per FRAME criterion, formatted as
     `- [x] <criterion label> → <artifact path or URL>`.
   - **`## Deviations from PROPOSE`** — one line per deviation with a
     justification, or `None`.
   - **`## Artifacts produced`**, grouped by domain.
   - **`## Cross-domain handoffs`** — each marked `Done` or `Pending`.
4. Fills `## Assigned team` and `## Gates` — the Gates block **must**
   show `Domain gate: N/A — deferred to VERIFY`.
5. Signs only the process gate.

## Hard rules

- Domain gate in BUILD is always `N/A`. A BUILD file with `Domain gate:
  PASS` is malformed; refuse to sign.
- Every FRAME criterion gets a log row. No exceptions, no `[~]`, no `[/]`
  — only `[x]` or `[ ]`.
- Every log row points to a concrete path or URL. "See PR" is not a
  pointer.
- Every deviation is recorded, not absorbed.
- Every handoff is `Done` or `Pending`. No third state.

## Refusal conditions

- No `01-propose.md` exists → refuse; hand back to `agency-propose`.
- A FRAME criterion has no log row → refuse; the file is not closeable.
- A deviation is described as "minor" with no detail → refuse; state what
  changed.
- A new deliverable appears that PROPOSE did not list → refuse; record it
  as a deviation or reopen PROPOSE.

## Output

- `docs/agency-flow/<slug>/02-build.md`, complete.
- Process gate `PASS` (or `PENDING` with reasons).
- All handoffs resolved.

## Handoff

→ `agency-verify` with: slug, the BUILD file path, and a list of
every agent that produced an artifact (required for the independence
check in VERIFY).

## References

Load from `references/`:

- `template.md` — **always**. Canonical shape of `02-build.md`.
- `checklist.md` — **always**. Process-gate-only checklist; there is no
  domain gate in BUILD.
- `criterion-log-format.md` — **always**. The `## Log` rows are grepped;
  malformed rows fail the process gate.
- `anti-patterns.md` — when the file feels complete but deviations are not
  recorded.
- `example-engineering.md` — when `Deliverable type` is `code` or `doc`.
- `example-marketing.md` — when `Deliverable type` is `campaign`,
  `content`, `design`, `launch`, or `research`.
