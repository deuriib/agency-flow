import assert from 'node:assert/strict';
import test from 'node:test';
import { assertJobId, isValidJobId, JobIdError } from '../../src/workspace/job-id.js';

test('accepts kebab-case job ids', () => {
  for (const id of ['ab', 'issue-9', 'issue-9-workspace-standardization', 'a1-b2-c3']) {
    assert.equal(assertJobId(id), id);
    assert.equal(isValidJobId(id), true);
  }
});

test('rejects ids that could escape the workspace root', () => {
  for (const id of ['../etc', 'a/b', 'a\\b', '..', './x']) {
    assert.throws(() => assertJobId(id), JobIdError, `expected ${id} to be rejected`);
  }
});

test('rejects non kebab-case ids', () => {
  for (const id of ['Issue-9', 'issue 9', 'issue_9', '-issue', 'issue-', 'a--b', 'é']) {
    assert.equal(isValidJobId(id), false, `expected ${id} to be rejected`);
  }
});

test('rejects empty, oversized, and non-string ids', () => {
  assert.throws(() => assertJobId(''), JobIdError);
  assert.throws(() => assertJobId('a'), JobIdError);
  assert.throws(() => assertJobId('a'.repeat(65)), JobIdError);
  assert.throws(() => assertJobId(null), JobIdError);
  assert.throws(() => assertJobId(42), JobIdError);
});
