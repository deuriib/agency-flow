---
name: agency-build
description: Use when executing Phase 3 (BUILD) of Agency-Flow for production and implementation across domains, tracking every FRAME criterion in the log, recording deviations, and managing cross-domain handoffs.
---

# Agency Build (Phase 3)

## Overview

Build is the production and implementation phase. Every FRAME criterion is tracked in a build log, artifacts are listed, deviations from PROPOSE are recorded, and handoffs are marked done. 

*Note:* Per the two-gate model, the **Domain gate is N/A in BUILD** because domain quality is deferred to VERIFY. Only the process gate is signed here by the PM process steward.

**Announce at start:** "I am using the agency-build skill to execute Phase 3: BUILD."

## File Location
`docs/agency-flow/<slug>/02-build.md`

## Required Structure

```markdown
# BUILD — <slug>

## Log (one row per FRAME criterion)
- [x] <criterion> → <artifact / action that satisfies it>

## Deviations from PROPOSE
- <Description of any deviation and justification> (or "None")

## Artifacts produced (grouped by domain)
- <domain>: <artifact path or URL>

## Cross-domain handoffs
- <handoff description> — Done / Pending

## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: N/A — deferred to VERIFY
- Process gate: <PM agent> — PASS / PENDING
```

## Phase Checklist
1. Track every FRAME criterion in the build log with its satisfying artifact or action.
2. Record any deviations from PROPOSE with clear justifications.
3. List all artifacts produced, grouped by domain.
4. Mark cross-domain handoffs as Done or Pending.
5. Obtain the Process Gate signature from the PM process steward (`Domain gate: N/A`) before advancing to VERIFY (`03-verify.md`).
