import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  addTask,
  approveProposal,
  HitlBlockedError,
  initWorkspace,
  recordStep,
  resumeWorkspace,
  validateWorkspace,
  WorkspaceError,
} from '../../src/workspace/workspace.js';
import { readState, writeState } from '../../src/workspace/state.js';
import { tempDir, validTask } from './helpers.mjs';

test('init creates the full canonical layout', (t) => {
  const root = tempDir(t);
  const { dir, state } = initWorkspace({ jobId: 'issue-9', root, intent: 'Adopt a standard workspace.' });

  for (const entry of [
    'workflow-state.md',
    '00-intent.md',
    '01-proposal.md',
    '02-specs',
    '03-artifacts',
    '04-tasks',
    '05-deliverables',
    '06-validation',
  ]) {
    assert.ok(fs.existsSync(path.join(dir, entry)), `missing ${entry}`);
  }
  assert.equal(state.status, 'awaiting-approval');
  assert.equal(state.currentPhase, 'propose');
  assert.match(fs.readFileSync(path.join(dir, '00-intent.md'), 'utf8'), /Adopt a standard workspace\./);
});

test('init refuses to overwrite an existing workspace', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });
  assert.throws(() => initWorkspace({ jobId: 'issue-9', root }), (error) => error.code === 'EXISTS');
});

test('a rejected init leaves the existing workspace byte-for-byte intact', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root, intent: 'Original intent.' });
  const intentPath = path.join(dir, '00-intent.md');
  const statePath = path.join(dir, 'workflow-state.md');
  const intentBefore = fs.readFileSync(intentPath, 'utf8');
  const stateBefore = fs.readFileSync(statePath, 'utf8');

  assert.throws(() => initWorkspace({ jobId: 'issue-9', root, intent: 'Clobbered.' }));

  assert.equal(fs.readFileSync(intentPath, 'utf8'), intentBefore);
  assert.equal(fs.readFileSync(statePath, 'utf8'), stateBefore);
});

test('every entry point rejects traversal ids before touching the filesystem', (t) => {
  const root = tempDir(t);

  for (const bad of ['../evil', 'a/b', 'a\\b', '..', './evil']) {
    assert.throws(() => initWorkspace({ jobId: bad, root }), `init accepted ${bad}`);
    assert.throws(() => resumeWorkspace({ jobId: bad, root }), `resume accepted ${bad}`);
    assert.throws(() => validateWorkspace({ jobId: bad, root }), `validate accepted ${bad}`);
    assert.throws(() => addTask({ jobId: bad, root, task: validTask() }), `addTask accepted ${bad}`);
  }

  assert.deepEqual(fs.readdirSync(root), []);
  assert.ok(!fs.existsSync(path.resolve(root, '..', 'evil')));
});

test('resume is blocked until a named human approves the proposal', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });

  assert.throws(() => resumeWorkspace({ jobId: 'issue-9', root }), HitlBlockedError);
  assert.throws(() => resumeWorkspace({ jobId: 'issue-9', root }), /flow approve issue-9 --by/);
});

test('approve requires a named approver and unlocks the run', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });

  assert.throws(() => approveProposal({ jobId: 'issue-9', root, approver: '  ' }), (error) => error.code === 'APPROVER_REQUIRED');

  const approved = approveProposal({
    jobId: 'issue-9',
    root,
    approver: 'Deuri Vasquez',
    note: 'Layout migration approved.',
  });
  assert.equal(approved.state.status, 'running');
  assert.equal(approved.state.currentPhase, 'build');

  const proposal = fs.readFileSync(path.join(approved.dir, '01-proposal.md'), 'utf8');
  assert.match(proposal, /^status: approved$/m);
  assert.match(proposal, /Approver: Deuri Vasquez/);

  const resumed = resumeWorkspace({ jobId: 'issue-9', root });
  assert.equal(resumed.next.step, 'build');
  assert.equal(resumed.blocked, false);
});

test('a workspace cannot be approved twice', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });
  approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' });
  assert.throws(
    () => approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' }),
    (error) => error.code === 'ALREADY_APPROVED',
  );
});

test('validate passes on a fresh workspace', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });
  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('validate reports a missing canonical directory', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  fs.rmSync(path.join(dir, '02-specs'), { recursive: true });
  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('02-specs')));
});

test('validate rejects an artifact without a numeric prefix', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  fs.writeFileSync(path.join(dir, 'notes.md'), '# notes\n');
  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('notes.md')));
});

test('validate catches a running workspace whose proposal is not approved', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' });

  const proposalPath = path.join(dir, '01-proposal.md');
  fs.writeFileSync(proposalPath, fs.readFileSync(proposalPath, 'utf8').replace('status: approved', 'status: draft'));

  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('is not approved')));
});

