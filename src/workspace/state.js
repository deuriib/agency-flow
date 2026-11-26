import fs from 'node:fs';
import path from 'node:path';
import {
  MAX_ATTEMPTS,
  PHASES,
  STATE_FILE,
  STEP_STATUSES,
  WORKFLOW_STATUSES,
} from './constants.js';

export class StateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StateError';
  }
}

const FRONTMATTER_KEYS = ['job_id', 'status', 'current_phase', 'created_at', 'updated_at'];

export function createInitialState(jobId, now = new Date().toISOString()) {
  return {
    jobId,
    status: 'awaiting-approval',
    currentPhase: 'propose',
    createdAt: now,
    updatedAt: now,
    steps: [
      { n: 1, step: 'research', phase: 'research', owner: '-', status: 'skipped', attempts: 0, evidence: '-' },
      { n: 2, step: 'intent', phase: 'intent', owner: 'orchestrator', status: 'done', attempts: 0, evidence: '00-intent.md' },
      { n: 3, step: 'proposal', phase: 'propose', owner: 'orchestrator', status: 'awaiting-approval', attempts: 0, evidence: '01-proposal.md' },
      { n: 4, step: 'build', phase: 'build', owner: '-', status: 'pending', attempts: 0, evidence: '-' },
      { n: 5, step: 'verify', phase: 'verify', owner: '-', status: 'pending', attempts: 0, evidence: '-' },
      { n: 6, step: 'ship', phase: 'ship', owner: '-', status: 'pending', attempts: 0, evidence: '-' },
      { n: 7, step: 'measure', phase: 'measure', owner: '-', status: 'skipped', attempts: 0, evidence: '-' },
    ],
    checkpoints: [{ at: now, phase: 'intent', note: 'Workspace created' }],
  };
}

function cell(value) {
  return String(value ?? '-').replace(/\|/g, '/').replace(/\r?\n/g, ' ').trim() || '-';
}

export function renderState(state) {
  const lines = [
    '---',
    `job_id: ${state.jobId}`,
    `status: ${state.status}`,
    `current_phase: ${state.currentPhase}`,
    `created_at: ${state.createdAt}`,
    `updated_at: ${state.updatedAt}`,
    '---',
    '',
    `# Workflow State — ${state.jobId}`,
    '',
    '> Single source of truth for orchestration. The engine reads and writes this file; do not hand-edit.',
    '',
    '## Steps',
    '',
    '| # | Step | Phase | Owner | Status | Attempts | Evidence |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...state.steps.map(
      (s) => `| ${s.n} | ${cell(s.step)} | ${cell(s.phase)} | ${cell(s.owner)} | ${cell(s.status)} | ${cell(s.attempts)} | ${cell(s.evidence)} |`,
    ),
    '',
    '## Checkpoints',
    '',
    '| At | Phase | Note |',
    '| --- | --- | --- |',
    ...state.checkpoints.map((c) => `| ${cell(c.at)} | ${cell(c.phase)} | ${cell(c.note)} |`),
    '',
  ];
  return lines.join('\n');
}

function parseFrontmatter(lines) {
  if (lines[0] !== '---') throw new StateError('workflow-state.md must start with a frontmatter block.');
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new StateError('workflow-state.md frontmatter is not closed.');

  const values = {};
  for (const line of lines.slice(1, end)) {
    if (line.trim() === '') continue;
    const idx = line.indexOf(':');
    if (idx <= 0) throw new StateError(`Invalid frontmatter line: "${line}".`);
    const key = line.slice(0, idx).trim();
    if (!FRONTMATTER_KEYS.includes(key)) throw new StateError(`Unknown frontmatter key: "${key}".`);
    values[key] = line.slice(idx + 1).trim();
  }
  for (const key of FRONTMATTER_KEYS) {
    if (!values[key]) throw new StateError(`Missing frontmatter key: "${key}".`);
  }
  return { values, bodyStart: end + 1 };
}

function parseTable(lines, heading) {
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) throw new StateError(`Missing section: "${heading}".`);

  const rows = [];
  let sawSeparator = false;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    if (line.startsWith('## ')) break;
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.every((c) => /^-{3,}$/.test(c))) {
      sawSeparator = true;
      continue;
    }
    if (!sawSeparator) continue;
    rows.push(cells);
  }
  return rows;
}

