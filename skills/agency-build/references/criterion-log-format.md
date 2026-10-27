# Criterion log format

Every row in `## Log` follows this shape:

```
- [<x| >] <FRAME criterion text or short label> → <artifact path or URL or named action>.
```

## Why rigid

The process steward greps `- [ ]` to count criteria and checks the arrow
for a pointer. A row without `→` is malformed. A row without a path is
malformed.

## Good examples

```
- [x] Criterion 1 — 429 + Retry-After → `middleware/rate_limit.ts` + `tests/integration/rate_limit.spec.ts`.
- [x] Criterion 2 — p95 ≤ +5% → `perf/rate_limit/baseline.json` vs `perf/rate_limit/after.json`.
- [x] Criterion 3 — existing tests pass → CI #4821 (flag on) and #4822 (flag off).
- [x] Criterion 4 — metrics queryable → dashboard `api-rate-limits` + unit test `metrics/rate_limit.spec.ts`.
```

## Bad examples (process gate fails)

```
- [x] Implemented rate limiting. (no criterion label, no artifact)
- [x] Criterion 1 → see PR. (pointer is not concrete)
- [x] Works. (no shape at all)
- [ ] Criterion 4 → TBD. (unchecked, not done)
```

## Checkbox semantics

- `[x]` = artifact exists and satisfies the criterion.
- `[ ]` = not yet produced. A BUILD file with `[ ]` rows is not closed.

There is no `[~]`, no `[/]`, no "in progress". If it is not `[x]`, BUILD
is not done.
