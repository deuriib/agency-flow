# PROPOSE — gate checklist

## Domain gate (signed by a technical/architecture agent)

- [ ] Approach is concrete (2–4 sentences) with a rejected alternative.
- [ ] Every FRAME criterion appears in `## Planned deliverables`.
- [ ] Every deliverable names the FRAME criterion it supports.
- [ ] Risks are actionable (`<risk> — <mitigation>`), not just listed.
- [ ] Verification plan covers every criterion.
- [ ] No deliverable silently adds a criterion.

## Process gate (signed by PM)

- [ ] File lives at `docs/agency-flow/<slug>/01-propose.md`.
- [ ] Every cross-domain dependency has an owner.
- [ ] Every cross-domain dependency has a due date.
- [ ] `## Assigned team` names both domain owners and a process steward.
- [ ] `## Gates` block is present with both lines.
- [ ] The dependency plan does not introduce an unowned boundary.
- [ ] `## Approach` mentions any deviation from FRAME (rare — note it).

## Rejection triggers

- Deliverables listed without criterion mapping.
- Dependencies with "TBD" owners.
- Dependencies with "ASAP" or "soon" dates.
- Risks listed without mitigation.
- Verification plan missing for any criterion.
