# The two-gate model

Every Agency-Flow phase closes with **two independent gates**.

| Gate         | Question                                                 | Signed by                                       |
|--------------|----------------------------------------------------------|-------------------------------------------------|
| Domain gate  | *Is the artifact good?*                                  | A competent agent in that phase's domain — never the builder, in VERIFY |
| Process gate | *Was the phase done correctly?*                          | A Project Management agent                      |

## What the process gate asks

- Does every FRAME criterion have an owner and an artifact?
- Does every cross-domain dependency have an owner and a date?
- Are all prior gates `PASS`?
- Is the phase file complete (no missing sections, no silent deviations)?

## Per-phase applicability

| Phase     | Domain gate                                | Process gate                                |
|-----------|--------------------------------------------|---------------------------------------------|
| RESEARCH  | Yes — research quality                     | Yes — questions serve a FRAME criterion     |
| FRAME     | Yes — goal + criteria + scope              | Yes — staffing feasible, criteria measurable|
| PROPOSE   | Yes — design coherent, risks bounded       | Yes — dependencies owned and dated          |
| BUILD     | **N/A** — deferred to VERIFY               | Yes — every criterion tracked, handoffs done|
| VERIFY    | Yes — independent verifier, evidence-backed| Yes — verifier independence confirmed       |
| SHIP      | **N/A** — passed at VERIFY                 | Yes — references, changelog, tag, follow-ups|
| MEASURE   | Yes — metrics and outcomes                 | Yes — follow-ups ingested                   |

## Why the exceptions

- **BUILD** is production, not review. A domain gate here would be
  self-attestation.
- **VERIFY** is where domain quality is checked, by an agent who did not
  build.
- **SHIP** consumes an artifact already verified. Its job is delivery.

## The iron rule

Neither gate substitutes the other.

- A green process gate cannot rescue a failed domain gate.
- A green domain gate cannot excuse a broken process gate.
- Both `PASS` is the only state that advances a phase.
