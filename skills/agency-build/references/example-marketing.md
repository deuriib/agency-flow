# BUILD — q2-developer-outreach (worked example)

## Log (one row per FRAME criterion)

- [x] Criterion 1 — 500 signups → attribution live; weekly checkpoints in `campaign/attribution.md`.
- [x] Criterion 2 — $0 CPS → `campaign/spend.md` records $0 across all channels.
- [x] Criterion 3 — activation ≥60% → cohort defined in `analytics/cohorts/q2-outreach.json`; landing copy reviewed for expectation accuracy.
- [x] Criterion 4 — 2 talks → 4 submissions in `campaign/talks/submissions.md`; 2 confirmations in `campaign/talks/confirmations/`.

## Deviations from PROPOSE

- Added a 5th newsletter send (PROPOSE planned 4) because RESEARCH data
  showed the audience tolerates 5 sends without unsubscribing.
- Demo #2 was shortened from 4 min to 2.5 min to match the RESEARCH
  finding that <3 min demos have the highest completion.

## Artifacts produced (grouped by domain)

- Marketing:
  - `campaign/brief.md`
  - `campaign/newsletter/` (5 sends)
  - `campaign/talks/submissions.md`, `campaign/talks/deck.pdf`, `campaign/talks/confirmations/` (2 confirmations)
  - `campaign/attribution.md`
  - `campaign/spend.md` ($0)
- Content:
  - `content/landing.md`
  - `content/blog/post.md`
  - `content/demos/` (3 scripts, all < 3 min)
- Design:
  - `design/landing/` (Figma + exported assets)
  - `design/assets/` (thumbnails, talk slide template)
- Product:
  - `oss/readme-updates.md` (3 repos updated)
  - `product/claims-review.md`

## Cross-domain handoffs

- Content → Design: landing copy frozen in `content/landing.md`. Done.
- Marketing → Product: attribution plan approved in `campaign/attribution.md`. Done.
- Design → Content: thumbnails delivered for demo scripts. Done.
- Product → Marketing: README updates complete in `oss/readme-updates.md`. Done.

## Assigned team

- Domain: Growth Hacker (Marketing, lead), Content Creator (newsletter + blog), Trend Researcher (talks) — Marketing.
- Domain: Content Creator (demos), Technical Writer (landing + blog) — Content.
- Domain: Brand Guardian, UI Designer, Whimsy Injector — Design.
- Domain: Sprint Prioritizer (claims + README), Studio Producer — Product.
- Process steward: Experiment Tracker — logs per-criterion status;
  confirms every criterion has an artifact and every deviation is
  recorded.

## Gates

- Domain gate: N/A — deferred to VERIFY
- Process gate: Experiment Tracker — PASS
