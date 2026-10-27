# VERIFY — anti-patterns

## 1. Self-verification

The verifier is the builder. Sometimes disguised ("Backend Architect
reviews Backend Architect's work"). Fix: read BUILD, refuse.

## 2. Rubber-stamp PASS

Every criterion `PASS` with no evidence. Fix: evidence per row is
mandatory.

## 3. Conditions without owners

`PASS-WITH-CONDITIONS` where conditions have no owner or no date. Fix:
every condition has both, or the verdict is `FAIL`.

## 4. Domain gate marked N/A

VERIFY's whole purpose is the domain gate. `N/A` here means VERIFY did
not happen. Fix: assign a verifier.

## 5. Findings as decoration

A findings section listing things "worth noting" that don't influence the
verdict. Fix: findings either have a severity that matters or are
removed.

## 6. Verdict inconsistency

Verdict `PASS` but a `FAIL` row somewhere. Fix: any `FAIL` row forces
`FAIL` verdict.

## 7. Retro-verification

VERIFY written after SHIP, to close the loop. Fix: SHIP is blocked on
VERIFY, not on the appearance of VERIFY.

## 8. Skipping independence for "small" projects

The rule does not scale down. Fix: if a project is too small for an
independent verifier, it is too small to be a project.
