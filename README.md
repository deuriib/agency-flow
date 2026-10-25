# Agency-Flow

Agency-Flow is a sequential 5+2 phase methodology and skills framework designed to take any intent to a release across any `agency-agents` division. Created by **Deuri Vasquez**, Agency-Flow enforces rigorous process stewardship, artifact contracts, and the two-gate model (domain gate + process gate) for coding agents and human operators.

It is designed to be fully complementary with [agency-agents](https://github.com/deuriib/agency-agents).

## The Two-Gate Model

| Gate | Question | Signed by |
|---|---|---|
| **Domain gate** | Is the artifact good? | A competent agent in that phase's domain (not the builder, in VERIFY) |
| **Process gate** | Was the phase done correctly? | A Project Management process steward |

## The 5+2 Phases

All work lives in `docs/agency-flow/<slug>/`:
- **00 — Research** (Optional) — Discovery, questions, and cited sources.
- **01 — Frame** — Goal, measurable success criteria, scope, and domain profile.
- **02 — Propose** — Approach, deliverables, risks, and cross-domain dependencies with owners and dates.
- **03 — Build** — Implementation log per criterion, artifacts, deviations, and handoffs (Domain gate: N/A).
- **04 — Verify** — Independent QA review, verdict (`PASS` / `PASS-WITH-CONDITIONS` / `FAIL`), and evidence.
- **05 — Ship** — Release notes, version tag, changelog, references, and follow-ups.
- **06 — Measure** (Optional) — Post-launch metrics, outcome vs FRAME, learnings, and backlog ingestion.

## Getting Started

1. Install Agency-Flow as your agent plugin or copy skills into your environment.
2. At session start, the `using-agency-flow` bootstrap skill loads automatically.
3. Start any task using the Agency-Flow skills (`agency-workflow`, `agency-frame`, etc.).

## Credits & Acknowledgments
Agency-Flow builds upon the robust runtime harness, skill distribution plugins, and architectural patterns pioneered by [superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

## Author
**Deuri Vasquez** (`deuriib`)
