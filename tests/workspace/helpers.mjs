import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agency-flow-ws-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

export function validTask(overrides = {}) {
  return {
    id: 'T-001',
    title: 'Create the workspace skeleton',
    phase: 'build',
    owner: 'general',
    validator: 'reliability-reviewer',
    status: 'pending',
    attempts: 0,
    depends_on: [],
    acceptance_criteria: [
      {
        criterion: 'Directories 02-specs through 06-validation exist',
        evidence: 'ls output in 06-validation/T-001.txt',
      },
    ],
    ...overrides,
  };
}

export function legacyWorkspace(dir) {
  const files = {
    '00-frame.md': '# Frame\n',
    '01-propose.md': '# Propose\n',
    '02-build.md': '# Build\n',
    '03-verify.md': '# Verify\n',
    '04-ship.md': '# Ship\n',
    '05-measure.md': '# Measure\n',
  };
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}
