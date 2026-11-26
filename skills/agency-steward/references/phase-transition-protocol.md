# Phase transition protocol

Every phase-to-phase transition runs this protocol. It is the operational
core of the process steward's job.

## Before opening the next phase file

1. **Verify the current phase file exists.**
   Canonical artifact for the phase (see `docs/agency-flow/workspace-format.md`):
   - Frame: `00-intent.md`
   - Propose: `01-proposal.md`
   - Build: `03-artifacts/build-log.md`
   - Verify: `06-validation/verify-report.md`
   - Ship: `05-deliverables/ship-notes.md`
   - Measure: `07-measure.md`
   - Research (optional): `00-research.md`
   If missing, the phase did not happen.

2. **For the PROPOSE → BUILD transition, verify human approval.**
   `01-proposal.md` must carry `status: approved` with a non-empty
   `approved_by`, and `flow resume <job-id>` must report a build step.
   If the run is still `awaiting-approval`, refuse with "Human approval
   required: run `flow approve <job-id> --by <name>`."

3. **Verify both applicable gates are `PASS`.**
   - For phases with a domain gate: both lines present, both `PASS`.
   - For BUILD and SHIP: only the process gate line, `PASS`.
   - If any gate is `PENDING`, refuse to advance.

3. **Verify no orphan criteria.**
   Re-read FRAME. For each criterion, grep the current phase file for a
   reference. Every criterion must appear.

4. **Verify no silent deviations.**
   If the phase file says "None" but the artifacts differ from the prior
   phase's plan, treat as a violation and reopen the prior phase.

5. **Verify cross-phase dependencies are still owned.**
   Every `Due:` in the prior phase that has not passed must still have a
   live owner.

## When opening the next phase

1. **Assign domain and process agents.**
   Read the FRAME domain profile. Map to available agents. Record wildcard
   use with justification.

2. **Write the `## Assigned team` block** with both fields.

3. **Announce the transition.**
   In one line: "Phase X → Phase Y. Domain gate: <agent>. Process gate:
   <PM agent>." This is what the user sees.

## Refusal protocol

If any check fails, respond with:

```
Phase transition refused.
Blocking phase: <phase>
Blocking gate: <domain | process>
Reason: <specific failure>
Required action: <who must do what>
```

Do not soften. Do not advance on a promise.

## What the transition protocol does NOT do

- It does not review domain quality. That is the domain agent's job.
- It does not enforce the domain-agent availability. Wildcards are
  handled per `wildcard-chain.md`.
- It does not alter phase content. The process steward signs, it does not
  rewrite.
