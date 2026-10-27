# Domain profile — decision and consequences

## What it is

Three fields inside FRAME that downstream phases read:

```markdown
## Domain profile
- Domains involved: <list>
- Deliverable type: <one value>
- Optional phases: research? <yes/no> — measure? <yes/no>
```

## How each downstream phase uses it

| Phase     | How it uses `Domains involved`                             |
|-----------|------------------------------------------------------------|
| PROPOSE   | Groups planned deliverables by domain; assigns domain owners |
| BUILD     | Groups produced artifacts by domain; assigns domain agents |
| VERIFY    | Reads which domains must sign evidence per criterion        |
| SHIP      | Uses domains to decide release-notes ownership             |

| Phase     | How it uses `Deliverable type`                              |
|-----------|-------------------------------------------------------------|
| PROPOSE   | Adjusts the shape of `## Planned deliverables`             |
| BUILD     | Adjusts the shape of `## Artifacts produced`               |
| SHIP      | Adjusts release-notes tone                                  |

| Phase     | How it uses `Optional phases`                               |
|-----------|-------------------------------------------------------------|
| RESEARCH  | Whether this phase exists at all                            |
| MEASURE   | Whether this phase exists at all                            |

## Common mistakes

- **Listing a division the PM will use as a wildcard.** If `Marketing`
  appears in the profile but no Marketing agent is installed, the wildcard
  chain must be recorded — the profile does not auto-resolve.
- **Naming a deliverable type not in the canonical list.** Downstream
  phases branch on the value; a new value silently defaults to "generic".
- **Changing the profile after PROPOSE.** FRAME is closed. If the profile
  was wrong, reopen FRAME with a note, not silently.

## When to revise the profile

Revise **before** PROPOSE starts, and **only** if a domain agent is
confirmed missing or a producer domain was omitted by mistake. Revising
after PROPOSE is a scope change: mark it in PROPOSE as `## Deviations
from FRAME` with the reason.
