# AGENCY-FLOW — Plugin Rules

Always-on. Loaded at session start. These rules are active whether or not
a skill has been invoked. They define behavior, scope, file conventions,
and refusals. The rest of Agency-Flow — templates, checklists, examples,
per-phase detail — lives in skills and is loaded on demand.

## What Agency-Flow is

A sequential 5+2 phase methodology that takes an intent to a release,
across any `agency-agents` division. Every artifact lives in
`docs/agency-flow/<slug>/`. Every phase closes with two independent
gates. Nothing advances on a promise.

## Scope

These rules apply when the user:

- Asks to start, resume, audit, or close an Agency-Flow task.
- Asks to produce, review, or sign any artifact under
  `docs/agency-flow/`.
- Asks about the methodology, its phases, its gates, or its file
  conventions.
- Asks to sign a process gate, resolve a wildcard, or apply the
  PM-as-deliverable edge case — even without naming Agency-Flow.

These rules do **not** apply to:

- One-off questions with no artifact (answer directly).
- Exploratory reading of code, docs, or configuration (answer directly).
- Tasks outside this plugin's domain.

When uncertain, invoke `agency-flow`. The cost of a false start is a
single question; the cost of a wrong deliverable is a rewritten phase.

## Skill map

Ten skills ship with this plugin. Know them before routing.

| Skill | Role |
| ------- | ------ |
| `using-agency-flow` | Routing, skill priority, resume protocol. Invoked first. |
| `agency-flow` | Entry — intent, slug, folder, research/measure decision |
| `agency-flow-research` | Optional discovery phase |
| `agency-flow-frame` | Goal, criteria, scope, domain profile |
| `agency-flow-propose` | Approach, deliverables, risks, dependencies |
| `agency-flow-build` | Production, criterion log, handoffs |
| `agency-flow-verify` | Evidence per criterion, independence check |
| `agency-flow-ship` | Release notes, changelog, follow-ups |
| `agency-flow-measure` | Post-launch outcomes, learnings |
| `agency-flow-steward` | Cross-cutting — process gates, wildcards, PM edge case |

Each phase skill declares `previous` and `next` in a flow block. Trust the
block over your own reasoning. The flow is written down so you do not have
to remember it.

## Non-negotiables

These eight rules are the core of the methodology. They override
convenience, urgency, and any reasoning that tries to soften them.

1. **Sequential phases.** One phase = one file under
   `docs/agency-flow/<slug>/`. No phase may be skipped. Optional phases
   (`research`, `measure`) are declared explicitly in FRAME as `yes` or
   `no` — never left implicit.

2. **Two-gate model.** Every phase has a domain gate and a process gate.
   - *Domain gate*: "Is the artifact good?" Signed by a domain agent.
   - *Process gate*: "Was the phase done correctly?" Signed by a PM
     process steward via `agency-flow-steward`.
   - Neither substitutes the other. Both `PASS` is the only advancing
     state.

3. **PM is process steward.** PM participates in every phase in exactly
   one mode: process steward. PM never leads a domain, never signs a
   domain gate, and does not produce the artifacts the project is judged
   on. The only exception is the PM-as-deliverable edge case, where the
   process gate must be signed by a **different** PM agent.

4. **Verifier independence.** In VERIFY, the verifier must not be the
   agent that built the artifact. This is checked by
   `agency-flow-steward` **before** the phase file opens.

5. **Artifacts as contract.** Roles are interchangeable; artifacts are
   the single source of truth. If it is not in the phase file, it did not
   happen.

6. **Explicit flow blocks.** Follow the `previous` and `next` in each
   skill. Do not invent jumps, reorder phases, or skip phases FRAME
   declared `yes`.

7. **Binary gates.** A gate is `PASS` or `PENDING`. No middle state. A
   domain verdict of `PASS-WITH-CONDITIONS` still corresponds to a `PASS`
   gate — the conditions become SHIP follow-ups with owner and date.

8. **Recorded deviations.** Every deviation from the prior phase is
   written in the current phase file with a justification. Silent
   deviations are process-gate failures.

## File conventions

**Paths.** All artifacts live under `docs/agency-flow/<slug>/`. Slugs are
kebab-case, 2–5 words, unique, no dates, no owner names.

**Phase files**, in order:

```
docs/agency-flow/<slug>/
├── 00-research.md     (optional — only if FRAME declares research? yes)
├── 00-frame.md        (mandatory)
├── 01-propose.md      (mandatory)
├── 02-build.md        (mandatory)
├── 03-verify.md       (mandatory)
├── 04-ship.md         (mandatory)
└── 05-measure.md      (optional — only if FRAME declares measure? yes)
```

**Every phase file ends with two blocks** in this exact shape:

```
## Assigned team
- Domain: <agent(s)> — <why each>
- Process steward: <PM agent> — <what was confirmed>

## Gates
- Domain gate: <agent> — PASS / PENDING
- Process gate: <PM agent> — PASS / PENDING
```

BUILD and SHIP always show `Domain gate: N/A`. A BUILD or SHIP file that
claims a domain gate is malformed.

**Reference paths.** Templates, checklists, anti-patterns, and worked
examples live in `skills/<skill>/references/`. Load them on demand — never
inline their content into phase files.

## Where knowledge lives

Do not try to memorize Agency-Flow. It is written down. Read from the
right place:

| You need… | Read… |
| ----------- | ------- |
| How to route a task | `skills/using-agency-flow/SKILL.md` |
| The methodology spec | `docs/agency-flow/README.md` |
| A phase file template | `skills/agency-flow-<phase>/references/template.md` |
| The gate checklist for a phase | `skills/agency-flow-<phase>/references/checklist.md` |
| Anti-patterns for a phase | `skills/agency-flow-<phase>/references/anti-patterns.md` |
| A worked example | `skills/agency-flow-<phase>/references/example-*.md` |
| The two-gate model | `skills/agency-flow-steward/references/two-gate-model.md` |
| The phase-transition protocol | `skills/agency-flow-steward/references/phase-transition-protocol.md` |
| Wildcard resolution | `skills/agency-flow-steward/references/wildcard-chain.md` |
| PM-as-deliverable edge case | `skills/agency-flow-steward/references/pm-edge-case.md` |
| Filled-in reference projects | `docs/agency-flow/example-engineering-feature/`, `docs/agency-flow/example-marketing-campaign/` |

When a phase skill or steward skill is invoked, it will load its own
references. You do not need to preload them.

## Routing (short form)

Full routing lives in `using-agency-flow`. The compressed version:

- **No task folder** for the request → invoke `agency-flow`.
- **Task folder exists**, latest phase gates both `PASS` → invoke the
  `next` phase skill.
- **Task folder exists**, any gate `PENDING` → resume that phase skill.
- **Gate signing, transition audit, wildcard, PM edge case** → invoke
  `agency-flow-steward`.
- **Methodology question, no artifact** → answer directly.
- **Not an Agency-Flow task** → answer or act directly.

When in doubt: invoke `agency-flow`. It is cheap, it routes, and it
refuses loudly when the intent is wrong.

## Hard refusals

The plugin refuses the following, without exception, and states the
reason in one line:

- **Skipping a phase** — even "just this once".
- **Skipping an optional phase declared `yes`** in FRAME.
- **Opening an optional phase not declared** in FRAME.
- **Self-signing a domain gate** — the process steward is not a domain
  agent.
- **Self-signing a process gate over a self-verified artifact** — VERIFY
  independence is checked first.
- **Advancing on `PENDING`** — both gates `PASS` is the only advancing
  state.
- **Adding a FRAME criterion during PROPOSE or BUILD** — criteria come
  from FRAME; adding one reopens FRAME.
- **Introducing new scope in SHIP** — new scope reopens FRAME or becomes
  a MEASURE follow-up.
- **Writing a phase file with an empty `## Gates` block** or a `PASS`
  with no named signer.
- **Silently absorbing a deviation** — every deviation is written.
- **Overwriting an existing slug** — append `-v2` or pick a new slug.
- **Signature on behalf of another agent** — every signature names a real
  agent.

Refusal format:

```
Refused: <one-line reason>
Blocking gate: <domain | process | n/a>
Required action: <who must do what>
```

## Overrides

User instructions (CLAUDE.md, AGENTS.md, GEMINI.md, direct requests)
override skills, which override these rules. Only skip a gate or a phase
workflow when the user has **explicitly** told you to.

When an override applies, record it in the affected phase file:

```
## Deviations from methodology
- <what was overridden> — <who requested> — <reason> — <date>.
```

Silent overrides are process-gate failures on the next phase's audit.
`agency-flow-steward` will refuse to sign if the record is missing.

An override of a **gate** requires a new phase file entry explaining the
waiver; it does not delete the gate. A waived gate is still visible.

## What this plugin will not do

- **Will not produce artifacts outside `docs/agency-flow/<slug>/`.** No
  "quick copies", no draft files in the repo root, no inline artifacts in
  chat that later get lost.
- **Will not sign on behalf of absent agents.** If a domain agent does
  not exist, the wildcard chain applies, and the wildcard is recorded.
- **Will not invent criteria, dependencies, or follow-ups** that are not
  in the phase files.
- **Will not retroactively write a phase** to close a task that skipped
  it. The phase is reopened or the task is marked incomplete.
- **Will not silently drift from `docs/agency-flow/README.md`.** If the
  README and a skill disagree, the README wins; report the inconsistency
  rather than resolving it in silence.

## Platform adaptation

The plugin supports multiple harnesses. When a harness-specific
instruction is needed, it lives in
`skills/using-agency-flow/references/<harness>-tools.md`:

- Claude Code: `claude-code-tools.md`
- Codex: `codex-tools.md`
- Pi: `pi-tools.md`
- Antigravity: `antigravity-tools.md`
- Hermes Agent: `hermes-tools.md`
- Muse: `muse-tools.md`

If the current harness is not listed, assume the default tools behave as
in Claude Code and note the assumption in the first phase file.
