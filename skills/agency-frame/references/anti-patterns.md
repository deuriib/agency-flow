# FRAME — anti-patterns

## 1. The task list masquerading as a goal

"This project will build the landing page, run the campaign, and measure
results." That is three goals. Fix: pick one intent; the others become
separate projects or PROPOSE deliverables.

## 2. Adjectives as criteria

"Improved UX", "better performance", "engaged audience". Fix: replace
with a number ("p95 ≤ +5%", "60% 7-day activation", "≥ 500 signups").

## 3. Empty scope.Out

"No scope-out" means everything is in scope. Fix: name at least one
explicit exclusion — usually the highest-cost adjacent thing.

## 4. Domain profile as wish list

Listing Product, Design, Engineering, Marketing, Sales, Support for a
2-week project. Fix: list only divisions that will *produce* an artifact.

## 5. Optional phases declared for safety

`research? yes — measure? yes` on an internal bug fix. Fix: default is
`no`. Only declare optional phases when there is a specific need.

## 6. Constraints without numbers

"Must be fast", "must be good quality". Fix: "p95 ≤ +5%", "no regression
in existing tests".

## 7. Criteria the team cannot measure

"50% market share increase" without a baseline. Fix: if no measurement
exists, the criterion is aspirational and belongs in the goal's "why",
not in success criteria.

## 8. Goals that change during PROPOSE

The FRAME goal is a contract. If PROPOSE reveals it was wrong, VERIFY
will not have anything to check against. Fix: reopen FRAME explicitly
(new slug or amended file with a note), do not silently evolve the goal.
