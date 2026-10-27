# SHIP — anti-patterns

## 1. SHIP as a summary

Release notes copy-pasted from BUILD. Fix: release notes are user-facing,
not internal. Rewrite.

## 2. Follow-ups dropped

VERIFY had two conditions; SHIP has none. Fix: every condition becomes a
follow-up with owner and date.

## 3. Domain gate reappears

SHIP file has `Domain gate: PASS` because someone "wanted to be safe".
Fix: domain quality was confirmed at VERIFY; SHIP is delivery.

## 4. Missing VERIFY reference

`## References` skips VERIFY. Fix: all four references are mandatory.

## 5. New work in SHIP

"Also, while we were shipping, we added..." Fix: new work reopens FRAME
or becomes a MEASURE follow-up. Never a SHIP surprise.

## 6. Verdict paraphrase

SHIP writes `PASS` when VERIFY said `PASS-WITH-CONDITIONS`. Fix: quote
exactly.

## 7. Changelog mismatch

Changelog lists work not in BUILD, or misses work that is. Fix: changelog
must be a bijection with BUILD's `## Artifacts produced` (modulo
grouping).
