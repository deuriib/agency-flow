---
name: agency-frame
description: Use when executing Phase 1 (FRAME) of Agency-Flow to define goals, measurable success criteria, scope, domain profile, constraints, and PM staffing feasibility.
---

# Agency Frame (Phase 1)

## Overview

Frame is the mandatory foundation of every Agency-Flow project. It establishes the goal, measurable success criteria, scope boundaries, domain profile, optional phase declarations, and team staffing feasibility.

**Announce at start:** "I am using the agency-frame skill to execute Phase 1: FRAME."

## File Location
`docs/agency-flow/<slug>/00-frame.md`

## Required Structure

```markdown
# FRAME — <slug>

## Goal
<1–3 sentences defining the intent and desired outcome>

## Success criteria (measurable)
- [ ] <criterion 1>
- [ ] <criterion 2>

## Scope
- In: <Included scope items>
- Out: <Excluded scope items>

## Domain profile
- Domains involved: <Product | Design | Engineering | Marketing | Sales | Content | ...>
- Deliverable type: <code | campaign | content | design | research | launch | ...>
- Optional phases: research? <yes/no> — measure? <yes/no>

## Constraints
- <Constraint 1>

## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <staffing feasibility, scope achievability>

## Gates
- Domain gate: <agent> — PASS / PENDING
- Process gate: <PM agent> — PASS / PENDING
```

## Phase Checklist
1. Write a precise 1-3 sentence goal.
2. Define at least two strictly measurable success criteria.
3. Define clear In and Out scope boundaries.
4. Complete the domain profile, explicitly declaring optional phases (`research?` and `measure?`).
5. Map domain agents and assign a PM process steward who confirms staffing feasibility and scope achievability.
6. Verify both gates (`Domain gate` and `Process gate`) are signed `PASS` before advancing to PROPOSE (`01-propose.md`).
