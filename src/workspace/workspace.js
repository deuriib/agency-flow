import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_DIRS,
  CANONICAL_ROOT_ENTRIES,
  DEFAULT_WORKSPACE_ROOT,
  INTENT_FILE,
  MAX_ATTEMPTS,
  NUMERIC_PREFIX_PATTERN,
  PROPOSAL_FILE,
  REQUIRED_FILES,
  STATE_FILE,
  STEP_STATUSES,
  WORKSPACE_ROOT_ENV,
} from './constants.js';
import { assertJobId } from './job-id.js';
import {
  addCheckpoint,
  createInitialState,
  nextStep,
  readState,
  updateStep,
  writeState,
} from './state.js';
import { loadTasks, validateTask, writeTask, tasksPath } from './tasks.js';

export class WorkspaceError extends Error {
  constructor(message, code = 'WORKSPACE_ERROR') {
    super(message);
    this.name = 'WorkspaceError';
    this.code = code;
  }
}

export class HitlBlockedError extends WorkspaceError {
  constructor(message) {
    super(message, 'HITL_BLOCKED');
    this.name = 'HitlBlockedError';
  }
}

export function resolveRoot(root) {
  return path.resolve(root ?? process.env[WORKSPACE_ROOT_ENV] ?? DEFAULT_WORKSPACE_ROOT);
}

export function workspaceDir({ jobId, root }) {
  assertJobId(jobId);
  return path.join(resolveRoot(root), jobId);
}

function renderIntent({ jobId, intent, now }) {
  return `---
job_id: ${jobId}
phase: intent
created_at: ${now}
---

# Intent — ${jobId}

## Request

${intent?.trim() || 'TBD — paste the original request or link the issue.'}

## Goal

TBD — one sentence describing the outcome.

## Success criteria

- TBD — measurable, testable, and observable.

## Scope

### In scope

- TBD

### Out of scope

- TBD

## Domain profile

- TBD — divisions involved and the validators each domain requires.

## Assigned team

- Domain: TBD — why each agent.
- Process steward: TBD — what was confirmed.

## Gates

- Domain gate: PENDING — signer: -
- Process gate: PENDING — signer: -
`;
}

function renderProposal({ jobId, now }) {
  return `---
job_id: ${jobId}
phase: propose
status: draft
created_at: ${now}
approved_by:
approved_at:
---

# Proposal — ${jobId}

## Approach

TBD — the chosen approach and one rejected alternative with the reason.

## Deliverables

- TBD — grouped by domain.

## Risks

- TBD — risk, mitigation, owner.

## Cross-domain dependencies

- TBD — dependency, owner, date.

## Approval

- Status: pending
- Approver:
- Date:
- Notes:

## Assigned team

- Domain: TBD — why each agent.
- Process steward: TBD — what was confirmed.

## Gates

- Domain gate: PENDING — signer: -
- Process gate: PENDING — signer: -
`;
}

export function ensureFrontmatter(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  if (normalized.startsWith('---\n')) return normalized;
  return ['---', 'status: draft', 'approved_by:', 'approved_at:', '---', '', normalized].join('\n');
}

function patchFrontmatter(text, updates) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') throw new WorkspaceError('File has no frontmatter block.');
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new WorkspaceError('Frontmatter block is not closed.');
  const body = lines.slice(1, end);
  for (const [key, value] of Object.entries(updates)) {
    const index = body.findIndex((line) => line.startsWith(`${key}:`));
    if (index === -1) body.push(`${key}: ${value ?? ''}`);
    else body[index] = `${key}: ${value ?? ''}`;
  }
  return [lines[0], ...body, ...lines.slice(end)].join('\n');
}

function replaceSection(text, heading, block) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return `${text.trimEnd()}\n\n${heading}\n\n${block}\n`;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      end = i;
      break;
    }
  }
  const before = lines.slice(0, start + 1);
  const after = lines.slice(end);
  return [...before, '', block.trim(), '', ...after].join('\n').replace(/\n{3,}/g, '\n\n');
}

export function initWorkspace({ jobId, root, intent, now = new Date().toISOString() }) {
  const dir = workspaceDir({ jobId, root });
  if (fs.existsSync(dir)) {
    throw new WorkspaceError(`Workspace already exists: ${dir}. Pick a new job id; existing workspaces are never overwritten.`, 'EXISTS');
  }

  fs.mkdirSync(dir, { recursive: true });
  for (const sub of CANONICAL_DIRS) fs.mkdirSync(path.join(dir, sub), { recursive: true });

  fs.writeFileSync(path.join(dir, INTENT_FILE), renderIntent({ jobId, intent, now }));
  fs.writeFileSync(path.join(dir, PROPOSAL_FILE), renderProposal({ jobId, now }));
  const state = writeState(dir, createInitialState(jobId, now));

  return { dir, state };
}

