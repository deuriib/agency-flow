# Workspace Format

Agency-Flow runs every job inside a self-contained workspace. The layout is
machine-readable, numerically ordered, and resumable: an orchestrator can stop
at any point and pick the run back up from `workflow-state.md` without asking
the user what happened.

This document is the contract. The engine in `src/workspace/` implements it, and
`flow validate` enforces it.

## Root and job id

The workspace root defaults to `docs/agency-flow/` and can be overridden with
`--root` or the `AGENCY_FLOW_WORKSPACE_ROOT` environment variable.

A job id is the directory name. It must be:

- 2–64 characters
- lowercase letters, digits, and single hyphens only (kebab-case)
- free of path separators, dots, and leading/trailing hyphens

`issue-9-workspace-standardization` is valid. `Issue 9`, `../etc`, and
`issue_9` are rejected.

## Layout

```text
docs/agency-flow/<job-id>/
├── workflow-state.md          # DAG state + checkpoints — single source of truth
├── 00-intent.md               # FRAME: request, goal, criteria, scope, domain profile
├── 01-proposal.md             # PROPOSE: approach, deliverables, risks + HITL approval
├── 02-specs/                  # per-division specs (engineering-spec.md, ...)
├── 03-artifacts/              # BUILD log + intermediate agent artifacts
├── 04-tasks/                  # atomic tasks, one YAML file per task
├── 05-deliverables/           # SHIP outputs
├── 06-validation/             # VERIFY reports and Evaluator-Optimizer evidence
├── 00-research.md             # optional — only when FRAME declares research? yes
└── 07-measure.md              # optional — only when FRAME declares measure? yes
```

Nothing else belongs at the workspace root. A file without a two-digit prefix
is a layout error, and `flow validate` fails on it. An entry that does start with
a two-digit prefix (`NN-`) is allowed, so a new artifact kind takes the next
free number (e.g. `08-changelog.md`) instead of inserting a letter suffix.

`00-research.md` is an optional pre-phase that shares the `00` ordinal with
`00-intent.md`: when FRAME declares `research? yes`, research runs first and its
artifact sits beside the intent. Order is by phase, not by filename.

### Prefix rule

Every artifact file and directory at the root starts with `NN-`, where `NN` is
a two-digit ordinal. New artifact kinds are added by taking the next free
number, never by inserting a letter suffix. `workflow-state.md` is the single
exception: it is engine state, not an artifact.

### Phase mapping

The 5+2 methodology is unchanged; the artifacts moved.

| Phase | Canonical artifact | Gate |
| --- | --- | --- |
| Research (optional) | `00-research.md` | Domain + Process |
| Frame | `00-intent.md` | Domain + Process |
| Propose | `01-proposal.md` | Domain + Process, plus human approval |
| Build | `03-artifacts/build-log.md`, `02-specs/`, `04-tasks/` | Process only |
| Verify | `06-validation/verify-report.md` | Domain (independent) + Process |
| Ship | `05-deliverables/ship-notes.md` | Process only |
| Measure (optional) | `07-measure.md` | Domain + Process |

## `workflow-state.md`

The engine reads and writes this file. Do not hand-edit it during a run; change
the plan through the CLI so the state stays consistent with the files.

```markdown
---
job_id: issue-9
status: awaiting-approval
current_phase: propose
created_at: 2026-11-25T00:00:00.000Z
updated_at: 2026-11-25T00:00:00.000Z
---

# Workflow State — issue-9

## Steps

| # | Step | Phase | Owner | Status | Attempts | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | research | research | - | skipped | 0 | - |
| 2 | intent | intent | orchestrator | done | 0 | 00-intent.md |
| 3 | proposal | propose | orchestrator | awaiting-approval | 0 | 01-proposal.md |
| 4 | build | build | - | pending | 0 | - |
| 5 | verify | verify | - | pending | 0 | - |
| 6 | ship | ship | - | pending | 0 | - |
| 7 | measure | measure | - | skipped | 0 | - |

## Checkpoints

| At | Phase | Note |
| --- | --- | --- |
| 2026-11-25T00:00:00.000Z | intent | Workspace created |
```

| Field | Allowed values |
| --- | --- |
| workflow `status` | `draft`, `awaiting-approval`, `running`, `blocked`, `done` |
| step `status` | `pending`, `awaiting-approval`, `running`, `done`, `failed`, `blocked`, `skipped` |
| step `attempts` | integer `0`–`3` |

`attempts` is the Producer ↔ Validator retry counter. A step that fails three
times becomes `blocked` and is escalated; it is never silently skipped.

