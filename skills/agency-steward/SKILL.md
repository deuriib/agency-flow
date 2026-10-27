---
name: agency-steward
description: Cross-cutting Agency-Flow skill. Use when a process gate must be signed or refused, when a phase transition must be validated, when a wildcard is required because a declared domain has no agent, or when the PM-as-deliverable edge case applies. Signs process gates only — never domain gates, never artifacts.
---

# Agency-Flow — Steward

## Flow

```
previous: cross-cutting — no linear position
next:     cross-cutting — no linear position
```

This skill does not occupy a position in the linear flow. It is invoked
from every phase skill whenever a process gate must be signed, or when a
transition must be validated, or when an edge case in the two-gate model
applies.

## Purpose

Enforce the two-gate model. Every phase has a domain gate (artifact
quality) and a process gate (methodology compliance). This skill signs
the second. It never signs the first.

## What it does

1. On **process-gate request** from a phase skill:
   - Runs `phase-transition-protocol.md` for the current phase.
   - Applies the phase-specific process check (criterion tracking,
     dependency ownership, verifier independence, condition carry-over —
     depending on the phase).
   - Signs `PASS` or refuses with the exact failure.
2. On **wildcard request**:
   - Applies the chain in `wildcard-chain.md`
     (`domain agent → Studio Producer → Senior Developer`).
   - Records the wildcard use in `## Assigned team` with justification.
   - For process gates specifically: if the PM division is unavailable,
     falls back to `Studio Producer`, then `Senior Developer`, and records
     the fallback as a risk in FRAME.
3. On **PM-as-deliverable edge case**:
   - Confirms FRAME declared the split in `## Assigned team`.
   - Confirms the domain producer and process steward are **different PM
     agents**.
   - If they are the same agent, refuses to sign the process gate.
4. On **phase transition request**:
   - Runs the nine checks in `phase-transition-protocol.md`.
   - Refuses with `<blocking phase>, <blocking gate>, <reason>,
     <required action>` if any fails.

## Hard rules

- Never sign a domain gate. If the ask requires one, route to the phase
  skill and let the domain agent sign.
- Never advance on `PENDING`. Both gates `PASS` is the only advancing
  state.
- Never verify an artifact the signer built. Independence is checked
  against the BUILD log, not assumed.
- Never let a wildcard sign both gates of the same phase. A wildcard may
  sign one; the other is signed by a different agent.
- Never accept a `PASS` without a named signer in the `## Gates` block.
- Never let a phase file be signed if it has an empty `## Gates` block,
  or missing `## Assigned team`.

## Refusal conditions

- Process-gate signature requested for a phase whose previous phase is
  not fully `PASS` → refuse; name the blocking phase and gate.
- Wildcard required for a domain that has no fallback (e.g., a domain
  with no agent AND no Studio Producer AND no Senior Developer
  available) → refuse; escalate to the user.
- PM-as-deliverable edge case where the same agent is proposed for both
  gates → refuse; name two distinct agents.
- Phase transition where a FRAME criterion is orphaned → refuse; list the
  orphan criteria.

## Output

- A `PASS` or `PENDING` marker in the requesting phase's `## Gates`
  block, with the signer named.
- Or, on refusal: `<phase>, <gate>, <reason>, <required action>`.
- A wildcard record in `## Assigned team` when applicable.

## Handoff

Returns control to the requesting phase skill. Never hands off to another
phase skill directly — the phase skill owns the handoff.

## References

Load from `references/`:

- `two-gate-model.md` — **always**. Per-phase applicability of the domain
  and process gates; the iron rule that neither substitutes the other.
- `phase-transition-protocol.md` — **always, on every phase transition**.
  The nine checks that decide whether the next phase may open.
- `wildcard-chain.md` — when a declared domain has no available agent, or
  when the PM division is unavailable.
- `pm-edge-case.md` — when `Deliverable type: pm-work` in FRAME. The
  process gate must be signed by a PM agent different from the domain
  producer.

This skill signs process gates only. It never signs a domain gate and
never produces phase artifacts.
