# Agency-Flow Guide

Agency-Flow is a sequential 5+2 phase methodology designed to take any intent to a release across any `agency-agents` division. Every job runs inside a standardized workspace under `docs/agency-flow/<job-id>/`, with `workflow-state.md` as the single source of truth for orchestration.

## Core Principles

1. **Sequential Progression:** One phase = one canonical artifact. No phase may be skipped. Optional phases (`research` and `measure`) must be explicitly declared `yes` or `no` in FRAME.
2. **The Two-Gate Model:** Every phase requires two gates:
   - **Domain Gate:** Asks "Is the artifact good?" Signed by a competent agent in that phase's domain (and never by the builder in VERIFY).
   - **Process Gate:** Asks "Was the phase done correctly?" Signed by a Project Management process steward.
3. **Project Management as Process Steward:** PM participates in every phase in exactly one mode: process steward. PM never leads a domain, never signs a domain gate, and does not produce artifacts the project is judged on (except in the PM-as-deliverable edge case where a different PM signs the process gate).
4. **Verifier Independence:** In VERIFY, the verifier must not be the agent that built the artifact.
5. **Artifacts as Contract:** Roles are interchangeable; artifacts are the single source of truth.
6. **State is Persisted:** `workflow-state.md` records every DAG step, its attempt count, and its evidence. A failed run resumes with `flow resume <job-id>` instead of restarting.
7. **Human-in-the-Loop:** `01-proposal.md` is a blocking gate. No agent advances past PROPOSE until a named human approves it.

## Workspace Layout

```text
docs/agency-flow/<job-id>/
├── workflow-state.md          # DAG state + checkpoints
├── 00-intent.md               # FRAME
├── 01-proposal.md             # PROPOSE (+ human approval)
├── 02-specs/                  # per-division specs
├── 03-artifacts/              # BUILD log + intermediate artifacts
├── 04-tasks/                  # atomic YAML tasks
├── 05-deliverables/           # SHIP outputs
├── 06-validation/             # VERIFY reports
├── 00-research.md             # optional
└── 07-measure.md              # optional
```

Every artifact at the workspace root carries a two-digit prefix (`00-`, `01-`, ...). The full contract — job-id rules, task schema, state file format, CLI, migration mapping — lives in [`workspace-format.md`](./workspace-format.md).

## Phase Overview

| Phase | Canonical artifact | Optional? | Gates | Primary Focus |
|---|---|---|---|---|
| 0 — Research | `00-research.md` | Yes (declared in FRAME) | Domain + Process | Discovery, questions, cited sources |
| 1 — Frame | `00-intent.md` | No | Domain + Process | Goal, measurable criteria, scope, domain profile |
| 2 — Propose | `01-proposal.md` | No | Domain + Process + human approval | Architecture, deliverables, risks, dependencies |
| 3 — Build | `03-artifacts/build-log.md`, `02-specs/`, `04-tasks/` | No | Process only (Domain N/A) | Implementation log, artifacts, deviations, handoffs |
| 4 — Verify | `06-validation/verify-report.md` | No | Domain (Independent) + Process | Independent QA review, verdict, evidence |
| 5 — Ship | `05-deliverables/ship-notes.md` | No | Process only (Domain N/A) | Release notes, tag, changelog, follow-ups |
| 6 — Measure | `07-measure.md` | Yes (declared in FRAME) | Domain + Process | Metrics, outcome vs FRAME, learnings, backlog |

## Running a Job

```bash
flow init issue-9 --intent "Standardize the workspace layout."
# edit 01-proposal.md, then:
flow approve issue-9 --by "Your Name"
flow resume issue-9
flow step issue-9 --step build --status done --evidence 03-artifacts/build-log.md
flow validate issue-9
```

`flow init` creates the workspace and leaves the run `awaiting-approval`. `flow resume` refuses to advance until the proposal is approved by a named human. See [`workspace-format.md`](./workspace-format.md) for the full CLI and exit codes.

## Examples

- Minimal engineering feature: `docs/agency-flow/example-engineering-feature/`
- Full marketing campaign: `docs/agency-flow/example-marketing-campaign/`
