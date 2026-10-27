# BUILD — <slug>

## Log (one row per FRAME criterion)

- [ ] <criterion> → <artifact / action that satisfies it>.
- [ ] <criterion> → <artifact / action>.
- [ ] <criterion> → <artifact / action>.

## Deviations from PROPOSE

- <deviation> — <justification>.
- (or) None.

## Artifacts produced (grouped by domain)

- <domain>:
  - <artifact path or URL> — <what it is>.
- <domain>:
  - <artifact path or URL> — <what it is>.

## Cross-domain handoffs

- <handoff> — Done / Pending.

## Assigned team

- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates

- Domain gate: N/A — deferred to VERIFY
- Process gate: <PM agent> — PASS / PENDING

```

Rules:
- **Domain gate is always `N/A`** in BUILD. If you find yourself signing
  a domain gate here, you are reviewing, not building.
- **Every FRAME criterion gets a row.** No exceptions.
- **Every deviation** gets one line with a justification.
- **Every handoff** is `Done` or `Pending` — no third state.
