# BUILD — anti-patterns

## 1. Self-signed domain gate

BUILD is not a review phase. A BUILD file with `Domain gate: PASS` is
malformed. Fix: `Domain gate: N/A`, deferred to VERIFY.

## 2. Log rows with no artifact

"Implemented criterion 1" without a pointer. Fix: every row names a path
or a URL.

## 3. Silent deviations

A change that differed from PROPOSE but is not written in `## Deviations
from PROPOSE`. Fix: if it deviated, it goes in the file. If it's not
written, it didn't happen (but it did).

## 4. Orphan artifacts

An artifact that appears in `## Artifacts produced` but satisfies no
FRAME criterion. Fix: either remove it, or add a criterion (which reopens
FRAME).

## 5. Pending handoffs at BUILD close

Handoffs stuck at `Pending` block SHIP. Fix: if a handoff cannot be
completed during BUILD, it becomes a blocker and PROPOSE is reopened.

## 6. The "minor tweaks" lie

A deviation recorded as "minor" with no detail. Fix: write what changed
and why. If it takes more than one line, it is not minor.

## 7. Dropped PROPOSE deliverables

A deliverable from PROPOSE that is not in `## Artifacts produced` and not
in `## Deviations from PROPOSE`. Fix: either produce it, or record it as
dropped with a justification.

## 8. Retroactive criteria

Adding a criterion because an artifact was produced. Fix: criteria come
from FRAME. New criteria reopen FRAME, not BUILD.
