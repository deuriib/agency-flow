# VERIFY — <slug>

## Result per criterion

- [ ] <criterion> — PASS/FAIL — <evidence: test name, screenshot path, metric snapshot>.
- [ ] <criterion> — PASS/FAIL — <evidence>.
- [ ] <criterion> — PASS/FAIL — <evidence>.

## Findings (grouped by domain)

- <domain>: <finding>. Severity: <low | medium | high>.
- <domain>: <finding>. Severity: <severity>.

## Verdict

- Domain gate: PASS / PASS-WITH-CONDITIONS / FAIL
- Process gate: PASS / FAIL

## Conditions (if applicable)

- <condition> — Owner: <agent>. Due: <date>.

## Assigned team

- Domain verifier: <agent> — independent, no build involvement.
- Domain support: <agent(s)> — <why each>.
- Process steward: <PM agent> — <what was confirmed>.

## Gates

- Domain gate: <agent> — PASS / PASS-WITH-CONDITIONS / FAIL
- Process gate: <PM agent> — PASS / FAIL

```

Rules:
- **Verifier must not be the builder.** Check the BUILD log first.
- **Every verdict** has evidence, not just a tick.
- **Conditions** carry an owner and a due date — they become SHIP
  follow-ups.
- **Domain gate is never `N/A`** in VERIFY. If it is N/A, VERIFY did not
  happen.