## Task files

One task per file, named after its id: `04-tasks/T-001.yaml`. The `phase` field
must be one of `research`, `intent`, `propose`, `build`, `verify`, `ship`, or
`measure`.

```yaml
id: T-001
title: Create the workspace skeleton
phase: build
owner: general
validator: engineering-review-reliability
status: pending
attempts: 0
depends_on: []
acceptance_criteria:
  - criterion: Directories 02-specs through 06-validation exist
    evidence: ls output in 06-validation/T-001.txt
notes: Optional free text.
```

| Field | Required | Rule |
| --- | --- | --- |
| `id` | yes | `T-000` format, unique, must equal the file name |
| `title` | yes | non-empty |
| `phase` | yes | one of the 5+2 phases |
| `owner` | yes | the producer agent |
| `validator` | yes | the validating agent; **must differ from `owner`** |
| `status` | yes | `pending`, `running`, `passed`, `failed`, `blocked` |
| `attempts` | yes | integer `0`–`3` |
| `depends_on` | yes | array of task ids; must exist; no cycles |
| `acceptance_criteria` | yes | non-empty array of `{criterion, evidence}` |
| `notes` | no | string |

The YAML subset the engine accepts is deliberately small: scalars, inline
arrays, and block sequences. Tabs, duplicate keys, and unknown fields are
rejected rather than guessed at.

## Human-in-the-Loop gate

`01-proposal.md` starts as `status: draft`. The run is blocked until a named
human approves it:

```bash
flow approve issue-9 --by "Deuri Vasquez" --note "Layout migration approved."
```

Until then, `flow resume issue-9` exits `3` and names the required action. The
CLI requires a non-empty named approver, and the agent must not run it on its
own behalf — the approval records who decided, and that record is the point.

## Resume and checkpointing

```bash
flow resume issue-9
```

- Unapproved proposal → exit `3`, no progress.
- Otherwise prints the first unfinished step.
- A `blocked` step → exit `1` and an escalation message.
- All steps done → reports the run complete.

Because `workflow-state.md` is written on every transition, a crashed process
resumes from the last recorded step instead of restarting the run.

## CLI

```bash
flow init <job-id> [--intent "text"] [--root dir]
flow approve <job-id> --by "Name" [--note "text"] [--root dir]
flow step <job-id> --step <name> --status <status> [--owner "Name"] [--evidence "path"] [--attempts n] [--note "text"] [--root dir]
flow resume <job-id> [--root dir]
flow validate <job-id> [--root dir] [--json]
flow task add <job-id> <file.yaml> [--root dir]
flow task list <job-id> [--root dir] [--json]
flow migrate <dir> [--write]
```

| Exit code | Meaning |
| --- | --- |
| `0` | success |
| `1` | validation or runtime error |
| `2` | usage error |
| `3` | blocked on human approval |

`flow validate` checks the required entries, the numeric-prefix rule, the state
file, the task schema, dependency cycles, and the proposal/state consistency
in both directions (including a non-empty named approver when the run is running
or done).

`flow step` records a DAG transition. `failed` increments the step's attempt
counter and turns the step (and the run) `blocked` on the third failure. `done`
requires `--evidence`. `build`, `verify`, `ship`, and `measure` cannot be set
`running` or `done` before `01-proposal.md` is approved (exit `3`). The
proposal step is closed only by `flow approve`, never by `flow step`.

## Migrating a legacy workspace

A flat phase directory is converted in place:

```bash
node scripts/migrate-workspace.mjs docs/agency-flow/<slug>          # dry run
node scripts/migrate-workspace.mjs docs/agency-flow/<slug> --write  # apply
```

| Legacy | Canonical |
| --- | --- |
| `00-frame.md` | `00-intent.md` |
| `01-propose.md` | `01-proposal.md` |
| `02-build.md` | `03-artifacts/build-log.md` |
| `03-verify.md` | `06-validation/verify-report.md` |
| `04-ship.md` | `05-deliverables/ship-notes.md` |
| `05-measure.md` | `07-measure.md` |

The migration is idempotent, never deletes content, and reports a conflict
instead of overwriting a target that already exists. It reconstructs
`workflow-state.md` from the files present so the migrated run is resumable.
It also adds the frontmatter block that `flow approve` needs to a migrated
`01-proposal.md`.

## Why the workspace lives in the repository

The issue originally proposed an absolute `/workspace/{job-id}/`. The engine
writes under `docs/agency-flow/` instead: the workspace travels with the
repository, needs no elevated permissions, and keeps the phase artifacts and
the state that describes them in one place.
