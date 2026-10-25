---
name: agency-propose
description: Use when executing Phase 2 (PROPOSE) of Agency-Flow to establish technical/strategic approach, planned deliverables, risks, verification plan, and cross-domain dependencies with owners and dates.
---

# Agency Propose (Phase 2)

## Overview

Propose outlines the architecture, strategy, and design direction required to achieve the FRAME criteria. It details planned deliverables per domain, risks, verification mapping, and cross-domain dependencies with explicit owners and due dates.

**Announce at start:** "I am using the agency-propose skill to execute Phase 2: PROPOSE."

## File Location
`docs/agency-flow/<slug>/01-propose.md`

## Required Structure

```markdown
# PROPOSE — <slug>

## Approach
<Architectural, strategic, or design approach overview>

## Planned deliverables (grouped by domain)
- <domain>: <deliverable description> — <how it satisfies a FRAME criterion>

## Risks
- <Risk and mitigation>

## Verification plan
- <criterion> — <how it will be verified, by which domain>

## Cross-domain dependencies
- <dependency description> — Owner: <agent> — Due: <date>

## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: <agent> — PASS / PENDING
- Process gate: <PM agent> — PASS / PENDING
```

## Phase Checklist
1. Ensure the approach, risks, and verification plan align with every domain declared in FRAME.
2. Group planned deliverables by domain and tie each directly to a FRAME criterion.
3. List every cross-domain dependency with a named owner and due date (managed by the PM process steward).
4. Verify both gates (`Domain gate` and `Process gate`) are signed `PASS` before advancing to BUILD (`02-build.md`).
