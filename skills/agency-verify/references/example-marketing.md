# VERIFY — q2-developer-outreach (worked example)

## Result per criterion

- [x] Criterion 1 — PASS — 512 signups reached in week 9 (attribution dashboard snapshot in `campaign/attribution.md`).
- [x] Criterion 2 — PASS — `campaign/spend.md` shows $0 across all channels; audited by Analytics Reporter.
- [x] Criterion 3 — PASS — 64% 7-day activation (cohort `q2-outreach`).
- [x] Criterion 4 — PASS — 2 talk confirmations in `campaign/talks/confirmations/`.

## Findings (grouped by domain)

- Marketing: newsletter #3 had 2.1× the click rate of the rest; will influence Q3 planning. Severity: info.
- Content: blog post code samples were outdated by publish date (one SDK deprecation). Severity: low.
- Design: landing page mobile CTA was below the fold. Severity: medium. A/B tested and fixed on day 3 of launch.
- Product: claims review was accurate — no overpromise reached the landing page. Severity: info.

## Verdict

- Domain gate: PASS-WITH-CONDITIONS
- Process gate: PASS

## Conditions (if applicable)

- Fix mobile CTA position in the landing template before Q3 reuse. Owner: UI Designer. Due: 2026-W30.
- Refresh blog code samples to current SDK before next blog post. Owner: Content Creator. Due: 2026-W30.

## Assigned team

- Domain verifier: Reality Checker — independent review of all artifacts; no build involvement. Signs the domain gate.
- Domain support: Analytics Reporter (Marketing) — pulled attribution numbers. API Tester — validated tracking pixels. UX Researcher (Design) — validated mobile CTA finding.
- Process steward: Senior Project Manager — confirms the verifier did not build any artifact, that every verdict is evidence-backed, and that the two conditions are recorded for SHIP.

## Gates

- Domain gate: Reality Checker — PASS-WITH-CONDITIONS
- Process gate: Senior Project Manager — PASS
