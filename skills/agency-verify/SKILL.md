---
name: agency-verify
description: Use when executing Phase 4 (VERIFY) of Agency-Flow for independent QA review, verifying results per criterion with evidence. The verifier must not be the builder.
---

# Agency Verify (Phase 4)

## Overview

Verify is the independent QA and review phase. An independent verifier (who must **not** be the agent that built the artifact) reviews each criterion against evidence, assigns a verdict (`PASS`, `PASS-WITH-CONDITIONS`, or `FAIL`), and records conditions for SHIP. The PM process steward verifies verifier independence and evidence completeness before signing the process gate.

**Announce at start:** "I am using the agency-verify skill to execute Phase 4: VERIFY."

## File Location
`docs/agency-flow/<slug>/03-verify.md`

## Required Structure

```markdown
# VERIFY — <slug>

## Result per criterion
- [ ] <criterion> — PASS/FAIL — <evidence description>

## Findings (grouped by domain)
- <domain>: <findings and observations>

## Verdict
- Domain gate: PASS / PASS-WITH-CONDITIONS / FAIL
- Process gate: PASS / FAIL

## Conditions (if applicable)
- <condition description>

## Assigned team
- Domain verifier: <agent> — independent, no build involvement
- Domain support: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: <agent> — PASS / PASS-WITH-CONDITIONS / FAIL
- Process gate: <PM agent> — PASS / FAIL
```

## Phase Checklist
1. Confirm the domain verifier is completely independent (did not participate in BUILD for the artifact).
2. Evaluate every FRAME criterion with concrete evidence.
3. Record findings grouped by domain and any conditions for release.
4. Obtain both Domain Gate (independent verifier) and Process Gate (PM process steward confirming independence and evidence) signatures before advancing to SHIP (`04-ship.md`).
