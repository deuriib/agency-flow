---
name: agency-research
description: Use when executing Phase 0 (RESEARCH) of Agency-Flow for discovery, domain research, and gathering background findings tied to FRAME criteria.
---

# Agency Research (Phase 0)

## Overview

Research is an optional phase (must be declared `research? yes` in FRAME before opening). It investigates unknown technical, market, design, or user factors before framing the project scope.

**Announce at start:** "I am using the agency-research skill to execute Phase 0: RESEARCH."

## File Location
`docs/agency-flow/<slug>/00-research.md`

## Required Structure

```markdown
# RESEARCH — <slug>

## Research questions
- [ ] <Question 1>
- [ ] <Question 2>

## Sources cited
- <Source / URL / Document>

## Findings
- <Summary of findings and implications>

## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: <agent> — PASS / PENDING
- Process gate: <PM agent> — PASS / PENDING
```

## Phase Checklist
1. Verify that `research? yes` was declared in FRAME (or if executed upfront before FRAME, ensure findings feed directly into FRAME criteria).
2. Answer all research questions with cited sources.
3. Summarize findings and tie them to at least one prospective FRAME-bound criterion.
4. Obtain signatures for both Domain Gate (domain expert) and Process Gate (Project Management process steward).
