---
job_id: <job-id>
phase: propose
status: draft
created_at: <ISO-8601>
approved_by:
approved_at:
---

# PROPOSE — <job-id>

## Approach

<2–4 sentences. The chosen approach and the rejected alternative.>

## Planned deliverables (grouped by domain)

- <domain>:
  - <deliverable> — supports criterion <n> (<short label>).
  - <deliverable> — supports criterion <n>.
- <domain>:
  - <deliverable> — supports criterion <n>.

## Risks

- <risk> — <mitigation>. Severity: <low | medium | high>.

## Verification plan

- Criterion <n> (<short label>) → <how, by which domain>.
- Criterion <n> → <how, by which domain>.

## Cross-domain dependencies

- <dependency> — Owner: <agent> — Due: <YYYY-WW or date>.

## Assigned team

- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates

- Domain gate: <agent> — PASS / PENDING
- Process gate: <PM agent> — PASS / PENDING

## Approval

- Status: pending
- Approver:
- Date:
- Notes:

```

Rules:
- **Every FRAME criterion** must appear under at least one deliverable.
- **Every deliverable** must say which criterion it supports.
- **Every cross-domain dependency** must have owner + due date. No
  exceptions.