test('validate catches state that belongs to a different job', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  const state = readState(dir);
  writeState(dir, { ...state, jobId: 'other-job' });

  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('does not match')));
});

test('addTask writes a valid task and rejects duplicates', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });

  const file = addTask({ jobId: 'issue-9', root, task: validTask() });
  assert.ok(fs.existsSync(file));

  assert.throws(
    () => addTask({ jobId: 'issue-9', root, task: validTask() }),
    (error) => error.code === 'DUPLICATE_TASK',
  );
});

test('addTask rejects an unknown dependency and a self-reference', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });
  addTask({ jobId: 'issue-9', root, task: validTask({ id: 'T-001' }) });

  assert.throws(
    () => addTask({ jobId: 'issue-9', root, task: validTask({ id: 'T-002', depends_on: ['T-999'] }) }),
    WorkspaceError,
  );

  addTask({ jobId: 'issue-9', root, task: validTask({ id: 'T-002', depends_on: ['T-001'] }) });
  assert.throws(
    () => addTask({ jobId: 'issue-9', root, task: validTask({ id: 'T-003', depends_on: ['T-003'] }) }),
    (error) => error.code === 'INVALID_TASK',
  );
});

test('approve works on a proposal that has no frontmatter', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  const proposalPath = path.join(dir, '01-proposal.md');
  fs.writeFileSync(proposalPath, '# PROPOSE — issue-9\n\n## Approach\n\nChosen approach plus a rejected alternative.\n');

  approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' });

  const text = fs.readFileSync(proposalPath, 'utf8');
  assert.match(text, /^---\n/);
  assert.match(text, /^status: approved$/m);
  assert.match(text, /^approved_by: Deuri Vasquez$/m);
  assert.match(text, /## Approval[\s\S]*Deuri Vasquez/);
  assert.equal(resumeWorkspace({ jobId: 'issue-9', root }).next.step, 'build');
});

test('recordStep refuses to advance a gated step before approval', (t) => {
  const root = tempDir(t);
  initWorkspace({ jobId: 'issue-9', root });

  assert.throws(
    () => recordStep({ jobId: 'issue-9', root, step: 'build', status: 'running' }),
    HitlBlockedError,
  );
});

test('recordStep needs evidence to mark a step done and advances the phase', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' });

  assert.throws(
    () => recordStep({ jobId: 'issue-9', root, step: 'build', status: 'done' }),
    (error) => error.code === 'EVIDENCE_REQUIRED',
  );

  const result = recordStep({
    jobId: 'issue-9',
    root,
    step: 'build',
    status: 'done',
    owner: 'general',
    evidence: '03-artifacts/build-log.md',
  });

  assert.equal(result.state.currentPhase, 'verify');
  const state = readState(dir);
  assert.equal(state.steps.find((item) => item.step === 'build').status, 'done');
  assert.equal(state.steps.find((item) => item.step === 'build').evidence, '03-artifacts/build-log.md');
});

test('recordStep increments attempts and blocks a step after three failures', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' });

  recordStep({ jobId: 'issue-9', root, step: 'build', status: 'running', owner: 'general' });
  const first = recordStep({ jobId: 'issue-9', root, step: 'build', status: 'failed' });
  assert.equal(first.status, 'failed');
  assert.equal(first.state.steps.find((item) => item.step === 'build').attempts, 1);

  recordStep({ jobId: 'issue-9', root, step: 'build', status: 'failed' });
  const third = recordStep({ jobId: 'issue-9', root, step: 'build', status: 'failed' });

  assert.equal(third.status, 'blocked');
  assert.equal(third.exhausted, true);
  assert.equal(third.state.status, 'blocked');
  const state = readState(dir);
  assert.equal(state.steps.find((item) => item.step === 'build').attempts, 3);
});

test('validate rejects a proposal approved while the state still waits', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  const proposalPath = path.join(dir, '01-proposal.md');
  fs.writeFileSync(
    proposalPath,
    fs.readFileSync(proposalPath, 'utf8').replace('status: draft', 'status: approved'),
  );

  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('says approved')));
});

test('validate rejects a running state without a named approver', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  approveProposal({ jobId: 'issue-9', root, approver: 'Deuri Vasquez' });

  const proposalPath = path.join(dir, '01-proposal.md');
  fs.writeFileSync(
    proposalPath,
    fs.readFileSync(proposalPath, 'utf8').replace(/^approved_by:.*$/m, 'approved_by:'),
  );

  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('not approved by a named human')));
});

test('validate accepts a new artifact that follows the prefix rule', (t) => {
  const root = tempDir(t);
  const { dir } = initWorkspace({ jobId: 'issue-9', root });
  fs.writeFileSync(path.join(dir, '08-changelog.md'), '# Changelog\n');

  const result = validateWorkspace({ jobId: 'issue-9', root });
  assert.equal(result.ok, true, result.errors.join('; '));
});