export function proposalIsApproved(dir) {
  const proposalPath = path.join(dir, PROPOSAL_FILE);
  if (!fs.existsSync(proposalPath)) return false;
  const text = fs.readFileSync(proposalPath, 'utf8');
  return /^status:[ \t]*approved[ \t]*$/m.test(text) && /^approved_by:[ \t]*\S+/m.test(text);
}

export function approveProposal({ jobId, root, approver, note, now = new Date().toISOString() }) {
  if (typeof approver !== 'string' || approver.trim() === '') {
    throw new WorkspaceError('An approval must name the human approver.', 'APPROVER_REQUIRED');
  }
  const dir = workspaceDir({ jobId, root });
  const proposalPath = path.join(dir, PROPOSAL_FILE);
  if (!fs.existsSync(proposalPath)) throw new WorkspaceError(`No ${PROPOSAL_FILE} in ${dir}.`);

  let state = readState(dir);
  const proposalStep = state.steps.find((step) => step.step === 'proposal');
  if (proposalStep?.status === 'done') {
    throw new WorkspaceError('The proposal is already approved.', 'ALREADY_APPROVED');
  }

  const approvalBlock = [
    '- Status: approved',
    `- Approver: ${approver.trim()}`,
    `- Date: ${now}`,
    `- Notes: ${note?.trim() || '-'}`,
  ].join('\n');

  let text = ensureFrontmatter(fs.readFileSync(proposalPath, 'utf8'));
  text = patchFrontmatter(text, { status: 'approved', approved_by: approver.trim(), approved_at: now });
  text = replaceSection(text, '## Approval', approvalBlock);
  fs.writeFileSync(proposalPath, text);

  state = updateStep(state, 'proposal', { status: 'done', owner: approver.trim(), evidence: PROPOSAL_FILE });
  state = updateStep(state, 'build', { status: 'pending' });
  state = { ...state, status: 'running', currentPhase: 'build' };
  state = addCheckpoint(state, 'propose', `Proposal approved by ${approver.trim()}`, now);
  writeState(dir, state);

  return { dir, state };
}

const HITL_GATED_STEPS = new Set(['build', 'verify', 'ship', 'measure']);

export function recordStep({
  jobId,
  root,
  step,
  status,
  owner,
  evidence,
  attempts,
  note,
  now = new Date().toISOString(),
}) {
  const dir = workspaceDir({ jobId, root });
  if (!STEP_STATUSES.includes(status)) {
    throw new WorkspaceError(
      `Invalid step status: "${status}". Allowed: ${STEP_STATUSES.join(', ')}.`,
      'INVALID_STATUS',
    );
  }

  const state = readState(dir);
  const current = state.steps.find((item) => item.step === step);
  if (!current) {
    throw new WorkspaceError(
      `Unknown step: "${step}". Known steps: ${state.steps.map((item) => item.step).join(', ')}.`,
      'UNKNOWN_STEP',
    );
  }
  if (step === 'proposal' && status === 'done') {
    throw new WorkspaceError(
      'Close the proposal with "flow approve <job-id> --by <name>", not "flow step".',
      'USE_APPROVE',
    );
  }
  if (HITL_GATED_STEPS.has(step) && ['running', 'done'].includes(status) && !proposalIsApproved(dir)) {
    throw new HitlBlockedError(
      `Blocked: ${PROPOSAL_FILE} is not approved. A named human must approve it before "${step}" can ${status}.`,
    );
  }
  if (status === 'done' && !evidence && current.evidence === '-') {
    throw new WorkspaceError(
      'A step marked done needs --evidence: the artifact or report that proves it.',
      'EVIDENCE_REQUIRED',
    );
  }

  const nextAttempts = attempts
    ?? (status === 'failed' ? Math.min(current.attempts + 1, MAX_ATTEMPTS) : current.attempts);
  const effectiveStatus = status === 'failed' && nextAttempts >= MAX_ATTEMPTS ? 'blocked' : status;

  let next = updateStep(state, step, {
    status: effectiveStatus,
    owner: owner ?? current.owner,
    evidence: evidence ?? current.evidence,
    attempts: nextAttempts,
  });

  const open = next.steps.filter((item) => !['done', 'skipped'].includes(item.status));
  const currentPhase = ['done', 'skipped'].includes(effectiveStatus) && open[0]
    ? open[0].phase
    : current.phase;
  if (effectiveStatus === 'blocked') {
    next = { ...next, status: 'blocked', currentPhase: current.phase };
  } else if (open.length === 0) {
    next = { ...next, status: 'done', currentPhase: current.phase };
  } else {
    next = {
      ...next,
      status: proposalIsApproved(dir) ? 'running' : 'awaiting-approval',
      currentPhase,
    };
  }

  const retry = status === 'failed' ? ` (attempt ${nextAttempts}/${MAX_ATTEMPTS})` : '';
  next = addCheckpoint(next, current.phase, note?.trim() || `${step} -> ${effectiveStatus}${retry}`, now);
  writeState(dir, next);

  return {
    dir,
    state: next,
    step,
    status: effectiveStatus,
    exhausted: status === 'failed' && effectiveStatus === 'blocked',
  };
}

