#!/usr/bin/env node
// Migrate a legacy flat phase directory to the canonical workspace layout.
// Dry-run by default; pass --write to apply.

import { migrateWorkspace } from '../src/workspace/migrate.js';

const args = process.argv.slice(2);
const write = args.includes('--write');
const dir = args.find((arg) => !arg.startsWith('-'));

if (!dir) {
  console.error('Usage: node scripts/migrate-workspace.mjs <dir> [--write]');
  process.exitCode = 2;
} else {
  try {
    const result = migrateWorkspace(dir, { write });
    console.log(`${write ? 'Applied' : 'Dry run'} — ${result.dir}`);
    for (const item of result.moved) console.log(`MOVE ${item.from} -> ${item.to}`);
    for (const item of result.dirsCreated) console.log(`MKDIR ${item}/`);
    if (result.stateCreated) console.log('CREATE workflow-state.md');
    for (const item of result.conflicts) console.error(`CONFLICT ${item}`);
    if (!write) console.log('Re-run with --write to apply.');
    if (result.conflicts.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
