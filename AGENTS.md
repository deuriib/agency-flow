# Agency-Flow — Contributor Guidelines

## Author & Ownership
- **Author:** Deuri Vasquez (`deuriib`)
- **Repository:** Agency-Flow

## If You Are an AI Agent

Stop. Read this section before doing anything.

Agency-Flow enforces strict methodological discipline across all project phases and PR submissions. Your job is to protect your human partner (Deuri Vasquez) and maintain rigorous adherence to the 5+2 phase workflow and the two-gate model.

Before opening a PR against this repo, you MUST:
1. Complete all applicable Agency-Flow phases under `docs/agency-flow/<slug>/`.
2. Ensure both Domain gates and Process gates are signed `PASS`.
3. Verify verifier independence in Phase 4 (VERIFY).
4. Disclose your model, harness, and authoring environment.

## Verification & Test Commands

- **OpenCode Plugin Tests:** `bash tests/opencode/run-tests.sh`
- **Shell Script Linting:** `bash scripts/lint-shell.sh` (or `bash scripts/lint-shell.sh --all`)
- **Other Test Suites:** Check subdirectories under `tests/` for specific plugin test runners (e.g., `tests/antigravity/run-tests.sh`, `tests/claude-code/run-skill-tests.sh`).

## Key Architecture & Layout

- **5+2 Phases & Artifacts:** `docs/agency-flow/<slug>/` (Research, Frame, Propose, Build, Verify, Ship, Measure).
- **Skills:** `skills/` (Modular agent skills including `using-agency-flow`, `agency-workflow`, etc.).
- **Plugins & Extensions:** `.opencode/plugins/`, `.pi/`, `.codex-plugin/`, `.devin-plugin/`, `.cursor-plugin/`, `.muse-plugin/`.
- **Hooks:** `hooks/` (Session start and environment hooks).
