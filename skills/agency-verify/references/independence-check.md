# Independence check

The verify skill must confirm — before signing the process gate — that the
verifier did not build the artifact.

## Procedure

1. Open `02-build.md`.
2. Extract every agent listed under `## Assigned team` and any agent
   named in log rows.
3. Extract the name of the proposed verifier.
4. If the verifier appears in step 2, **refuse**. State which artifact
   the verifier built and reopen VERIFY with a different verifier.
5. Write the confirmation in `## Assigned team`:
   `Process steward: <PM agent> — confirms verifier did not build any artifact (checked against 02-build.md).`

## What counts as "the builder"

- Any agent in BUILD's `## Assigned team` under a `Domain:` line.
- Any agent named in a `## Log` row as the producer of an artifact.
- Any agent in `## Cross-domain handoffs`.

## Wildcard path when the verifier is short-staffed

If no independent verifier exists for a domain:

1. Use `Reality Checker` (Testing) as the cross-domain verifier. It is
   generally not involved in any BUILD phase.
2. If `Reality Checker` was also in BUILD (rare — flag this), use the
   `Studio Producer` wildcard.
3. Record the wildcard in `## Assigned team` with a one-line
   justification.

## The single hard rule

No agent verifies their own artifact. Not for "small projects", not "just
this once". If no independent verifier exists, VERIFY does not close —
SHIP is blocked until one does.
