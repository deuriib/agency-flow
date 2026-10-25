# PROPOSE — example-engineering-feature

## Approach
Implement Express/Fastify compatible middleware backed by Redis sorted sets (`ZSET`) to slide window rate limiting.

## Planned deliverables (grouped by domain)
- Engineering: `src/middleware/rateLimit.js` — satisfies rate limiting and HTTP 429 response criteria.
- Security: `tests/security/rateLimit.test.js` — validates brute-force mitigation and test coverage criteria.

## Risks
- Redis connection drop / timeout. Mitigation: Fallback memory cache with warning log.

## Verification plan
- Rate limiter blocks >10 req/min/IP — verified via automated integration test script.
- HTTP 429 with retry_after — verified via Postman/Supertest assertions.
- 100% test coverage — verified via Jest coverage report.

## Cross-domain dependencies
- Redis cluster provisioning — Owner: DevOps Engineer — Due: 2026-10-30

## Assigned team
- Domain: Senior Backend Developer, Security Engineer — architecture and test planning.
- Process steward: Senior Project Manager — confirmed dependency owner and schedule alignment.

## Gates
- Domain gate: Security Engineer — PASS
- Process gate: Senior Project Manager — PASS
