# Cross-domain dependency format

Every dependency in PROPOSE follows this exact line:

```
- <what depends on what> — Owner: <agent> — Due: <YYYY-WW or YYYY-MM-DD>
```

## Why the format is rigid

The process steward greps for these fields. A line missing `Owner:` or
`Due:` is a process-gate failure. Rigidity is the point.

## Examples

**Good:**

```
- Content needs RESEARCH findings frozen before writing. — Owner: Content Creator. — Due: 2026-W20.
- Design needs landing copy frozen before visual. — Owner: UI Designer. — Due: 2026-W21.
- Engineering ships flag before Testing can run integration. — Owner: Project Shepherd. — Due: week 1.
```

**Bad (process gate fails):**

```
- Content needs findings. — Owner: TBD. — Due: ASAP.
- Design and Marketing coordinate. — (no owner, no date)
- Engineering → Testing handoff. — Owner: Engineering. — Due: soon.
```

## Due date conventions

- Prefer **absolute dates** (`2026-05-15`), not relative (`in 2 weeks`).
- Week granularity is allowed: `2026-W20`.
- "Soon", "ASAP", "by end of phase" are all invalid — they are not dates.

## When a dependency has no owner

That is a process-gate failure, not a valid state. If the owner cannot be
named, the dependency is not ready and PROPOSE does not close.
