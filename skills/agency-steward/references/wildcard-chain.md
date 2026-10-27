# Wildcard chain

Applied when a declared domain in FRAME has no available agent.

## The chain (in order)

1. **Domain agent** — a real agent from the declared division.
2. **Studio Producer** (Project Management) — multi-division orchestration
   as wildcard.
3. **Senior Developer** (Engineering) — generic technical wildcard.

## The PM-specific chain (for process gates only)

If the PM division is unavailable:

1. **Studio Producer** signs process gates.
2. If Studio Producer is also unavailable, **Senior Developer** signs.
3. Either fallback is recorded as a **risk** in FRAME.

## Recording format

Wildcard use always appears in `## Assigned team`:

```
- Domain: <wildcard-agent> — wildcard for <missing-domain>; reason: <why>.
```

## Consequences

- The wildcard **records** the gap; it does not hide it.
- The wildcard still owes the full gate deliverable — no reduced scope.
- If a domain is missing for more than one phase, the risk is elevated in
  FRAME, not repeated silently.

## What the wildcard cannot do

- Sign a domain gate in VERIFY if it built the artifact in BUILD. The
  independence rule still applies. Wildcards do not exempt the verifier.
- Skip the two-gate model. A wildcard signs one of the two gates, never
  both.
