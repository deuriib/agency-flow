# MEASURE — anti-patterns

## 1. Metrics without targets

"512 signups" with no reference to the 500 target. Fix: every metric shows
`<value> (target <n> — <outcome>)`.

## 2. Learnings without numbers

"The campaign was well received." Fix: every learning cites a metric.

## 3. Flattering interpretation

Missed criterion 3 (58% vs 60%) reported as "essentially on track". Fix:
misses are reported as misses. MEASURE is the phase for honesty.

## 4. Follow-ups that are just wishes

"Improve next campaign" with no owner. Fix: every follow-up has an owner
and ingestion status.

## 5. No ingestion check

Follow-ups listed but never entered into a backlog. Fix: `Ingested: yes`
is required; if `no`, the reason is recorded.

## 6. Metric inflation

Reporting the metric that flatters. Fix: every FRAME criterion is
reported, including the one that missed.

## 7. Skipping MEASURE retroactively

Writing MEASURE long after launch with no data. Fix: MEASURE opens within
the declared measurement window. If not, it is declared `no` in FRAME at
the start, not faked later.
