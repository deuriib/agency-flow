---
job_id: example-marketing-campaign
status: awaiting-approval
current_phase: propose
created_at: 2026-11-26T01:02:27.419Z
updated_at: 2026-11-26T01:02:27.419Z
---

# Workflow State — example-marketing-campaign

> Single source of truth for orchestration. The engine reads and writes this file; do not hand-edit.

## Steps

| # | Step | Phase | Owner | Status | Attempts | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | research | research | - | done | 0 | 00-research.md |
| 2 | intent | intent | orchestrator | done | 0 | 00-intent.md |
| 3 | proposal | propose | orchestrator | awaiting-approval | 0 | 01-proposal.md |
| 4 | build | build | - | pending | 0 | - |
| 5 | verify | verify | - | pending | 0 | - |
| 6 | ship | ship | - | pending | 0 | - |
| 7 | measure | measure | - | pending | 0 | - |

## Checkpoints

| At | Phase | Note |
| --- | --- | --- |
| 2026-11-26T01:02:27.419Z | propose | Migrated from legacy layout; proposal awaits human approval |
