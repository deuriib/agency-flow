# FRAME — api-rate-limiting-rollout (worked example)

## Goal

Add per-tenant rate limiting to the public API so that a single tenant
cannot degrade service for others, without breaking existing integrations.

## Success criteria (measurable)

- [ ] A tenant exceeding 1,000 req/min receives 429 with `Retry-After`.
- [ ] p95 latency for tenants under the limit does not regress more than 5%.
- [ ] Existing integration tests pass unchanged.
- [ ] Rate limit metrics are queryable by tenant in the dashboard.

## Scope

- In: middleware, config store, metrics, docs, rollout plan.
- Out: per-endpoint weights (future), paid-tier differentiation (future).

## Domain profile

- Domains involved: Engineering, Testing, Product
- Deliverable type: code
- Optional phases: research? no — measure? no

## Constraints

- Must not require client SDK changes.
- Rollout behind a feature flag; default off.
- No new external dependency unless reviewed by the platform team.

## Assigned team

- Domain: Sprint Prioritizer (Product) — translates the business goal
  into criteria.
- Domain: Backend Architect (Engineering) — confirms the goal is
  technically sound.
- Process steward: Senior Project Manager — confirms scope is achievable
  with the staffed divisions and that no criterion is unmeasurable.

## Gates

- Domain gate: Sprint Prioritizer — PASS
- Process gate: Senior Project Manager — PASS (staffing feasible, scope
  bounded, all criteria measurable)
