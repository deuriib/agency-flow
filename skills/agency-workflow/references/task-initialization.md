# Task initialization protocol

Use this reference when the user asks to start a new Agency-Flow task.

## Step 1 — Ask for the intent (one question)

> "What are we building, and in one sentence, why?"

Do not proceed until the user gives a one-sentence intent. If they give a
paragraph, ask them to compress. If they give a domain-specific answer
("build a landing page"), ask for the *why* ("to drive signups from X").

## Step 2 — Choose the job id

Kebab-case, 2–64 characters, unique, no dates, no owner names. Derive it from
the intent, not from the phase.

Good: `api-rate-limiting-rollout`, `q2-developer-outreach`.
Bad: `task-2026-04-15`, `frame-phase`, `new-project`, `New_Project`.

Check for collisions:

```
ls docs/agency-flow/
```

If the job id exists, append `-v2` (never overwrite). `flow init` refuses an
existing directory, so a collision cannot silently clobber a workspace.

## Step 3 — Create the workspace

```
flow init <job-id> --intent "<one sentence>"
```

The engine creates the canonical layout (`workflow-state.md`, `00-intent.md`,
`01-proposal.md`, `02-specs/` … `06-validation/`) and leaves the run
`awaiting-approval`. Do not create phase artifacts by hand; each phase fills
its own artifact.

## Step 4 — Hand off to the FRAME skill

The init skill does not write a phase artifact. It produces:

- the job id,
- the workspace,
- a one-paragraph task brief that the FRAME skill will read.

## Exit criteria

- `docs/agency-flow/<job-id>/` exists with `workflow-state.md` and the
  canonical directories.
- The workflow state is `awaiting-approval` at the `propose` phase.
- The job id is unique.
- The intent fits in one sentence.
- The task brief is written (in memory, not on disk — FRAME will persist
  it as the goal in `00-intent.md`).
