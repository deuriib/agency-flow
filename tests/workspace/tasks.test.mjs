import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  findCycle,
  loadTasks,
  parseTask,
  readTask,
  serializeTask,
  TaskError,
  validateTask,
  writeTask,
} from '../../src/workspace/tasks.js';
import { tempDir, validTask } from './helpers.mjs';

test('parses a valid task file', () => {
  const task = parseTask(serializeTask(validTask()));
  assert.equal(task.id, 'T-001');
  assert.equal(task.phase, 'build');
  assert.deepEqual(task.depends_on, []);
  assert.equal(task.acceptance_criteria[0].evidence, 'ls output in 06-validation/T-001.txt');
});

test('serializer round-trips values that need quoting', () => {
  const task = validTask({
    title: 'Phase 1: create 02-specs',
    notes: 'Owner: general',
    depends_on: ['T-002'],
  });
  const parsed = parseTask(serializeTask(task));
  assert.equal(parsed.title, 'Phase 1: create 02-specs');
  assert.equal(parsed.notes, 'Owner: general');
  assert.deepEqual(parsed.depends_on, ['T-002']);
});

test('parses a block list of dependencies', () => {
  const yaml = `id: T-001
title: A task
phase: build
owner: general
validator: reviewer
status: pending
attempts: 0
depends_on:
  - T-002
  - T-003
acceptance_criteria:
  - criterion: It works
    evidence: test output
`;
  const task = parseTask(yaml);
  assert.deepEqual(task.depends_on, ['T-002', 'T-003']);
});

test('rejects a missing required field', () => {
  const task = validTask();
  delete task.validator;
  assert.match(validateTask(task).join(' '), /Missing required field "validator"/);
});

test('rejects an unknown field', () => {
  const task = { ...validTask(), surprise: true };
  assert.match(validateTask(task).join(' '), /Unknown field "surprise"/);
});

test('rejects a producer that validates its own work', () => {
  const task = validTask({ validator: 'general' });
  assert.match(validateTask(task).join(' '), /different agents/);
});

test('rejects an out-of-range attempt count and a bad phase', () => {
  assert.match(validateTask(validTask({ attempts: 4 })).join(' '), /attempts must be/);
  assert.match(validateTask(validTask({ phase: 'deploy' })).join(' '), /phase must be one of/);
});

test('rejects empty acceptance criteria and malformed criteria', () => {
  assert.match(validateTask(validTask({ acceptance_criteria: [] })).join(' '), /non-empty array/);
  assert.match(
    validateTask(validTask({ acceptance_criteria: [{ criterion: 'x' }] })).join(' '),
    /evidence is required/,
  );
});

test('rejects a dependency on an unknown task', () => {
  const knownIds = new Set(['T-001']);
  const task = validTask({ depends_on: ['T-002'] });
  assert.match(validateTask(task, { knownIds }).join(' '), /unknown task "T-002"/);
});

test('detects a dependency cycle', () => {
  const a = validTask({ id: 'T-001', depends_on: ['T-002'] });
  const b = validTask({ id: 'T-002', depends_on: ['T-001'] });
  assert.deepEqual(findCycle([a, b]), ['T-001', 'T-002', 'T-001']);
  assert.equal(findCycle([a, validTask({ id: 'T-002', depends_on: [] })]), null);
});

test('readTask requires the file name to match the task id', (t) => {
  const dir = tempDir(t);
  const file = path.join(dir, 'T-999.yaml');
  fs.writeFileSync(file, serializeTask(validTask()));
  assert.throws(() => readTask(file), TaskError);
});

test('writeTask writes T-001.yaml and loadTasks validates the directory', (t) => {
  const dir = tempDir(t);
  fs.mkdirSync(path.join(dir, '04-tasks'));
  writeTask(dir, validTask());
  assert.ok(fs.existsSync(path.join(dir, '04-tasks', 'T-001.yaml')));

  const { tasks, errors } = loadTasks(dir);
  assert.equal(errors.length, 0);
  assert.equal(tasks.length, 1);
});

test('loadTasks reports duplicate ids and cycles together', (t) => {
  const dir = tempDir(t);
  const tasksDir = path.join(dir, '04-tasks');
  fs.mkdirSync(tasksDir);
  fs.writeFileSync(path.join(tasksDir, 'T-001.yaml'), serializeTask(validTask({ depends_on: ['T-002'] })));
  fs.writeFileSync(path.join(tasksDir, 'T-002.yaml'), serializeTask(validTask({ id: 'T-002', depends_on: ['T-001'] })));

  const { errors } = loadTasks(dir);
  assert.ok(errors.some((error) => error.includes('dependency cycle')));
});