export function parseState(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const { values } = parseFrontmatter(lines);

  const stepRows = parseTable(lines, '## Steps');
  if (stepRows.length === 0) throw new StateError('workflow-state.md has no steps.');

  const steps = stepRows.map((cells) => {
    if (cells.length !== 7) {
      throw new StateError(`Step row must have 7 columns, got ${cells.length}: "${cells.join(' | ')}".`);
    }
    const [n, step, phase, owner, status, attempts, evidence] = cells;
    return {
      n: Number(n),
      step,
      phase,
      owner,
      status,
      attempts: Number(attempts),
      evidence,
    };
  });

  const checkpoints = parseTable(lines, '## Checkpoints').map((cells) => {
    if (cells.length !== 3) {
      throw new StateError(`Checkpoint row must have 3 columns, got ${cells.length}.`);
    }
    const [at, phase, note] = cells;
    return { at, phase, note };
  });

  const state = {
    jobId: values.job_id,
    status: values.status,
    currentPhase: values.current_phase,
    createdAt: values.created_at,
    updatedAt: values.updated_at,
    steps,
    checkpoints,
  };
  assertState(state);
  return state;
}

export function assertState(state) {
  if (!state || typeof state !== 'object') throw new StateError('State must be an object.');
  if (!state.jobId) throw new StateError('State is missing jobId.');
  if (!WORKFLOW_STATUSES.includes(state.status)) {
    throw new StateError(`Invalid workflow status: "${state.status}".`);
  }
  if (!PHASES.includes(state.currentPhase)) {
    throw new StateError(`Invalid current phase: "${state.currentPhase}".`);
  }
  if (!Array.isArray(state.steps) || state.steps.length === 0) {
    throw new StateError('State must have at least one step.');
  }
  for (const step of state.steps) {
    if (!Number.isInteger(step.n) || step.n < 1) throw new StateError(`Invalid step number: ${step.n}.`);
    if (!step.step) throw new StateError('Step is missing a name.');
    if (!PHASES.includes(step.phase)) throw new StateError(`Invalid phase on step "${step.step}": "${step.phase}".`);
    if (!STEP_STATUSES.includes(step.status)) {
      throw new StateError(`Invalid status on step "${step.step}": "${step.status}".`);
    }
    if (!Number.isInteger(step.attempts) || step.attempts < 0 || step.attempts > MAX_ATTEMPTS) {
      throw new StateError(`Attempts on step "${step.step}" must be 0-${MAX_ATTEMPTS}.`);
    }
  }
  return state;
}

export function statePath(workspaceDir) {
  return path.join(workspaceDir, STATE_FILE);
}

export function readState(workspaceDir) {
  const file = statePath(workspaceDir);
  if (!fs.existsSync(file)) throw new StateError(`No ${STATE_FILE} in ${workspaceDir}.`);
  return parseState(fs.readFileSync(file, 'utf8'));
}

export function writeState(workspaceDir, state) {
  assertState(state);
  const next = { ...state, updatedAt: new Date().toISOString() };
  fs.writeFileSync(statePath(workspaceDir), renderState(next));
  return next;
}

export function updateStep(state, stepName, patch) {
  const index = state.steps.findIndex((step) => step.step === stepName);
  if (index === -1) throw new StateError(`Unknown step: "${stepName}".`);
  const updated = { ...state.steps[index], ...patch };
  if (!STEP_STATUSES.includes(updated.status)) {
    throw new StateError(`Invalid status for step "${stepName}": "${updated.status}".`);
  }
  if (!Number.isInteger(updated.attempts) || updated.attempts < 0 || updated.attempts > MAX_ATTEMPTS) {
    throw new StateError(`Attempts for step "${stepName}" must be 0-${MAX_ATTEMPTS}.`);
  }
  const steps = state.steps.slice();
  steps[index] = updated;
  return { ...state, steps };
}

export function addCheckpoint(state, phase, note, at = new Date().toISOString()) {
  if (!PHASES.includes(phase)) throw new StateError(`Invalid checkpoint phase: "${phase}".`);
  return { ...state, checkpoints: [...state.checkpoints, { at, phase, note }] };
}

/**
 * The first step that still needs work, in order. Returns null when the run is
 * complete. A blocked step is returned so the caller can escalate instead of
 * silently skipping it.
 */
export function nextStep(state) {
  return (
    state.steps.find((step) =>
      ['running', 'failed', 'blocked', 'awaiting-approval', 'pending'].includes(step.status),
    ) ?? null
  );
}
