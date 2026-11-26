# BUILD — example-engineering-feature

## Log (one row per FRAME criterion)
- [x] Rate limiter blocks requests exceeding 10 req/min/IP on `/api/auth/login` → `src/middleware/rateLimit.js`
- [x] Returns HTTP 429 status code with JSON error payload containing `retry_after` → `src/middleware/rateLimit.js`
- [x] Unit test coverage for rate-limiting logic reaches 100% → `tests/security/rateLimit.test.js`

## Deviations from PROPOSE
- None.

## Artifacts produced (grouped by domain)
- Engineering: `src/middleware/rateLimit.js`
- Testing: `tests/security/rateLimit.test.js`

## Cross-domain handoffs
- Redis cluster provisioning — Done

## Assigned team
- Domain: Senior Backend Developer — implementation and test authoring.
- Process steward: Senior Project Manager — logged completion status per criterion and verified artifact linkage.

## Gates
- Domain gate: N/A — deferred to VERIFY
- Process gate: Senior Project Manager — PASS
