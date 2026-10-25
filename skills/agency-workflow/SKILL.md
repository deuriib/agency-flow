---
name: agency-workflow
description: Use when initiating, managing, or progressing projects through Agency-Flow, the sequential 5+2 phase methodology featuring the two-gate model (domain gate + process gate) and Project Management process stewardship.
---

# Agency-Workflow

## Overview

Agency-Flow is a sequential 5+2 phase methodology designed to take any intent to a reliable release across any `agency-agents` division. All project work lives in `docs/agency-flow/<slug>/`.

**Announce at start:** "I am using the agency-workflow skill to enforce the Agency-Flow methodology and gate structure."

## The Non-Negotiable Rules

1. **One slug per task** (kebab-case, unique).
2. **One phase = one file.** No phase may be skipped. Optional phases (`research` and `measure`) must be explicitly declared "yes" or "no" in FRAME.
3. **No advancing without completion.** Do not open or work on the next phase file until the previous phase file is complete and its gates are both `PASS`.
4. **Capability + domain.** Every phase declares capability + domain, never a specific agent name directly in role definitions.
5. **Multi-agent teams** per phase are allowed and encouraged.
6. **Artifacts are the contract.** Roles are interchangeable; artifacts are what the project is judged on.
7. **Required closing blocks.** Every phase file must end with `## Assigned team` and `## Gates`.
8. **The Two-Gate Model:** Every phase requires two gates:
   - **Domain gate:** Asks "Is the artifact good?" Signed by a competent agent in that phase's domain (and never by the builder in VERIFY).
   - **Process gate:** Asks "Was the phase done correctly?" Signed by a Project Management process steward.
   - Neither gate substitutes the other. Both must be `PASS` to advance.
9. **Project Management as Process Steward:** Project Management participates in every phase in exactly one mode: process steward. PM never leads a domain, never signs a domain gate, and does not produce the artifacts the project is judged on (except in the PM-as-deliverable edge case where a different PM signs the process gate).
10. **Verifier Independence:** In VERIFY, the verifier must not be the agent that built the artifact.
11. **No skipping:** If the user asks to skip a phase, refuse and state the pending gate.

## The Two-Gate Model Reference

| Gate | Question | Signed by |
|---|---|---|
| **Domain gate** | Is the artifact good? | A competent agent in that phase's domain (not the builder, in VERIFY) |
| **Process gate** | Was the phase done correctly? | A Project Management agent (Process Steward) |

### Per-Phase Applicability
- **RESEARCH (Optional):** Domain gate + Process gate
- **FRAME:** Domain gate + Process gate
- **PROPOSE:** Domain gate + Process gate
- **BUILD:** Process gate only (domain quality deferred to VERIFY)
- **VERIFY:** Domain gate (independent verifier) + Process gate (PM confirms independence & evidence)
- **SHIP:** Process gate only (domain quality confirmed at VERIFY)
- **MEASURE (Optional):** Domain gate + Process gate

## Phase Sequence & Files

`docs/agency-flow/<slug>/`
├── `00-research.md` (optional — only if declared yes in FRAME)
├── `00-frame.md`
├── `01-propose.md`
├── `02-build.md`
├── `03-verify.md`
├── `04-ship.md`
└── `05-measure.md` (optional — only if declared yes in FRAME)

## Invoking Phase Skills

When progressing through the project, transition smoothly to the specific phase skills:
- `agency-research` for Phase 0
- `agency-frame` for Phase 1
- `agency-propose` for Phase 2
- `agency-build` for Phase 3
- `agency-verify` for Phase 4
- `agency-ship` for Phase 5
- `agency-measure` for Phase 6