export function resumeWorkspace({ jobId, root }) {
  const dir = workspaceDir({ jobId, root });
  const state = readState(dir);

  if (state.status === 'awaiting-approval' || state.status === 'draft') {
    throw new HitlBlockedError(
      `Blocked: ${PROPOSAL_FILE} is not approved. A named human must run "flow approve ${jobId} --by <name>" before the run can continue.`,
    );
  }
  if (state.status === 'done') return { dir, state, next: null, done: true };

  const next = nextStep(state);
  if (!next) return { dir, state, next: null, done: true };
  return { dir, state, next, done: false, blocked: next.status === 'blocked' };
}

export function validateWorkspace({ jobId, root }) {
  const dir = workspaceDir({ jobId, root });
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(dir)) {
    return { ok: false, dir, errors: [`Workspace does not exist: ${dir}`], warnings };
  }

  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(dir, file))) errors.push(`Missing required file: ${file}`);
  }
  for (const sub of CANONICAL_DIRS) {
    if (!fs.existsSync(path.join(dir, sub))) errors.push(`Missing required directory: ${sub}/`);
  }

  for (const entry of fs.readdirSync(dir)) {
    if (CANONICAL_ROOT_ENTRIES.has(entry) || NUMERIC_PREFIX_PATTERN.test(entry)) continue;
    errors.push(`Unexpected root entry "${entry}". Workspace artifacts must use a two-digit prefix or be canonical.`);
  }

  let state = null;
  try {
    state = readState(dir);
  } catch (error) {
    errors.push(`${STATE_FILE}: ${error.message}`);
  }

  if (state) {
    if (state.jobId !== jobId) errors.push(`${STATE_FILE} job_id "${state.jobId}" does not match "${jobId}".`);
    const phases = state.steps.map((step) => step.phase);
    for (const phase of ['intent', 'propose', 'build', 'verify', 'ship']) {
      if (!phases.includes(phase)) errors.push(`${STATE_FILE} is missing the "${phase}" step.`);
    }

    const proposalPath = path.join(dir, PROPOSAL_FILE);
    const proposal = fs.existsSync(proposalPath) ? fs.readFileSync(proposalPath, 'utf8') : '';
    const proposalSaysApproved = /^status:[ \t]*approved[ \t]*$/m.test(proposal);
    const approved = proposalIsApproved(dir);

    if (['running', 'done'].includes(state.status)) {
      if (!approved) {
        errors.push(
          `${PROPOSAL_FILE} is not approved by a named human but the run status is "${state.status}".`,
        );
      }
    } else if (proposalSaysApproved) {
      errors.push(
        `${PROPOSAL_FILE} says approved but ${STATE_FILE} says "${state.status}". Run "flow approve".`,
      );
    }

    const researchStep = state.steps.find((step) => step.step === 'research');
    if (fs.existsSync(path.join(dir, '00-research.md')) && researchStep?.status !== 'done') {
      warnings.push('00-research.md exists but the research step is not recorded as done. Run "flow step ... --step research --status done".');
    }
  }

  const { tasks, errors: taskErrors } = loadTasks(dir);
  errors.push(...taskErrors);

  for (const task of tasks) {
    if (task.status === 'blocked' && task.attempts < 3) {
      warnings.push(`${task.id} is blocked after ${task.attempts} attempt(s); the retry limit is 3.`);
    }
  }

  return { ok: errors.length === 0, dir, errors, warnings, state, tasks };
}

export function addTask({ jobId, root, task }) {
  const dir = workspaceDir({ jobId, root });
  if (!fs.existsSync(tasksPath(dir))) {
    throw new WorkspaceError(`No 04-tasks/ in ${dir}. Run "flow init" first.`);
  }
  const existing = loadTasks(dir);
  if (existing.errors.length > 0) {
    throw new WorkspaceError(`Existing tasks are invalid; fix them before adding more:\n${existing.errors.join('\n')}`);
  }
  if (existing.tasks.some((item) => item.id === task.id)) {
    throw new WorkspaceError(`Task "${task.id}" already exists.`, 'DUPLICATE_TASK');
  }
  const knownIds = new Set([...existing.tasks.map((item) => item.id), task.id]);
  const errors = validateTask(task, { knownIds });
  if (errors.length > 0) throw new WorkspaceError(errors.join('\n'), 'INVALID_TASK');

  // A cycle is impossible here: existing tasks were validated against the ids
  // that existed before this one, so none can reference the new id.
  return writeTask(dir, task);
}
