# PROPOSE — q2-developer-outreach (worked example)

## Approach

Lead with a single proof-heavy narrative ("cut p95 latency by 40% in one
sprint, no new infra") and distribute it through the three highest-
converting channels from RESEARCH. Reject a broad multi-channel spray;
concentrate on depth per channel.

## Planned deliverables (grouped by domain)

- Marketing:
  - Campaign brief `campaign/brief.md` — supports criteria 1–4.
  - Newsletter sequence (5 sends) `campaign/newsletter/` — supports criterion 1.
  - Conference talk submissions (4, targeting 2 accepted) `campaign/talks/` — supports criteria 1 and 4.
  - Attribution plan `campaign/attribution.md` — supports criterion 1.
  - Spend log `campaign/spend.md` — supports criterion 2.
- Content:
  - Landing page copy `content/landing.md` — supports criterion 1.
  - 3 short demo scripts `content/demos/` — supports criterion 1.
  - Blog post with code samples `content/blog/post.md` — supports criterion 1.
- Design:
  - Landing page visual `design/landing/` — supports criterion 1.
  - Demo thumbnails + talk slide template `design/assets/` — supports criteria 1 and 4.
- Product:
  - README updates on 3 OSS repos `oss/readme-updates.md` — supports criterion 1.
  - Claims review `product/claims-review.md` — supports criterion 3.

## Risks

- Message overpromises on latency → mitigate with claims review by Product before any asset ships. Severity: high.
- Conference acceptance not guaranteed → mitigate by submitting 4, targeting 2. Severity: medium.
- Signup tracking gaps → mitigate with attribution plan approved before launch. Severity: high.
- Activation below 60% → mitigate with landing copy that sets accurate expectations. Severity: medium.

## Verification plan

- Criterion 1 (500 signups) → attribution dashboard. Domain: Marketing.
- Criterion 2 ($0 CPS) → spend log; any paid line item fails. Domain: Marketing.
- Criterion 3 (activation ≥60%) → product analytics cohort. Domain: Product.
- Criterion 4 (2 talks) → conference confirmation emails. Domain: Marketing.

## Cross-domain dependencies

- Content needs RESEARCH findings frozen before writing. Owner: Content Creator. Due: 2026-W20.
- Design needs landing copy frozen before visual. Owner: UI Designer. Due: 2026-W21.
- Marketing needs attribution plan approved by Product before launch. Owner: Project Shepherd. Due: 2026-W22.
- Product needs README updates ready before talk submissions go out. Owner: Sprint Prioritizer. Due: 2026-W22.

## Assigned team

- Domain: Growth Hacker (Marketing) — owns campaign brief and attribution.
- Domain: Content Creator (Content) — owns newsletter, blog, and demo scripts.
- Domain: Brand Guardian (Design) — owns visual consistency and landing visual direction.
- Domain: Sprint Prioritizer (Product) — owns claims review and README updates.
- Process steward: Project Shepherd — owns the four cross-domain dependencies and their dates.

## Gates

- Domain gate: Growth Hacker — PASS
- Process gate: Project Shepherd — PASS
