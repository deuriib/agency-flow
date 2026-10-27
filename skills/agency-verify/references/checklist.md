# VERIFY — gate checklist

## Pre-checks (before opening the file)

- [ ] Read `02-build.md`. Note every agent listed there.
- [ ] Confirm the chosen verifier is not among them.
- [ ] If the same agent appears, refuse to open VERIFY. Reassign.

## Domain gate (signed by the independent verifier)

- [ ] Every FRAME criterion has a result row.
- [ ] Every result row has evidence (test name, path, metric snapshot).
- [ ] No row says "PASS" without evidence.
- [ ] Findings grouped by domain, each with a severity.
- [ ] Verdict is one of `PASS | PASS-WITH-CONDITIONS | FAIL`.
- [ ] If `PASS-WITH-CONDITIONS`, every condition has an owner and a due
      date.

## Process gate (signed by PM)

- [ ] File lives at `docs/agency-flow/<slug>/03-verify.md`.
- [ ] Verifier is not the builder (independence confirmed in writing).
- [ ] `## Assigned team` names the independent verifier and the process
      steward.
- [ ] `## Gates` block is present with both lines.
- [ ] Domain gate verdict is not `N/A`.
- [ ] Conditions are recorded for SHIP.

## Rejection triggers

- Any `PASS` without evidence.
- Verifier appears in the BUILD log.
- Verdict `PASS` with any `FAIL` row.
- Conditions without owner or due date.
- Missing findings for a domain that produced artifacts.
