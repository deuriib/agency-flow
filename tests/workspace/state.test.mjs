import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  addCheckpoint,
  createInitialState,
  nextStep,
  parseState,
  readState,
  renderState,
  StateError,
  updateStep,
  writeState,
} from '../../src/workspace/state.js';
import { tempDir } from './helpers.mjs';

test('renders and parses the initial state without loss', () => {
  const state = createInitialState('issue-9-workspace', '2026-11-25T00:00:00.000Z');
  const parsed = parseState(renderState(state));

  assert.equal(parsed.jobId, 'issue-9-workspace');
  assert.equal(parsed.status, 'awaiting-approval');
  assert.equal(parsed.currentPhase, 'propose');
  assert.equal(parsed.steps.length, state.steps.length);
  assert.deepEqual(parsed.steps[1], state.steps[1]);
  assert.deepEqual(parsed.checkpoints, state.checkpoints);
});

test('renders and parses a non-zero attempts count', () => {
  let state = createInitialState('a-job', '2026-11-25T00:00:00.000Z');
  state = updateStep(state, 'build', { status: 'failed', attempts: 3 });

  const parsed = parseState(renderState(state));
  assert.equal(parsed.steps.find((step) => step.step === 'build').attempts, 3);
  assert.equal(parsed.steps.find((step) => step.step === 'build').status, 'failed');
});

test('writeState preserves attempts through disk', (t) => {
  const dir = tempDir(t);
  let state = createInitialState('a-job', '2026-11-25T00:00:00.000Z');
  state = updateStep(state, 'build', { status: 'running', attempts: 2 });
  writeState(dir, state);

  const parsed = readState(dir);
  assert.equal(parsed.steps.find((step) => step.step === 'build').attempts, 2);
});

test('updateStep changes exactly one step', () => {
  const state = createInitialState('a-job', '2026-11-25T00:00:00.000Z');
  const next = updateStep(state, 'build', { status: 'running', owner: 'general', attempts: 1 });

  assert.equal(next.steps.find((s) => s.step === 'build').status, 'running');
  assert.equal(next.steps.find((s) => s.step === 'build').attempts, 1);
  assert.equal(next.steps.find((s) => s.step === 'proposal').status, 'awaiting-approval');
  assert.equal(state.steps.find((s) => s.step === 'build').status, 'pending');
});

test('updateStep rejects an unknown step and an invalid status', () => {
  const state = createInitialState('a-job');
  assert.throws(() => updateStep(state, 'nope', {}), StateError);
  assert.throws(() => updateStep(state, 'build', { status: 'maybe' }), StateError);
  assert.throws(() => updateStep(state, 'build', { attempts: 4 }), StateError);
});

test('addCheckpoint appends without mutating the original', () => {
  const state = createInitialState('a-job', '2026-11-25T00:00:00.000Z');
  const next = addCheckpoint(state, 'build', 'build started', '2026-11-26T00:00:00.000Z');

  assert.equal(state.checkpoints.length, 1);
  assert.equal(next.checkpoints.length, 2);
  assert.equal(next.checkpoints[1].note, 'build started');
});

test('nextStep returns the first unfinished step', () => {
  const state = createInitialState('a-job');
  assert.equal(nextStep(state).step, 'proposal');

  const approved = updateStep(state, 'proposal', { status: 'done' });
  assert.equal(nextStep(approved).step, 'build');
});

test('writeState and readState round-trip through disk', (t) => {
  const dir = tempDir(t);
  const state = createInitialState('a-job', '2026-11-25T00:00:00.000Z');
  writeState(dir, state);
  const parsed = readState(dir);

  assert.equal(parsed.jobId, 'a-job');
  assert.ok(fs.existsSync(path.join(dir, 'workflow-state.md')));
});

test('parseState rejects a corrupt state file', () => {
  const state = createInitialState('a-job');
  const text = renderState(state).replace('status: awaiting-approval', 'status: sideways');
  assert.throws(() => parseState(text), StateError);
});

test('parseState rejects a missing section', () => {
  const state = createInitialState('a-job');
  const text = renderState(state).replace('## Checkpoints', '## Notes');
  assert.throws(() => parseState(text), StateError);
});
