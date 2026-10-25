# Testing Agency-Flow

Agency-Flow has testing suites for plugin code and workflow behavior:

- **`tests/`** — plugin loading, manifest wiring, and verification utilities.
- **`evals/`** — workflow phase adherence and governance evaluations.

## Plugin tests

Live in `tests/`. Currently:

- `tests/opencode/` — bash tests for OpenCode plugin loading, bootstrap caching, and tool registration.
- `tests/codex-plugin-sync/` — bash sync verification.
- `tests/kimi/` — bash/Python checks for Kimi plugin manifest wiring.
- `tests/antigravity/` — verification of Antigravity plugin manifest and layout.

Run plugin tests via the relevant directory's `run-*.sh` script.
