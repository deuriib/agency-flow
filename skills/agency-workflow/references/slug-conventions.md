# Job-id conventions

- **Format**: kebab-case, lowercase, ASCII only.
- **Length**: 2–64 characters.
- **Content**: the intent, not the phase.
- **No**: dates, version suffixes (unless `-v2` on collision), owner names.
- **Rejected by the engine**: uppercase, underscores, spaces, `..`, `/`, `\`,
  leading or trailing hyphens, double hyphens.
- **Uniqueness**: verified with `ls docs/agency-flow/`; `flow init` refuses an
  existing workspace rather than overwriting it.

| Intent                         | Good job id                | Bad job id           |
|--------------------------------|----------------------------|----------------------|
| Rate-limit the public API      | `api-rate-limiting-rollout`| `rate-limit-task`    |
| Q2 developer campaign          | `q2-developer-outreach`    | `q2-campaign-2026`   |
| Redesign the login screen      | `login-screen-redesign`    | `ui-task`            |
| Migrate auth to OIDC           | `auth-oidc-migration`      | `migration`          |
| New pricing page               | `pricing-page-launch`      | `page-new`           |

If the job id will need to change later, it is the wrong job id now. Rename
before `flow init`, never after: the workspace directory name is the job id
recorded in `workflow-state.md`.
