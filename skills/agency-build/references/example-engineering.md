# BUILD — api-rate-limiting-rollout (worked example)

## Log (one row per FRAME criterion)

- [x] Criterion 1 — 429 + Retry-After → `middleware/rate_limit.ts` + `tests/integration/rate_limit.spec.ts`.
- [x] Criterion 2 — p95 ≤ +5% → `perf/rate_limit/baseline.json` vs `perf/rate_limit/after.json`.
- [x] Criterion 3 — existing tests pass → CI #4821 (flag on) and #4822 (flag off).
- [x] Criterion 4 — metrics queryable → `metrics/rate_limit.ts` + dashboard `api-rate-limits`.

## Deviations from PROPOSE

- The per-tenant override list moved from `config/` to the feature-flag
  system — the flag system already had per-tenant targeting; duplicating
  it in config would risk drift.

## Artifacts produced (grouped by domain)

- Engineering:
  - `middleware/rate_limit.ts`
  - `config/rate_limits.ts`
  - `metrics/rate_limit.ts`
  - `flags/registry.ts` (updated)
- Testing:
  - `tests/unit/rate_limit.spec.ts`
  - `tests/integration/rate_limit.spec.ts`
  - `perf/rate_limit/run.sh`
- Product:
  - `docs/api/rate-limits.md`
  - `rollout/plan.md`

## Cross-domain handoffs

- Engineering → Testing: flag `rate_limit_v1` enabled in staging. Done.
- Engineering → Product: response shape frozen in `docs/api/rate-limits.md`. Done.

## Assigned team

- Domain: Backend Architect (primary), Senior Developer (middleware),
  DevOps Automator (flag wiring + dashboard) — Engineering.
- Domain: API Tester (integration), Performance Benchmarker (load test) — Testing.
- Domain: Technical Writer (docs + rollout plan) — Product.
- Process steward: Experiment Tracker — logs per-criterion status;
  confirms every criterion has an artifact and every deviation is
  recorded.

## Gates

- Domain gate: N/A — deferred to VERIFY
- Process gate: Experiment Tracker — PASS
