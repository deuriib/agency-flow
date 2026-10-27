# PROPOSE — api-rate-limiting-rollout (worked example)

## Approach

Token-bucket limiter evaluated in the API gateway middleware. Bucket state
stored in Redis (existing cluster). Config read from a per-tenant table.
Rejected alternative: per-endpoint counters in the app layer — too invasive
and duplicates the gateway's auth path.

## Planned deliverables (grouped by domain)

- Engineering:
  - `middleware/rate_limit.ts` — supports criterion 1 (429 + Retry-After).
  - `config/rate_limits.ts` — supports criterion 1.
  - `metrics/rate_limit.ts` — supports criterion 4 (metrics queryable).
  - Feature flag wiring in `flags/registry.ts` — supports criterion 2 (no regression via gradual rollout).
- Testing:
  - Unit tests for bucket math and 429 response shape — supports criterion 1.
  - Integration tests against a mock Redis cluster — supports criteria 1 and 3.
  - Load test script under `perf/rate_limit/` — supports criterion 2.
- Product:
  - Docs page `docs/api/rate-limits.md` — supports criterion 1 (clients need to know).
  - Rollout plan in `rollout/plan.md` — supports criteria 2 and 3.

## Risks

- Redis outage → limiter fails open → mitigate with circuit breaker + alert. Severity: high.
- Legit bursty integrations → mitigate with per-tenant override list. Severity: medium.
- Latency regression on hot path → mitigate with load test gate. Severity: medium.

## Verification plan

- Criterion 1 (429 + Retry-After) → integration test in Testing.
- Criterion 2 (p95 ≤ +5%) → load test comparison vs baseline.
- Criterion 3 (existing tests pass) → CI run with flag on and off.
- Criterion 4 (metrics queryable) → manual dashboard check + unit test on emit.

## Cross-domain dependencies

- Engineering ships flag before Testing can run integration tests. Owner: Project Shepherd. Due: 2026-W18.
- Product finalizes docs wording after Engineering freezes response shape. Owner: Project Shepherd. Due: 2026-W19.

## Assigned team

- Domain: Backend Architect (Engineering) — owns the design.
- Domain: API Tester (Testing) — owns the verification plan.
- Domain: Technical Writer (Product) — owns the docs deliverable.
- Process steward: Project Shepherd — owns the two cross-domain dependencies and their dates.

## Gates

- Domain gate: Backend Architect — PASS
- Process gate: Project Shepherd — PASS
