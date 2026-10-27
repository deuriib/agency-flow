# PROPOSE — anti-patterns

## 1. Deliverables without criterion mapping

The list of things to build, with no line pointing back to a FRAME
criterion. Fix: every deliverable names the criterion it supports.

## 2. Criteria with no deliverable

A FRAME criterion that no planned deliverable satisfies. Fix: either add
a deliverable, or raise in PROPOSE that the criterion is not achievable
and reopen FRAME.

## 3. The invisible dependency

"Design will hand off to Content" with no owner, no date. Fix: name the
owner, set the due date, add it to `## Cross-domain dependencies`.

## 4. Risks as decoration

A list of risks with no mitigation, no severity, no owner. Fix: every
risk has a mitigation; if no mitigation exists, the risk is a blocker.

## 5. Verification after the fact

"No verification plan — we'll figure it out during BUILD." Fix: VERIFY
cannot function without a plan. Every criterion needs one.

## 6. Scope creep by design

Deliverables that quietly add scope beyond FRAME ("while we're at it,
add..."). Fix: if scope must change, amend FRAME explicitly. Do not
absorb it into PROPOSE.

## 7. The missing alternative

Approach presented with no rejected alternative. Fix: "we chose A and
rejected B because C". Without a rejected alternative, PROPOSE is a
restatement, not a decision.

## 8. Approach contradicting FRAME

A plan that cannot satisfy the stated criteria but does not say so. Fix:
if the criteria are not achievable, PROPOSE must fail the domain gate
and reopen FRAME.
