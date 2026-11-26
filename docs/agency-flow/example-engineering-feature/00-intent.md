# FRAME — example-engineering-feature

## Goal
Implement a secure API rate-limiting middleware for user authentication endpoints to prevent brute-force attacks and ensure system stability under high traffic.

## Success criteria (measurable)
- [ ] Rate limiter correctly blocks requests exceeding 10 requests per minute per IP on `/api/auth/login`.
- [ ] Returns HTTP 429 status code with a JSON error payload containing `retry_after`.
- [ ] Unit test coverage for rate-limiting logic reaches 100%.

## Scope
- In: Middleware implementation, Redis store adapter, unit tests, integration tests.
- Out: Frontend notification banners, global rate-limiting on non-auth routes.

## Domain profile
- Domains involved: Engineering, Security, Product
- Deliverable type: code
- Optional phases: research? no — measure? no

## Constraints
- Must complete within Redis latency constraints (<5ms overhead).

## Assigned team
- Domain: Senior Backend Developer, Security Engineer — domain expertise in API security and Redis caching.
- Process steward: Senior Project Manager — confirmed scope achievability and team staffing feasibility.

## Gates
- Domain gate: Security Engineer — PASS
- Process gate: Senior Project Manager — PASS
