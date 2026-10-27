---
name: using-agency-flow
description: Use when starting any conversation or receiving any task — establishes how to find and use Agency-Flow skills, requires a routing check before ANY response including clarifying questions, and invokes the correct phase skill or the cross-cutting steward.
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## The Rule

**Run the routing check BEFORE any response or action** — including
clarifying questions, exploring the codebase, or checking files. The
routing check takes five seconds; skipping it costs a phase.

**Before entering plan mode:** invoke `agency-flow` (for a new task) or
the current phase skill (for an existing task) first. Do not draft a plan
before the appropriate skill has been invoked — the skill decides what a
plan looks like in Agency-Flow.

Then announce "Using [skill] to [purpose]" and follow the skill exactly.
If it has a checklist, create a todo per item.

## Skill Map

Agency-Flow ships nine skills. Know them before routing.

| Skill | Purpose |
|-------|---------|
| `agency-workflow` | Entry point — capture intent, derive slug, create folder, route |
| `agency-research` | Optional discovery phase |
| `agency-frame` | Goal, criteria, scope, domain profile |
| `agency-propose` | Approach, deliverables, risks, dependencies |
| `agency-build` | Production, criterion log, handoffs |
| `agency-verify` | Evidence per criterion, independence check |
| `agency-ship` | Release notes, changelog, follow-ups |
| `agency-measure` | Post-launch outcomes, learnings |
| `agency-steward` | Cross-cutting — signs process gates, resolves wildcards, PM edge case |

Each phase skill declares `previous` and `next` in a flow block at the
top. **Trust that block over your own reasoning.** The flow is written
down so you do not have to remember it.

## Routing

Before responding, determine where you are.

1. **No task folder exists** for the user's request → invoke
   `agency-flow`. It will handle slug derivation, collision, and the
   research/measure declaration.
2. **Task folder exists** at `docs/agency-flow/<slug>/` → inspect the
   latest phase file's `## Gates` block:
   - Both applicable gates `PASS` → the phase is closed. Invoke the next
     phase skill named in its `previous/next` flow block.
   - Any gate `PENDING` → resume that phase by invoking its skill. Its
     `checklist.md` names the exact failure.
3. **Gate or transition work** → invoke `agency-steward`. This
   covers: signing a process gate, refusing a process gate, auditing a
   phase file, resolving a wildcard, handling the PM-as-deliverable edge
   case, and validating a phase transition.
4. **Methodology question** (not a task — no artifact will be produced)
   → answer directly. If you need the spec, read
   `docs/agency-flow/README.md` and the relevant `references/` file under
   `skills/agency-<phase>/references/`.
5. **Not an Agency-Flow task at all** → the routing check has been done
   and no Agency-Flow skill applies (pure question, exploratory request,
   one-off edit not tied to a deliverable). Answer or act directly.

When in doubt: invoke `agency-flow`. It is cheap, it routes, and it
refuses loudly when the intent is wrong. A false start on `agency-flow`
costs less than a wrong deliverable.

## Skill Priority

When multiple skills apply, process skills come first — they set the
approach; implementation skills carry it out.

In Agency-Flow:

1. `agency-flow` (entry) runs before any phase skill.
2. Phase skills run in the order set by the `previous/next` flow block.
3. `agency-steward` runs whenever a process gate must be signed or a
   phase transition must be validated. **Steward takes precedence over
   the next phase opening.**
4. When a phase produces a domain artifact and needs its process gate
   signed, the domain work completes first, then `agency-steward`
   signs the gate. Steward never signs a domain gate.

## Agency-Flow Core Principles

1. **Sequential Phases.** One phase = one file under
   `docs/agency-flow/<slug>/`. No phase may be skipped. Optional phases
   (`research` and `measure`) must be declared explicitly in FRAME
   (`00-frame.md`) as `yes` or `no` — never left implicit.
2. **Two-Gate Model.** Every phase requires two gates:
   - **Domain gate:** Asks "Is the artifact good?" Signed by a competent
     domain agent — and never by the builder in VERIFY.
   - **Process gate:** Asks "Was the phase done correctly?" Signed by a
     Project Management process steward via `agency-steward`.
