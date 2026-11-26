# Task List — Issue #9 Workspace Standardization

Every task quotes the requirement it satisfies. No feature outside the issue.

## P1 — Workspace Engine

### [x] T1.1 — Job-id validation + canonical layout constants
**Quotes:** "Implementar la creación automática del directorio `/workspace/{job-id}/`"; "Asegurar que los archivos generados respetan estrictamente el prefijo numérico".
**Acceptance:** `assertJobId` rejects uppercase, spaces, leading/trailing hyphen, `..`, absolute paths, >64 chars; accepts 2–64 char kebab-case. Canonical layout exported as data. Numeric prefix regex exported.
**Evidence:** `tests/workspace/job-id.test.mjs` green.

### [x] T1.2 — `workflow-state.md` read/write/update
**Quotes:** "Escribir el estado de cada paso del DAG en `workflow-state.md`"; "`workflow-state.md` como Fuente de Verdad … se puede reanudar con `flow resume {job-id}`".
**Acceptance:** Round-trip render→parse preserves job id, status, current phase, steps, checkpoints. `updateStep` changes one row. Unknown status rejected.
**Evidence:** `tests/workspace/state.test.mjs` green.

### [x] T1.3 — YAML task parser + schema validation
**Quotes:** "Migrar la generación de tareas al formato `/04-tasks/*.yaml` con validación de esquema"; "archivos `.yaml` validables".
**Acceptance:** Parses the documented schema; rejects missing fields, bad phase, bad status, `attempts` outside 0–3, `owner === validator`, non-array `depends_on`, malformed acceptance criteria. Serializer round-trips.
**Evidence:** `tests/workspace/tasks.test.mjs` green.

### [x] T1.4 — init / approve / resume / validate
**Quotes:** "Integrar la generación de `01-proposal.md` como un paso bloqueante (Human-in-the-Loop)"; "Separación de Specs y Deliverables".
**Acceptance:** `init` refuses an existing job dir; writes all canonical entries; proposal is `draft` and state is `awaiting-approval`. `resume` refuses while unapproved with a named blocker. `approve` requires a named approver and unlocks. `validate` reports missing entries, bad prefixes, schema errors, dependency cycles, self-validation.
**Evidence:** `tests/workspace/workspace.test.mjs` green.

### [x] T1.5 — CLI `flow` + bin wiring
**Quotes:** "se puede reanudar con `flow resume {job-id}`".
**Acceptance:** `flow init|approve|resume|task|validate` exit 0 on success, 1 on validation failure, 2 on usage, 3 on HITL block. `package.json` exposes `bin.flow`.
**Evidence:** `tests/workspace/cli.test.mjs` green.

### [x] T1.6 — Test suite
**Acceptance:** `node --test tests/workspace/` green; every behavior above asserted; no network, no sleeps, temp dirs only.
**Evidence:** captured test output in `06-validation/`.

### [x] T1.7 — Migration script
**Quotes:** "Actualizar la documentación"; migration mapping in ledger.
**Acceptance:** `scripts/migrate-workspace.mjs` dry-runs by default, `--write` applies the documented mapping, is idempotent, never deletes content without moving it.
**Evidence:** `tests/workspace/migrate.test.mjs` green.

## P2 — Methodology & Documentation

### [x] T2.1 — `workspace-format.md` + `docs/agency-flow/README.md`
**Quotes:** "Actualizar la documentación para reflejar que `agency-flow` es ahora el motor de Workspace".
**Acceptance:** README phase table points at canonical paths; new format doc specifies job id, layout, prefix rule, state file, task schema, CLI, HITL, resume, migration mapping.

### [x] T2.2 — Rules, AGENTS.md, root README
**Acceptance:** `rules/agency-flow.md` file conventions match the shipped layout; hard refusals include unapproved proposal and non-prefixed artifact. `AGENTS.md` lists the workspace test command. Root README documents the engine.

### [x] T2.3 — Skills + references path migration
**Acceptance:** every `00-frame.md`, `01-propose.md`, `02-build.md`, `03-verify.md`, `04-ship.md`, `05-measure.md` reference in `skills/` points at the canonical path. No dangling reference.
**Evidence:** `grep -rn -E '00-frame\.md|01-propose\.md|02-build\.md|03-verify\.md|04-ship\.md|05-measure\.md' skills/ rules/ README.md AGENTS.md` → 0 matches; legacy names survive only in the migration table of `docs/agency-flow/workspace-format.md`.

### [x] T2.4 — Example workspaces migration
**Acceptance:** both examples migrated with the script, include `workflow-state.md`, and `flow validate` passes on them.

## P3 — Gate remediation (Reality Checker, attempt 1 → PASS)

### [x] R1 — Approve works without frontmatter + migration normalizes
**Evidence:** `tests/workspace/workspace.test.mjs` "approve works on a proposal that has no frontmatter"; `migrate.test.mjs` "a migrated proposal is approvable"; 0 stale paths.

### [x] R2 — `flow step` advances DAG state with attempt counting
**Evidence:** `workspace.test.mjs` recordStep tests; `cli.test.mjs` step retries test; end-to-end smoke verified.

### [x] R3 — `flow task list` validates its job id
**Evidence:** `cli.test.mjs` traversal test.

### [x] R4 — inferState measure/research consistency
**Evidence:** `migrate.test.mjs` measure + research tests.

### [x] R5 — Bidirectional validate + named approver
**Evidence:** `workspace.test.mjs` validate tests.

### [x] R6 — Docs/skills/examples aligned
**Evidence:** stale-path grep → 0 matches; both examples `flow validate` PASS.
