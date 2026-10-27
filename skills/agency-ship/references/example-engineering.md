# SHIP — api-rate-limiting-rollout (worked example)

## Release notes (user-facing)

Per-tenant API rate limiting is available behind the `rate_limit_v1` flag.
Default limit: 1,000 requests/minute per tenant. Exceeding tenants receive
HTTP 429 with `Retry-After`. Integrations under the limit are unaffected.
Limits and overrides are documented at `/docs/api/rate-limits`.

## Version / tag

`api-v4.12.0` (backend), `docs-v4.12.0` (documentation site).

## Changelog

- feat(api): per-tenant rate limiting behind `rate_limit_v1`.
- feat(metrics): per-tenant rate limit counters in `api-rate-limits`.
- docs(api): new `/docs/api/rate-limits` page and rollout plan.

## References

- FRAME: `00-frame.md`
- PROPOSE: `01-propose.md`
- BUILD: `02-build.md`
- VERIFY: `03-verify.md` (verdict: PASS-WITH-CONDITIONS)

## Follow-ups carried from VERIFY

- Redis-outage integration test before 100% rollout. Owner: API Tester. Due: 2026-W20.
- `info`-level log line before 25% rollout. Owner: Backend Architect. Due: 2026-W20.

## Assigned team

- Domain: DevOps Automator — release, tag, flag at initial 5%.
- Domain: Technical Writer (Product) — release notes and docs link.
- Process steward: Senior Project Manager — confirms references are
  complete, changelog covers all shipped artifacts, follow-ups have
  owners and dates, then closes the task.

## Gates

- Domain gate: N/A — passed at VERIFY
- Process gate: Senior Project Manager — PASS
