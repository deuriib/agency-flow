import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { inferState, migrateWorkspace } from '../../src/workspace/migrate.js';
import { readState } from '../../src/workspace/state.js';
import { approveProposal } from '../../src/workspace/workspace.js';
import { legacyWorkspace, tempDir } from './helpers.mjs';

test('dry run reports the mapping without touching the directory', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  const result = migrateWorkspace(dir);

  assert.equal(result.write, false);
  assert.equal(result.moved.length, 6);
  assert.ok(fs.existsSync(path.join(dir, '00-frame.md')));
  assert.ok(!fs.existsSync(path.join(dir, '00-intent.md')));
});

test('write applies the documented mapping and creates the canonical dirs', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  const result = migrateWorkspace(dir, { write: true });

  assert.deepEqual(
    result.moved.map((item) => item.to).sort(),
    [
      '00-intent.md',
      '01-proposal.md',
      '03-artifacts/build-log.md',
      '05-deliverables/ship-notes.md',
      '06-validation/verify-report.md',
      '07-measure.md',
    ].sort(),
  );

  for (const sub of ['02-specs', '03-artifacts', '04-tasks', '05-deliverables', '06-validation']) {
    assert.ok(fs.existsSync(path.join(dir, sub)), `missing ${sub}`);
  }
  assert.ok(fs.existsSync(path.join(dir, 'workflow-state.md')));
  assert.match(fs.readFileSync(path.join(dir, '03-artifacts/build-log.md'), 'utf8'), /# Build/);
});

test('migration is idempotent', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  migrateWorkspace(dir, { write: true });

  const second = migrateWorkspace(dir, { write: true });
  assert.equal(second.moved.length, 0);
  assert.equal(second.stateCreated, false);
});

test('a conflicting target is reported and the source is preserved', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  fs.writeFileSync(path.join(dir, '00-intent.md'), '# Intent already here\n');

  const result = migrateWorkspace(dir, { write: true });
  assert.ok(result.conflicts.some((item) => item.includes('00-frame.md')));
  assert.ok(fs.existsSync(path.join(dir, '00-frame.md')));
});

test('a migrated legacy run is rewound to the proposal gate', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  fs.rmSync(path.join(dir, '05-measure.md'));
  migrateWorkspace(dir, { write: true });

  const state = inferState(dir);
  assert.equal(state.status, 'awaiting-approval');
  assert.equal(state.steps.find((step) => step.step === 'proposal').status, 'awaiting-approval');
  assert.equal(state.steps.find((step) => step.step === 'build').status, 'pending');
});

test('inferState resumes an already approved migration', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  fs.rmSync(path.join(dir, '03-verify.md'));
  fs.rmSync(path.join(dir, '04-ship.md'));
  migrateWorkspace(dir, { write: true });

  approveProposal({ jobId: 'legacy-job', root: path.dirname(dir), approver: 'Deuri Vasquez' });

  const state = inferState(dir);
  assert.equal(state.status, 'running');
  assert.equal(state.currentPhase, 'verify');
  assert.equal(state.steps.find((step) => step.step === 'verify').status, 'pending');
});

test('a migrated proposal is approvable without hand-edited frontmatter', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  const migration = migrateWorkspace(dir, { write: true });
  assert.equal(migration.proposalNormalized, true);

  approveProposal({ jobId: 'legacy-job', root: path.dirname(dir), approver: 'Deuri Vasquez' });

  const state = readState(dir);
  assert.equal(state.status, 'running');
  assert.equal(state.steps.find((step) => step.step === 'proposal').status, 'done');
  assert.match(fs.readFileSync(path.join(dir, '01-proposal.md'), 'utf8'), /^approved_by: Deuri Vasquez$/m);
});

test('inferState keeps measure open when 07-measure.md exists', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  migrateWorkspace(dir, { write: true });

  const state = inferState(dir);
  assert.equal(state.steps.find((step) => step.step === 'measure').status, 'pending');
});

test('inferState records a completed research phase', (t) => {
  const dir = legacyWorkspace(path.join(tempDir(t), 'legacy-job'));
  fs.writeFileSync(path.join(dir, '00-research.md'), '# Research\n');
  migrateWorkspace(dir, { write: true });

  const state = inferState(dir);
  const research = state.steps.find((step) => step.step === 'research');
  assert.equal(research.status, 'done');
  assert.equal(research.evidence, '00-research.md');
});
