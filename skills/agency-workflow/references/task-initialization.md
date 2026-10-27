# Task initialization protocol

Use this reference when the user asks to start a new Agency-Flow task.

## Step 1 — Ask for the intent (one question)

> "What are we building, and in one sentence, why?"

Do not proceed until the user gives a one-sentence intent. If they give a
paragraph, ask them to compress. If they give a domain-specific answer
("build a landing page"), ask for the *why* ("to drive signups from X").

## Step 2 — Choose the slug

Kebab-case, unique, ≤ 5 words, no dates. Derive from the intent, not from
the phase.

Good: `api-rate-limiting-rollout`, `q2-developer-outreach`.
Bad: `task-2026-04-15`, `frame-phase`, `new-project`.

Check for collisions:

```
ls docs/agency-flow/
```

If the slug exists, append `-v2` (never overwrite).

## Step 3 — Create the folder

```
docs/agency-flow/<slug>/
```

Do not pre-create phase files. Each phase creates its own file when it
runs. Empty files create false gates.

## Step 4 — Hand off to the FRAME skill

The init skill does not write any phase file. It produces:

- the slug,
- the folder,
- a one-paragraph task brief that the FRAME skill will read.

## Exit criteria

- `docs/agency-flow/<slug>/` exists and is empty.
- The slug is unique.
- The intent fits in one sentence.
- The task brief is written (in memory, not on disk — FRAME will persist
  it as the FRAME goal).
