import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_DIRS,
  LEGACY_MAP,
  MEASURE_FILE,
  PROPOSAL_FILE,
  RESEARCH_FILE,
  STATE_FILE,
} from './constants.js';
import { createInitialState, renderState } from './state.js';
import { ensureFrontmatter } from './workspace.js';

/**
 * Move a legacy flat phase directory into the canonical workspace layout.
 * Dry-run by default; `write: true` applies the moves. Content is never
 * deleted — a move whose target already exists is reported as a conflict and
 * left untouched.
 */
export function migrateWorkspace(dir, { write = false } = {}) {
  const absolute = path.resolve(dir);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) {
    throw new Error(`Not a directory: ${absolute}`);
  }

  const moved = [];
  const conflicts = [];
  const skipped = [];

  for (const { from, to } of LEGACY_MAP) {
    const source = path.join(absolute, from);
    const target = path.join(absolute, to);
    if (!fs.existsSync(source)) {
      skipped.push(from);
      continue;
    }
    if (fs.existsSync(target)) {
      conflicts.push(`${from} -> ${to} (target exists)`);
      continue;
    }
    moved.push({ from, to });
    if (write) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.renameSync(source, target);
    }
  }

  const dirsCreated = [];
  for (const sub of CANONICAL_DIRS) {
    const target = path.join(absolute, sub);
    if (!fs.existsSync(target)) dirsCreated.push(sub);
    if (write) fs.mkdirSync(target, { recursive: true });
  }

  // A migrated proposal has no frontmatter, which the approval gate needs.
  // Add it in place so `flow approve` works on the migrated workspace.
  let proposalNormalized = false;
  const proposalPath = path.join(absolute, PROPOSAL_FILE);
  if (write && fs.existsSync(proposalPath)) {
    const before = fs.readFileSync(proposalPath, 'utf8');
    const after = ensureFrontmatter(before);
    if (after !== before) {
      fs.writeFileSync(proposalPath, after);
      proposalNormalized = true;
    }
  }

  const stateFile = path.join(absolute, STATE_FILE);
  const stateCreated = !fs.existsSync(stateFile);
  if (write && stateCreated) {
    fs.writeFileSync(stateFile, renderState(inferState(absolute)));
  }

  return {
    dir: absolute,
    write,
    moved,
    conflicts,
    skipped,
    dirsCreated,
    stateCreated,
    proposalNormalized,
  };
}

/**
 * Reconstruct a plausible DAG state from the files that exist, so a migrated
 * workspace can be resumed instead of restarted.
 *
 * A legacy proposal gate was signed by an agent, not by a named human. The
 * migration therefore does NOT carry approval forward: an unapproved proposal
 * rewinds the run to the HITL gate, even when later-phase files exist. Those
 * files stay in their canonical locations as historical evidence.
 */
export function inferState(dir) {
  const jobId = path.basename(dir);
  const has = (relative) => fs.existsSync(path.join(dir, relative));
  const read = (relative) => (has(relative) ? fs.readFileSync(path.join(dir, relative), 'utf8') : '');
  const now = new Date().toISOString();
  const state = createInitialState(jobId, now);

  const proposal = read('01-proposal.md');
  const proposalApproved =
    /^status:[ \t]*approved[ \t]*$/m.test(proposal) && /^approved_by:[ \t]*\S+/m.test(proposal);

  if (!proposalApproved) {
    state.steps = state.steps.map((step) => {
      if (step.step === 'research') {
        return has(RESEARCH_FILE)
          ? { ...step, status: 'done', evidence: RESEARCH_FILE }
          : { ...step, status: 'skipped' };
      }
      if (step.step === 'intent') return { ...step, status: has('00-intent.md') ? 'done' : 'pending' };
      if (step.step === 'proposal') return { ...step, status: has('01-proposal.md') ? 'awaiting-approval' : 'pending' };
      if (step.step === 'measure') return { ...step, status: has(MEASURE_FILE) ? 'pending' : 'skipped' };
      return { ...step, status: 'pending' };
    });
    state.status = 'awaiting-approval';
    state.currentPhase = 'propose';
    state.checkpoints = [{ at: now, phase: 'propose', note: 'Migrated from legacy layout; proposal awaits human approval' }];
    return state;
  }

  state.steps = state.steps.map((step) => {
    if (step.step === 'research') {
      return has(RESEARCH_FILE)
        ? { ...step, status: 'done', evidence: RESEARCH_FILE }
        : { ...step, status: 'skipped' };
    }
    if (step.step === 'intent') return { ...step, status: has('00-intent.md') ? 'done' : 'pending' };
    if (step.step === 'proposal') return { ...step, status: 'done' };
    if (step.step === 'build') return { ...step, status: has('03-artifacts/build-log.md') ? 'done' : 'pending' };
    if (step.step === 'verify') return { ...step, status: has('06-validation/verify-report.md') ? 'done' : 'pending' };
    if (step.step === 'ship') return { ...step, status: has('05-deliverables/ship-notes.md') ? 'done' : 'pending' };
    if (step.step === 'measure') return { ...step, status: has(MEASURE_FILE) ? 'pending' : 'skipped' };
    return step;
  });

  const firstOpen = state.steps.find((step) => !['done', 'skipped'].includes(step.status));
  const done = !firstOpen;
  state.status = done ? 'done' : 'running';
  state.currentPhase = firstOpen?.phase ?? 'measure';
  state.checkpoints = [{ at: now, phase: 'intent', note: 'Migrated from legacy flat layout' }];
  return state;
}
