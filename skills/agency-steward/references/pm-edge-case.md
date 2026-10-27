    # PM-as-deliverable edge case

Rare, but real: a project whose output is a roadmap, a sprint plan, a
Jira workflow, or an experiment tracker.

## The rule

When PM work **is** the artifact:

1. The PM agent acts as **domain producer** for that artifact — and may
   sign the domain gate for it.
2. The **process gate must be signed by a different PM agent** (or the
   `Studio Producer` wildcard if the division is short-staffed).
3. FRAME must declare this split explicitly in `## Assigned team`.

## Why

The two-gate model requires the domain and process signers to be
different agents. If the same agent signs both, self-certification.

## Recording format in FRAME

```
## Assigned team
- Domain (PM-as-deliverable): <PM agent A> — produces the roadmap.
- Domain: <other-domain agent(s)> — <why each>.
- Process steward: <PM agent B> — signs process gates; independent of A.
```

## What triggers this edge case

- The project's success criteria include items like "a finalized roadmap
  exists", "a Jira workflow is defined", "a sprint plan is published".
- The PRIMARY deliverable is a PM artifact, not a software/campaign/
  content artifact.

## What does NOT trigger it

- The project produces a roadmap **as one of many** artifacts. That is
  normal PROPOSE planning, not this edge case.
- The PM is the process steward for a non-PM project. That is the default,
  not this case.

## What to do when in doubt

Ask: "Is the artifact the PM produces one that the project would ship
without?" If yes, this edge case applies. If no, it is normal PM planning.

If neither agent can be named explicitly, the phase does not close. This
is the only case where the process steward has a hard external
dependency — another PM agent — but the rule does not flex.
