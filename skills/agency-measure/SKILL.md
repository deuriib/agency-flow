---
name: agency-measure
description: Use when executing Phase 6 (MEASURE) of Agency-Flow for collecting post-launch metrics, evaluating outcomes against FRAME criteria, gathering learnings, and ingesting follow-ups into the backlog.
---

# Agency Measure (Phase 6)

## Overview

Measure is an optional post-launch phase (must be declared `measure? yes` in FRAME before opening). It collects metrics, compares per-criterion outcomes against FRAME success criteria, extracts learnings, and ingests follow-up items into the backlog.

**Announce at start:** "I am using the agency-measure skill to execute Phase 6: MEASURE."

## File Location
`docs/agency-flow/<slug>/05-measure.md`

## Required Structure

```markdown
# MEASURE — <slug>

## Metrics collected
- <Metric / Data point>

## Per-criterion outcome vs FRAME
- <criterion> — Met / Partial / Missed — <analysis>

## Learnings
- <Key takeaway>

## Follow-ups
- <follow-up item> — Owner: <agent> — Ingested: yes/no

## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: <agent> — PASS / PENDING
- Process gate: <PM agent> — PASS / PENDING
```

## Phase Checklist
1. Verify that `measure? yes` was declared in FRAME.
2. Collect post-launch metrics and evaluate outcomes against every FRAME success criterion.
3. Document key learnings and ingest follow-ups into the backlog (marked ingested yes/no with owners).
4. Obtain signatures for both Domain Gate (domain expert/growth/product) and Process Gate (Project Management process steward).
