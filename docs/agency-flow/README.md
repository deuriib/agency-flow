# Agency-Flow Guide

Agency-Flow is a sequential 5+2 phase methodology designed to take any intent to a release across any `agency-agents` division. All project artifacts live in `docs/agency-flow/<slug>/`.

## Core Principles

1. **Sequential Progression:** One phase = one file. No phase may be skipped. Optional phases (`research` and `measure`) must be explicitly declared `yes` or `no` in FRAME.
2. **The Two-Gate Model:** Every phase requires two gates:
   - **Domain Gate:** Asks "Is the artifact good?" Signed by a competent agent in that phase's domain (and never by the builder in VERIFY).
   - **Process Gate:** Asks "Was the phase done correctly?" Signed by a Project Management process steward.
3. **Project Management as Process Steward:** PM participates in every phase in exactly one mode: process steward. PM never leads a domain, never signs a domain gate, and does not produce artifacts the project is judged on (except in the PM-as-deliverable edge case where a different PM signs the process gate).
4. **Verifier Independence:** In VERIFY, the verifier must not be the agent that built the artifact.
5. **Artifacts as Contract:** Roles are interchangeable; artifacts are the single source of truth.

## Phase Overview

| Phase | File | Optional? | Gates | Primary Focus |
|---|---|---|---|---|
| 0 — Research | `00-research.md` | Yes (declared in FRAME) | Domain + Process | Discovery, questions, cited sources |
| 1 — Frame | `00-frame.md` | No | Domain + Process | Goal, measurable criteria, scope, domain profile |
| 2 — Propose | `01-propose.md` | No | Domain + Process | Architecture, deliverables, risks, dependencies |
| 3 — Build | `02-build.md` | No | Process only (Domain N/A) | Implementation log, artifacts, deviations, handoffs |
| 4 — Verify | `03-verify.md` | No | Domain (Independent) + Process | Independent QA review, verdict, evidence |
| 5 — Ship | `04-ship.md` | No | Process only (Domain N/A) | Release notes, tag, changelog, follow-ups |
| 6 — Measure | `05-measure.md` | Yes (declared in FRAME) | Domain + Process | Metrics, outcome vs FRAME, learnings, backlog |

## Examples

- Minimal 5-phase engineering feature: `docs/agency-flow/example-engineering-feature/`
- Full 7-phase marketing campaign: `docs/agency-flow/example-marketing-campaign/`
