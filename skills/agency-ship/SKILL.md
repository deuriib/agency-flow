---
name: agency-ship
description: Use when executing Phase 5 (SHIP) of Agency-Flow for delivery, documentation, tagging, release notes, changelog, and owning follow-ups carried from VERIFY.
---

# Agency Ship (Phase 5)

## Overview

Ship is the delivery and release phase. It compiles user-facing release notes, version tags, changelogs, references to the verified artifacts, and ownership/due dates for any follow-up items carried over from VERIFY. 

*Note:* Per the two-gate model, the **Domain gate is N/A in SHIP** because domain quality was certified in VERIFY. Only the process gate is signed here by the PM process steward.

**Announce at start:** "I am using the agency-ship skill to execute Phase 5: SHIP."

## File Location
`docs/agency-flow/<slug>/04-ship.md`

## Required Structure

```markdown
# SHIP — <slug>

## Release notes (user-facing)
- <User-facing summary of changes>

## Version / tag
- `<tag-name>` (e.g. `v1.0.0`)

## Changelog
- <Detailed changelog entries>

## References
- FRAME: `docs/agency-flow/<slug>/00-frame.md`
- PROPOSE: `docs/agency-flow/<slug>/01-propose.md`
- BUILD: `docs/agency-flow/<slug>/02-build.md`
- VERIFY: `docs/agency-flow/<slug>/03-verify.md` (Verdict: PASS / PASS-WITH-CONDITIONS)

## Follow-ups carried from VERIFY
- <follow-up item> — Owner: <agent> — Due: <date>

## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: N/A — passed at VERIFY
- Process gate: <PM agent> — PASS / PENDING
```

## Phase Checklist
1. Draft clear user-facing release notes and version tag.
2. Compile the changelog and link all previous phase artifacts, explicitly referencing the VERIFY verdict.
3. Assign owners and due dates to all follow-up items carried from VERIFY.
4. Obtain the Process Gate signature from the PM process steward (`Domain gate: N/A`) before project completion (or advancing to MEASURE if declared).
