# SHIP — <slug>

## Release notes (user-facing)

<2–4 sentences in user-facing language. What changed, why it matters.>

## Version / tag

<semver or identifier>.

## Changelog

- <type>(<scope>): <one-line description>.
- <type>(<scope>): <one-line description>.

## References

- FRAME: `00-frame.md`
- PROPOSE: `01-propose.md`
- BUILD: `02-build.md`
- VERIFY: `03-verify.md` (verdict: <PASS | PASS-WITH-CONDITIONS | FAIL>)

## Follow-ups carried from VERIFY

- <follow-up> — Owner: <agent>. Due: <date>.
- <follow-up> — Owner: <agent>. Due: <date>.

## Assigned team

- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates

- Domain gate: N/A — passed at VERIFY
- Process gate: <PM agent> — PASS / PENDING

## Rules

- **Domain gate is always `N/A`** in SHIP. If not, VERIFY did not close.
- **References must be present** — all four prior files.
- **VERIFY verdict is quoted**, not paraphrased.
- **Every VERIFY condition** becomes a SHIP follow-up with owner and date.
