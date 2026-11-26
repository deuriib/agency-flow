import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { serializeTask } from '../../src/workspace/tasks.js';
import { tempDir, validTask } from './helpers.mjs';

const BIN = fileURLToPath(new URL('../../bin/flow.js', import.meta.url));

function flow(args, options = {}) {
  return spawnSync(process.execPath, [BIN, ...args], { encoding: 'utf8', ...options });
}

test('init exits 0 and creates the workspace', (t) => {
  const root = tempDir(t);
  const result = flow(['init', 'issue-9', '--root', root, '--intent', 'Standardize the workspace.']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Created/);
  assert.ok(fs.existsSync(path.join(root, 'issue-9', 'workflow-state.md')));
});

test('resume exits 3 while the proposal is unapproved', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);

  const result = flow(['resume', 'issue-9', '--root', root]);
  assert.equal(result.status, 3);
  assert.match(result.stderr, /Blocked/);
});

test('approve unlocks resume, which reports the build step', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);

  const approved = flow(['approve', 'issue-9', '--root', root, '--by', 'Deuri Vasquez']);
  assert.equal(approved.status, 0, approved.stderr);

  const resumed = flow(['resume', 'issue-9', '--root', root]);
  assert.equal(resumed.status, 0, resumed.stderr);
  assert.match(resumed.stdout, /Next step: build/);
});

test('validate exits 0 on a valid workspace and 1 on a missing one', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);

  const valid = flow(['validate', 'issue-9', '--root', root]);
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);
  assert.match(valid.stdout, /PASS/);

  const missing = flow(['validate', 'nope', '--root', root]);
  assert.equal(missing.status, 1);
});

test('validate --json returns machine-readable output', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);

  const result = flow(['validate', 'issue-9', '--root', root, '--json']);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.state.jobId, 'issue-9');
});

test('task add and task list round-trip', (t) => {
  const root = tempDir(t);
  const taskFile = path.join(root, 'T-001.yaml');
  fs.writeFileSync(taskFile, serializeTask(validTask()));

  flow(['init', 'issue-9', '--root', root]);
  const added = flow(['task', 'add', 'issue-9', taskFile, '--root', root]);
  assert.equal(added.status, 0, added.stderr);

  const listed = flow(['task', 'list', 'issue-9', '--root', root]);
  assert.equal(listed.status, 0, listed.stderr);
  assert.match(listed.stdout, /T-001/);
});

test('an unknown command exits 2', () => {
  const result = flow(['frobnicate']);
  assert.equal(result.status, 2);
});

test('missing or malformed arguments exit 2 without touching the workspace', (t) => {
  const root = tempDir(t);
  assert.equal(flow(['init']).status, 2);
  assert.equal(flow(['approve', 'issue-9', '--root', root]).status, 2);
  assert.equal(flow(['task', 'add', 'issue-9', '--root', root]).status, 2);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('validate exits 1 on a malformed state file', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);
  fs.writeFileSync(path.join(root, 'issue-9', 'workflow-state.md'), 'not a state file\n');

  const result = flow(['validate', 'issue-9', '--root', root]);
  assert.equal(result.status, 1);
});

test('task list exits 1 when a task file is invalid', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);
  fs.writeFileSync(path.join(root, 'issue-9', '04-tasks', 'T-001.yaml'), 'id: T-001\n');

  const result = flow(['task', 'list', 'issue-9', '--root', root]);
  assert.equal(result.status, 1);
});

test('migrate dry-runs by default and applies with --write', (t) => {
  const dir = tempDir(t);
  fs.writeFileSync(path.join(dir, '00-frame.md'), '# Frame\n');

  const dry = flow(['migrate', dir]);
  assert.equal(dry.status, 0, dry.stderr);
  assert.ok(fs.existsSync(path.join(dir, '00-frame.md')));
  assert.match(dry.stdout, /Dry run/);

  const applied = flow(['migrate', dir, '--write']);
  assert.equal(applied.status, 0, applied.stderr);
  assert.ok(fs.existsSync(path.join(dir, '00-intent.md')));
  assert.ok(!fs.existsSync(path.join(dir, '00-frame.md')));
});

test('task list rejects a traversal job id instead of reading outside the root', (t) => {
  const root = tempDir(t);
  const outside = path.join(path.dirname(root), `outside-${path.basename(root)}`);
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.mkdirSync(path.join(outside, '04-tasks'), { recursive: true });
  fs.writeFileSync(
    path.join(outside, '04-tasks', 'T-900.yaml'),
    serializeTask(validTask({ id: 'T-900', title: 'Outside task' })),
  );

  const result = flow(['task', 'list', '../outside-target', '--root', root]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /job id/i);
  assert.doesNotMatch(result.stdout, /T-900/);
});

test('step blocks gated work before approval and records retries after it', (t) => {
  const root = tempDir(t);
  flow(['init', 'issue-9', '--root', root]);

  const blocked = flow(['step', 'issue-9', '--step', 'build', '--status', 'running', '--root', root]);
  assert.equal(blocked.status, 3);
  assert.match(blocked.stderr, /not approved/);

  flow(['approve', 'issue-9', '--root', root, '--by', 'Deuri Vasquez']);

  const failed = flow(['step', 'issue-9', '--step', 'build', '--status', 'failed', '--root', root]);
  assert.equal(failed.status, 0, failed.stderr);
  assert.match(failed.stdout, /build -> failed/);

  flow(['step', 'issue-9', '--step', 'build', '--status', 'failed', '--root', root]);
  const exhausted = flow(['step', 'issue-9', '--step', 'build', '--status', 'failed', '--root', root]);

  assert.equal(exhausted.status, 1);
  assert.match(exhausted.stderr, /exhausted its retries/);
  const state = fs.readFileSync(path.join(root, 'issue-9', 'workflow-state.md'), 'utf8');
  assert.match(state, /\| build \| build \| [^|]+ \| blocked \| 3 \|/);
});
