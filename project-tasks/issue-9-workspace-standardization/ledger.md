# Run Ledger — Issue #9: Standardized Workspace & State Persistence

## Run
| Field | Value |
| --- | --- |
| Run | `issue-9-workspace-standardization` |
| Mode | NEXUS-Micro (one deliverable, engine + docs) composed as two parallel pipelines |
| Started | 2026-11-25 |
| Orchestrator | AgentsOrchestrator |
| Repository | `deuriib/agency-flow` |
| Issue | [#9](https://github.com/deuriib/agency-flow/issues/9) — `priority:p0`, `enhancement` |

## Stage 1 — Intake & Classification

| Dimension | Value | Decision |
| --- | --- | --- |
| Domain(s) | `engineering` (runtime + CLI), `project-management` (methodology + docs) | Two pipelines |
| Deliverable | Code (zero-dependency ESM engine + CLI), tests, documentation, skills/rules migration | Producer ↔ Validator per task |
| Scale | NEXUS-Micro composed as two pipelines (P1 engine, P2 methodology/docs) | 1–2 day scope |
| Urgency | Normal. P0 label, but no production outage or active breach | No preemption |
| Inputs | Issue body, repo state, two human decisions (below) | Complete |

### Human decisions that shaped the plan
| Decision | Answer | Recorded |
| --- | --- | --- |
| Workspace root | `docs/agency-flow/{job-id}/` (not absolute `/workspace`) | Deuri Vasquez, 2026-11-25 |
| Relationship to existing methodology | **Migrate** phase artifacts into the standardized layout | Deuri Vasquez, 2026-11-25 |

## Stage 2 — Roster Discovery & Scenario Selection

Roster discovered from `~/.agency-agents/divisions.json` and the `engineering`, `project-management`, and `testing` divisions. Scenario catalog read from `~/.agency-agents/strategy/runbooks.json`.

| Need | Scenario / chain | Why |
| --- | --- | --- |
| Build the engine | NEXUS-Micro chain: `Backend Architect`-class producer → `Reliability Reviewer` + `Test Results Analyzer` | New runtime code, zero dependencies, must be deterministic |
| Migrate methodology + docs | NEXUS-Micro chain: producer → `Refuter Reviewer` + `Readability Reviewer` | Documentation is a contract here; drift is the risk |
| Final verdict | `Reality Checker` | Defaults to NEEDS WORK; needs overwhelming evidence |

No single catalog runbook fits a zero-dependency plugin repo with no runtime; `enterprise-feature` assumes live customers and a committed date, and `feature-discovery-to-spec` stops before implementation. A composed NEXUS-Micro chain is the correct choice.

### Roster (name + slug)
| Agent | Slug | Role |
| --- | --- | --- |
| AgentsOrchestrator | `agents-orchestrator` | Pipeline controller, ledger owner |
| (producer, engineering) | `general` | Engine, CLI, tests |
| (producer, docs) | `general` | Docs, rules, skills migration |
| Reliability Reviewer | `engineering-review-reliability` | P1 validator |
| Test Results Analyzer | `testing-test-results-analyzer` | P1 validator |
| Refuter Reviewer | `review-refuter` | P2 validator |
| Reality Checker | `testing-reality-checker` | Final gate |

## Stage 3 — Pipelines & Dependency Graph

```
P1 (engine)  ──feeds C-1──►  P2 (docs)  ──blocks──►  G3 final gate
   T1.1 ─► T1.2 ─► T1.4 ─► T1.5 ─► T1.6
   T1.3 ──────────► T1.4
   T1.7 (migration) after T1.4
P2:
   T2.1 (workspace-format.md + README)  ─► T2.2 (rules + AGENTS + root README)
   T2.3 (skills path migration)  ─► T2.4 (examples migration)
```

| Edge | From → To | Artifact |
| --- | --- | --- |
| `feeds` C-1 | P1:T1.4 → P2:T2.1 | `src/workspace/constants.js` + `docs/agency-flow/workspace-format.md` contract |
| `blocks` | P2 → G3 | Both pipelines PASS before Reality Checker |
| `sync` | T1.7 ⇄ T2.4 | Migration script output must match documented mapping exactly |

## Stage 4 — Task Register

| ID | Task | Owner (producer) | Validator | Depends on |
| --- | --- | --- | --- | --- |
| T1.1 | Job-id validation + canonical layout constants | general | reliability | — |
| T1.2 | `workflow-state.md` read/write/update | general | reliability | T1.1 |
| T1.3 | YAML task parser + schema validation | general | test-results | T1.1 |
| T1.4 | `init` / `approve` / `resume` / `validate` | general | reliability | T1.2, T1.3 |
| T1.5 | CLI (`flow`) + bin wiring | general | reliability | T1.4 |
| T1.6 | Test suite (node:test) | general | test-results | T1.5 |
| T1.7 | Migration script + test | general | test-results | T1.4 |
| T2.1 | `workspace-format.md` + `docs/agency-flow/README.md` | general | refuter | C-1 |
| T2.2 | `rules/agency-flow.md`, `AGENTS.md`, root `README.md` | general | refuter | T2.1 |
| T2.3 | Skills + references path migration | general | refuter | T2.1 |
| T2.4 | Example workspaces migration | general | refuter | T2.3, T1.7 |

## Stage 5 — Gates & Approvers

| Gate | Question | Signed by |
| --- | --- | --- |
| G1 (P1) | Does the engine behave deterministically under test? | Reliability Reviewer + Test Results Analyzer |
| G2 (P2) | Do the docs and skills describe the shipped behavior? | Refuter Reviewer |
| G3 (run) | Is the whole thing ready to merge? | Reality Checker (default NEEDS WORK) |

### Human authority
| Decision | Approver | Status |
| --- | --- | --- |
| Breaking layout migration (`00-frame.md` → `00-intent.md`, etc.) | Deuri Vasquez | **Approved in intake (2026-11-25)** |
| Merge to `main` | Deuri Vasquez | Pending — run stops before merge |

## Stage 6 — Cross-Pipeline Contract

| Field | Value |
| --- | --- |
| Contract ID | C-1 |
| From → To | P1 → P2 |
| Artifact | `src/workspace/constants.js` (canonical layout) @ first commit of this run |
| Certified by | Reliability Reviewer, G1 PASS |
| Consumer needs | Exact canonical filenames, directory names, numeric-prefix rule, task schema |
| Change policy | P2 may not edit P1 artifacts; changes go back as a change request and re-pass G1 |
| Approver | Deuri Vasquez (layout migration) |

## Canonical Layout (the contract)

```
docs/agency-flow/<job-id>/
├── workflow-state.md          # DAG state, checkpoints — single source of truth
├── 00-intent.md               # FRAME: intent, goal, criteria, scope, domain profile
├── 01-proposal.md             # PROPOSE: approach, deliverables, risks, deps + HITL approval
├── 02-specs/                  # per-division specs
├── 03-artifacts/              # BUILD log + intermediate artifacts
├── 04-tasks/                  # atomic YAML tasks
├── 05-deliverables/           # SHIP outputs
├── 06-validation/             # VERIFY reports (Evaluator-Optimizer evidence)
└── 07-measure.md              # MEASURE (optional, declared in FRAME)
```

### Migration mapping
| Legacy | Canonical |
| --- | --- |
| `00-research.md` | `00-research.md` (optional pre-phase, kept) |
| `00-frame.md` | `00-intent.md` |
| `01-propose.md` | `01-proposal.md` |
| `02-build.md` | `03-artifacts/build-log.md` |
| `03-verify.md` | `06-validation/verify-report.md` |
| `04-ship.md` | `05-deliverables/ship-notes.md` |
| `05-measure.md` | `07-measure.md` |
| — | `02-specs/`, `04-tasks/`, `workflow-state.md` (new) |

## Stage 7 — Execution Log

| Time | Pipeline | Event |
| --- | --- | --- |
| start | — | Ledger written; plan frozen |
| | P1 | T1.1–T1.7 produced; 51 tests green |
| | P1 | Test Results Analyzer attempt 1: **FAIL** — 2 demonstrated false passes (path traversal not tested at the FS boundary; attempts reset on render) + 3 gaps |
| | P1 | Gaps fixed; 58 tests green; attempt 2 dispatched |
| | P2 | T2.1, T2.2, T2.4 produced; examples migrated and `flow validate` PASS on both |
| | P2 | T2.3 (skills path migration) dispatched to producer |
| | P2 | T2.3 verified: 0 stale legacy paths in `skills/`, `rules/`, `README.md`, `AGENTS.md` |
| | G3 | Reality Checker attempt 1: **NEEDS WORK** — B1 approval gate broken on migrated/template proposals; B2 no shipped way to advance DAG state; plus 9 medium/low findings |
| | P1+P2 | Remediation applied: `flow step`, frontmatter-tolerant approve, migration normalization, research step, bidirectional validation, traversal fix, docs/skills alignment, examples regenerated |
| | G3 | Reality Checker final verdict — **PASS**: 70 tests green, both examples PASS, 0 stale paths, end-to-end smoke (init → approve → step failure → blocked → evidence → done) verified |

## Stage 8 — Gate G3: Reality Check

Reality Checker reproduced every claim instead of trusting the suite. Verdict on
attempt 1: **NEEDS WORK**. A green suite was not evidence of the two blockers.

| ID | Severity | Finding | Remediation |
| --- | --- | --- | --- |
| B1 | Blocking | `flow approve` failed on any proposal without frontmatter — every migrated workspace, both shipped examples, and the PROPOSE template. `validate` reported a false green. | `approve` prepends frontmatter and appends `## Approval`; `migrate` normalizes the proposal; template and examples fixed; regression tests call `approveProposal` instead of hand-injecting frontmatter. |
| B2 | High | No documented interface advanced the DAG after approval; `flow resume` was read-only, so `workflow-state.md` never recorded build/verify/ship. | `flow step` added (status/owner/evidence/attempts), failures increment attempts and block at 3, done requires evidence, gated steps exit 3 before approval. |
| M1 | Medium | `flow task list` accepted `../outside-target` and read outside the root. | `task list` now resolves through `workspaceDir`, so the job id is validated; traversal test added. |
| M2 | Medium | `inferState` marked measure `skipped` even with `07-measure.md` present. | Measure is `pending` when the artifact exists; test added. |
| M3 | Medium | Research phase had no DAG step. | `research` step added (default `skipped`, recorded done by `flow step`/migration). |
| M4 | Medium | `validate` passed proposal/state mismatches in one direction and accepted an empty approver. | Bidirectional check plus named-approver requirement; two tests added. |
| M5 | Docs | The "next free number" rule was contradicted by a fixed allow-list. | Any `NN-` prefixed root entry is accepted; docs aligned. |
| M6 | Docs | PROPOSE skill and transition protocol never enforced the human gate. | Both now stop at `flow approve` before BUILD. |
| M7 | Docs | Transition protocol still named `<NN-phase>.md`. | Replaced with the canonical artifact per phase. |
| M8 | Docs | Examples had no proposal frontmatter/approval and inconsistent state. | Regenerated proposals and `workflow-state.md`. |
| M9 | Docs | Phase numbering, task phase values, skill count, frame template metadata. | Aligned. |

### Pre-existing failure (not caused by this run)
| Task | Evidence |
| --- | --- |
| T1.1–T1.7 | `node --test tests/workspace/` → 58 pass, 0 fail |
| T1.7 | `node scripts/migrate-workspace.mjs <dir> --write`; idempotent second run |
| T2.1 | `docs/agency-flow/workspace-format.md`, `docs/agency-flow/README.md` |
| T2.2 | `rules/agency-flow.md`, `AGENTS.md`, `README.md` |
| T2.3 | `grep -rn -E '00-frame\.md\|...' skills/` → 0 matches; 44 `<job-id>` placeholders |
| T2.4 | `flow validate example-engineering-feature` and `example-marketing-campaign` → PASS |

### Pre-existing failure (not caused by this run)
`bash tests/opencode/run-tests.sh` → 1 pass, 3 fail. Reproduced on a clean
`git worktree add --detach /tmp/opencode/af-head HEAD` with the same 3
failures, so it predates this run. Owner: plugin harness (`SuperpowersPlugin is
not a function` / bootstrap count). This run does not claim that suite green.

## Lessons (filled at close)
- The first test suite passed 51/51 while two behaviours were unproven. Mutation
  testing, not the green bar, is what caught it. A passing suite is a claim.
- The legacy proposal gate was agent-signed, not human-signed. Carrying it
  forward as approved would have fabricated a human decision; the migration
  rewinds to the HITL gate instead.
