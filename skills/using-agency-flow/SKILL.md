---
name: using-agency-flow
description: Bootstrap skill loaded at session start for Agency-Flow. Instructs agents on agency workflow phases, the two-gate model, and process stewardship.
---

<EXTREMELY_IMPORTANT>
You are operating under **Agency-Flow**, the sequential 5+2 phase methodology for taking intents to releases across agency-agents divisions.

**IMPORTANT: The using-agency-flow skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-agency-flow" again - that would be redundant.**

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance an Agency-Flow skill (`agency-workflow`, `agency-frame`, `agency-propose`, `agency-build`, `agency-verify`, `agency-ship`, `agency-research`, `agency-measure`) applies to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## The Rule

**Invoke relevant or requested skills BEFORE any response or action** — including clarifying questions, exploring the codebase, or checking files. If it turns out wrong for the situation, you don't have to use it.

## Agency-Flow Core Principles

1. **Sequential Phases:** One phase = one file under `docs/agency-flow/<slug>/`. No phase may be skipped. Optional phases (`research` and `measure`) must be declared explicitly in FRAME (`00-frame.md`).
2. **Two-Gate Model:** Every phase requires two gates:
   - **Domain gate:** Asks "Is the artifact good?" Signed by a competent domain agent (and never by the builder in VERIFY).
   - **Process gate:** Asks "Was the phase done correctly?" Signed by a Project Management process steward.
3. **Project Management as Process Steward:** PM participates in every phase in exactly one mode: process steward. PM never leads a domain, never signs a domain gate, and does not produce artifacts the project is judged on.
4. **Verifier Independence:** In VERIFY (`03-verify.md`), the verifier must not be the agent that built the artifact.
5. **Artifacts as Contract:** Roles are interchangeable; artifacts are the single source of truth.

**Tool Mapping for OpenCode:**
When skills request actions, substitute OpenCode equivalents:
- Create or update todos → track the plan in a markdown file or plan facility
- `Subagent (general-purpose):` → `subagent` with `agent: "general"` (give it `description` and `prompt`, optionally `background`; pass `sessionID` to continue a previous subagent)
- Invoke a skill → OpenCode's native `skill` tool
- Read files → `read`
- Create, edit, or delete files → use `patch` with `patchText` when available; otherwise use `write` to create or overwrite files, `edit` for targeted changes, and `shell` for deletion
- Run shell commands → `shell` (`command`, `workdir`, `timeout`, `background`)
- Search files → `grep`, `glob`
- Fetch a URL → `webfetch`
- Search the web → `websearch`

Use OpenCode's native `skill` tool to list and load skills.
</EXTREMELY_IMPORTANT>