3. **Project Management as Process Steward.** PM participates in every
   phase in exactly one mode: process steward. PM never leads a domain,
   never signs a domain gate, and does not produce artifacts the project
   is judged on. The only exception is the PM-as-deliverable edge case,
   where the process gate must be signed by a **different** PM agent.
4. **Verifier Independence.** In VERIFY (`03-verify.md`), the verifier
   must not be the agent that built the artifact. This is checked by
   `agency-steward` **before** the phase file opens.
5. **Artifacts as Contract.** Roles are interchangeable; artifacts are
   the single source of truth. If it is not in the phase file, it did
   not happen.
6. **Explicit Flow Blocks.** Every skill declares `previous` and `next`
   at the top. Follow them. Do not invent jumps, do not reorder phases,
   do not skip optional phases that FRAME declared `yes`.
7. **Binary Gates.** A gate is `PASS` or `PENDING`. No middle state, no
   `PASS-WITH-RESERVATIONS`. A domain verdict of `PASS-WITH-CONDITIONS`
   still corresponds to a `PASS` gate — the conditions become SHIP
   follow-ups with owner and date.
8. **Recorded Deviations.** Every deviation from the prior phase is
   written in the current phase file with a justification. Silent
   deviations are process-gate failures.

## Resuming a Task

If `docs/agency-flow/<slug>/` already exists:

1. List its files: `ls docs/agency-flow/<slug>/`.
2. Read the latest phase file's `## Gates` block.
3. **Both applicable gates `PASS`:**
   - If this is the last phase declared in FRAME, the task is closed —
     report the outcome and stop.
   - Otherwise, invoke the next phase skill from the `previous/next` flow
     block.
4. **Any gate `PENDING`:**
   - Invoke the phase skill for that phase.
   - Its `checklist.md` will name the exact failure.
5. **Never reopen a closed phase.** Reopening requires explicit user
   instruction and a written reason in the phase file. Silent reopening
   is a process-gate failure.

## Red Flags

These thoughts mean STOP — you are rationalizing.

**General (skill-invocation discipline):**

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Run the routing check. |
| "I need more context first" | Routing check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read the current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

**agency-specific:**

| Thought | Reality |
|---------|---------|
| "I'll just write this quickly" | Every artifact needs a phase file and two gates. |
| "I can sign both gates myself" | The domain gate is signed by a domain agent. You are the process steward. |
| "This doesn't need FRAME" | Every project starts with FRAME. No exceptions. |
| "I'll skip PROPOSE, BUILD will figure it out" | PROPOSE exists so BUILD does not invent scope. |
| "The verifier can be me" | In VERIFY, the verifier must not be the builder. Checked first. |
| "Research is optional, I'll just do it" | RESEARCH runs only if FRAME declared `research? yes`. |
| "I'll add a criterion during BUILD" | Criteria come from FRAME. New criteria reopen FRAME. |
| "The gate is close enough to PASS" | Gates are binary. `PASS` or `PENDING`. |
| "I'll write SHIP early to save time" | SHIP is blocked on VERIFY. |
| "This is small, skip the two gates" | The two-gate model does not scale down. |
| "The user said just do it" | User instructions override — but only if explicit. Record the override. |
| "I'll fold the research into FRAME" | FRAME and RESEARCH are separate files with separate gates. |
| "The conditions can be addressed post-launch" | VERIFY conditions become SHIP follow-ups with owner and date. Not "post-launch". |
| "I'll just tweak the goal" | The FRAME goal is a contract. Tweaking it reopens FRAME, not PROPOSE. |

## Platform Adaptation

If your harness appears here, read its reference file for special
instructions:

- Claude Code: `references/claude-code-tools.md`
- Codex: `references/codex-tools.md`
- Pi: `references/pi-tools.md`
- Antigravity: `references/antigravity-tools.md`
- Hermes Agent: `references/hermes-tools.md`
- Muse: `references/muse-tools.md`

## User Instructions

User instructions (CLAUDE.md, AGENTS.md, GEMINI.md, etc., direct
requests) take precedence over skills, which in turn override default
behavior. Only skip skill workflows or instructions when your human
partner has explicitly told you to.

If a user instruction conflicts with a specific Agency-Flow gate (e.g.,
"skip VERIFY this time", "sign both gates yourself"), record the override
in the phase file under a new section:
