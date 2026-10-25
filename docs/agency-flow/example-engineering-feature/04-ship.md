# SHIP — example-engineering-feature

## Release notes (user-facing)
- Added robust rate limiting on authentication endpoints (`/api/auth/login`) to enhance platform security against brute-force attacks.

## Version / tag
- `v1.2.0`

## Changelog
- feat(auth): add Redis-backed rate limiting middleware on login routes
- test(security): add comprehensive unit and integration test suite for rate limiter

## References
- FRAME: `docs/agency-flow/example-engineering-feature/00-frame.md`
- PROPOSE: `docs/agency-flow/example-engineering-feature/01-propose.md`
- BUILD: `docs/agency-flow/example-engineering-feature/02-build.md`
- VERIFY: `docs/agency-flow/example-engineering-feature/03-verify.md` (Verdict: PASS)

## Follow-ups carried from VERIFY
- None.

## Assigned team
- Domain: DevOps Engineer, Senior Backend Developer — release deployment and tag creation.
- Process steward: Senior Project Manager — confirmed release checklist and changelog completeness.

## Gates
- Domain gate: N/A — passed at VERIFY
- Process gate: Senior Project Manager — PASS
