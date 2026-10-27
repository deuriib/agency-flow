# BUILD — gate checklist (process gate only)

## Process gate (signed by PM)

- [ ] File lives at `docs/agency-flow/<slug>/02-build.md`.
- [ ] Every FRAME criterion has a log row.
- [ ] Every log row points to a concrete artifact (path, URL, or named
      action).
- [ ] Every deviation from PROPOSE is recorded with a justification.
- [ ] `## Artifacts produced` lists every artifact, grouped by domain.
- [ ] Every cross-domain handoff is marked `Done` or `Pending`.
- [ ] `## Gates` block is present with `Domain gate: N/A`.
- [ ] No artifact was added without a corresponding FRAME criterion
      (scope creep).
- [ ] No PROPOSE deliverable was silently dropped.

## Domain gate

Always `N/A`. Verify this line is written literally, not omitted.

## Rejection triggers

- Empty log row for any criterion.
- "See PR" as the only pointer (must be a concrete path or URL).
- Deviation recorded as "minor tweaks" without listing.
- Pending handoff with no owner named.
- Artifact added without criterion, or criterion with no artifact.
