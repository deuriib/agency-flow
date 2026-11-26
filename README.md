# Agency-Flow

Agency-Flow is a sequential 5+2 phase methodology and skills framework designed to take any intent to a release across any `agency-agents` division. Created by **Deuri Vasquez**, Agency-Flow enforces rigorous process stewardship, artifact contracts, and the two-gate model (domain gate + process gate) for coding agents and human operators.

It is designed to be fully complementary with [agency-agents](https://github.com/deuriib/agency-agents).

## The Two-Gate Model

| Gate | Question | Signed by |
|---|---|---|
| **Domain gate** | Is the artifact good? | A competent agent in that phase's domain (not the builder, in VERIFY) |
| **Process gate** | Was the phase done correctly? | A Project Management process steward |

## The 5+2 Phases

All work lives in a standardized workspace under `docs/agency-flow/<job-id>/`:
- **00 — Research** (Optional) — Discovery, questions, and cited sources.
- **01 — Frame** (`00-intent.md`) — Goal, measurable success criteria, scope, and domain profile.
- **02 — Propose** (`01-proposal.md`) — Approach, deliverables, risks, and cross-domain dependencies with owners and dates. Blocking human approval.
- **03 — Build** (`03-artifacts/`, `02-specs/`, `04-tasks/`) — Implementation log per criterion, artifacts, deviations, and handoffs (Domain gate: N/A).
- **04 — Verify** (`06-validation/verify-report.md`) — Independent QA review, verdict (`PASS` / `PASS-WITH-CONDITIONS` / `FAIL`), and evidence.
- **05 — Ship** (`05-deliverables/ship-notes.md`) — Release notes, version tag, changelog, references, and follow-ups.
- **06 — Measure** (`07-measure.md`, Optional) — Post-launch metrics, outcome vs FRAME, learnings, and backlog ingestion.

Every artifact at the workspace root uses a two-digit prefix, and `workflow-state.md` records the DAG state so a run can resume after a failure. The full contract is in [`docs/agency-flow/workspace-format.md`](./docs/agency-flow/workspace-format.md).

## Workspace Engine

Agency-Flow ships a zero-dependency engine that creates and validates the workspace:

```bash
flow init issue-9 --intent "Adopt the standardized workspace."
flow approve issue-9 --by "Your Name"   # unblocks the HITL gate
flow resume issue-9                     # next DAG step, or the blocking reason
flow step issue-9 --step build --status done --evidence 03-artifacts/build-log.md
flow validate issue-9                   # layout, state, tasks, cycles
```

`flow resume` exits `3` while `01-proposal.md` is unapproved. Tasks live in `04-tasks/T-000.yaml` and are validated against a schema; a producer can never validate its own work.

## Getting Started

1. Install Agency-Flow as your agent plugin or copy skills into your environment.
2. At session start, the `using-agency-flow` bootstrap skill loads automatically.
3. Start any task using the Agency-Flow skills (`agency-workflow`, `agency-frame`, etc.).

## Credits & Acknowledgments
Agency-Flow builds upon the robust runtime harness, skill distribution plugins, and architectural patterns pioneered by [superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

![Repobeats analytics](https://repobeats.com/deuriib/agency-flow?theme=light&size=medium&period=30)

## License
MIT see [LICENSE](./LICENSE)
