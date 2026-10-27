# Slug conventions

- **Format**: kebab-case, lowercase, ASCII only.
- **Length**: 2–5 words.
- **Content**: the intent, not the phase.
- **No**: dates, version suffixes (unless v2 collision), owners' names.
- **Uniqueness**: verified with `ls docs/agency-flow/`.

| Intent                         | Good slug                  | Bad slug             |
|--------------------------------|----------------------------|----------------------|
| Rate-limit the public API      | `api-rate-limiting-rollout`| `rate-limit-task`    |
| Q2 developer campaign          | `q2-developer-outreach`    | `q2-campaign-2026`   |
| Redesign the login screen      | `login-screen-redesign`    | `ui-task`            |
| Migrate auth to OIDC           | `auth-oidc-migration`      | `migration`          |
| New pricing page               | `pricing-page-launch`      | `page-new`           |

If the slug will need to change later, it is the wrong slug now. Rename
before the FRAME file exists, never after.
