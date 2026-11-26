import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { DEFAULT_WORKSPACE_ROOT, WORKSPACE_ROOT_ENV } from './constants.js';
import { migrateWorkspace } from './migrate.js';
import { parseTask } from './tasks.js';
import {
  addTask,
  approveProposal,
  HitlBlockedError,
  initWorkspace,
  recordStep,
  resumeWorkspace,
  validateWorkspace,
  workspaceDir,
} from './workspace.js';
import { loadTasks } from './tasks.js';

export const EXIT = { OK: 0, ERROR: 1, USAGE: 2, HITL_BLOCKED: 3 };

const USAGE = `Agency-Flow workspace engine

Usage:
  flow init <job-id> [--intent "text"] [--root dir]
  flow approve <job-id> --by "Name" [--note "text"] [--root dir]
  flow step <job-id> --step <name> --status <status> [--owner "Name"] [--evidence "path"] [--note "text"] [--root dir]
  flow resume <job-id> [--root dir]
  flow validate <job-id> [--root dir] [--json]
  flow task add <job-id> <file.yaml> [--root dir]
  flow task list <job-id> [--root dir] [--json]
  flow migrate <dir> [--write]

Workspace root defaults to "${DEFAULT_WORKSPACE_ROOT}" and can be overridden
with --root or ${WORKSPACE_ROOT_ENV}.

Exit codes: 0 ok, 1 error, 2 usage, 3 blocked on human approval.`;

function parse(args, options = {}) {
  return parseArgs({
    args,
    allowPositionals: true,
    strict: true,
    options: { root: { type: 'string' }, json: { type: 'boolean' }, ...options },
  });
}

function write(out, text) {
  out.write(text.endsWith('\n') ? text : `${text}\n`);
}

function printValidation(out, result) {
  write(out, `Workspace: ${result.dir}`);
  if (result.ok) write(out, 'PASS — layout, state, and tasks are valid.');
  for (const error of result.errors) write(out, `ERROR ${error}`);
  for (const warning of result.warnings) write(out, `WARN  ${warning}`);
}

export function runCli(argv, io = {}) {
  const out = io.stdout ?? process.stdout;
  const err = io.stderr ?? process.stderr;
  const cwd = io.cwd ?? process.cwd();
  const [command, ...rest] = argv;

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    write(out, USAGE);
    return command ? EXIT.OK : EXIT.USAGE;
  }

  try {
    switch (command) {
      case 'init': {
        const { values, positionals } = parse(rest, { intent: { type: 'string' } });
        if (positionals.length !== 1) {
          write(err, 'Usage: flow init <job-id> [--intent "text"] [--root dir]');
          return EXIT.USAGE;
        }
        const result = initWorkspace({ jobId: positionals[0], root: values.root, intent: values.intent });
        write(out, `Created ${result.dir}`);
        write(out, `State: ${result.state.status} (${result.state.currentPhase})`);
        write(out, `Next: edit 01-proposal.md, then "flow approve ${positionals[0]} --by <name>".`);
        return EXIT.OK;
      }

      case 'approve': {
        const { values, positionals } = parse(rest, {
          by: { type: 'string' },
          note: { type: 'string' },
        });
        if (positionals.length !== 1 || !values.by) {
          write(err, 'Usage: flow approve <job-id> --by "Name" [--note "text"] [--root dir]');
          return EXIT.USAGE;
        }
        const result = approveProposal({
          jobId: positionals[0],
          root: values.root,
          approver: values.by,
          note: values.note,
        });
        write(out, `Approved ${path.join(result.dir, '01-proposal.md')}`);
        write(out, `State: ${result.state.status} (${result.state.currentPhase})`);
        return EXIT.OK;
      }

      case 'step': {
        const { values, positionals } = parse(rest, {
          step: { type: 'string' },
          status: { type: 'string' },
          owner: { type: 'string' },
          evidence: { type: 'string' },
          attempts: { type: 'string' },
          note: { type: 'string' },
        });
        if (positionals.length !== 1 || !values.step || !values.status) {
          write(err, 'Usage: flow step <job-id> --step <name> --status <status> [--owner "Name"] [--evidence "path"] [--note "text"] [--root dir]');
          return EXIT.USAGE;
        }
        const attempts = values.attempts === undefined ? undefined : Number(values.attempts);
        if (attempts !== undefined && !Number.isInteger(attempts)) {
          write(err, '--attempts must be an integer 0-3.');
          return EXIT.USAGE;
        }
        const result = recordStep({
          jobId: positionals[0],
          root: values.root,
          step: values.step,
          status: values.status,
          owner: values.owner,
          evidence: values.evidence,
          attempts,
          note: values.note,
        });
        write(out, `Recorded ${result.step} -> ${result.status}`);
        write(out, `State: ${result.state.status} (${result.state.currentPhase})`);
        if (result.exhausted) {
          write(err, `Blocked: ${result.step} exhausted its retries. Escalate to the run owner.`);
          return EXIT.ERROR;
        }
        return EXIT.OK;
      }

      case 'resume': {
        const { values, positionals } = parse(rest);
        if (positionals.length !== 1) {
          write(err, 'Usage: flow resume <job-id> [--root dir]');
          return EXIT.USAGE;
        }
        const result = resumeWorkspace({ jobId: positionals[0], root: values.root });
        if (result.done) {
          write(out, `Run ${positionals[0]} is complete.`);
          return EXIT.OK;
        }
        write(out, `Next step: ${result.next.step} (${result.next.phase})`);
        write(out, `Status: ${result.next.status}`);
        if (result.blocked) {
          write(err, `Blocked: ${result.next.step} exhausted its retries. Escalate to the run owner.`);
          return EXIT.ERROR;
        }
        return EXIT.OK;
      }

      case 'validate': {
        const { values, positionals } = parse(rest);
        if (positionals.length !== 1) {
          write(err, 'Usage: flow validate <job-id> [--root dir] [--json]');
          return EXIT.USAGE;
        }
        const result = validateWorkspace({ jobId: positionals[0], root: values.root });
        if (values.json) write(out, JSON.stringify(result, null, 2));
        else printValidation(out, result);
        return result.ok ? EXIT.OK : EXIT.ERROR;
      }

      case 'task': {
        const [sub, ...taskArgs] = rest;
        if (sub === 'add') {
          const { values, positionals } = parse(taskArgs);
          if (positionals.length !== 2) {
            write(err, 'Usage: flow task add <job-id> <file.yaml> [--root dir]');
            return EXIT.USAGE;
          }
          const [jobId, file] = positionals;
          const task = parseTask(fs.readFileSync(path.resolve(cwd, file), 'utf8'));
          const written = addTask({ jobId, root: values.root, task });
          write(out, `Added ${task.id} -> ${written}`);
          return EXIT.OK;
        }
        if (sub === 'list') {
          const { values, positionals } = parse(taskArgs);
          if (positionals.length !== 1) {
            write(err, 'Usage: flow task list <job-id> [--root dir] [--json]');
            return EXIT.USAGE;
          }
          const dir = workspaceDir({ jobId: positionals[0], root: values.root });
          const { tasks, errors } = loadTasks(dir);
          if (values.json) {
            write(out, JSON.stringify({ tasks, errors }, null, 2));
          } else if (tasks.length === 0 && errors.length === 0) {
            write(out, 'No tasks.');
          } else {
            for (const task of tasks) {
              write(out, `${task.id}  ${task.status.padEnd(8)}  ${task.phase.padEnd(7)}  ${task.owner} -> ${task.validator}  ${task.title}`);
            }
            for (const error of errors) write(err, `ERROR ${error}`);
          }
          return errors.length === 0 ? EXIT.OK : EXIT.ERROR;
        }
        write(err, 'Usage: flow task <add|list> ...');
        return EXIT.USAGE;
      }

      case 'migrate': {
        const { values, positionals } = parse(rest, { write: { type: 'boolean' } });
        if (positionals.length !== 1) {
          write(err, 'Usage: flow migrate <dir> [--write]');
          return EXIT.USAGE;
        }
        const result = migrateWorkspace(positionals[0], { write: Boolean(values.write) });
        write(out, `${result.write ? 'Applied' : 'Dry run'} — ${result.dir}`);
        for (const item of result.moved) write(out, `MOVE ${item.from} -> ${item.to}`);
        for (const item of result.dirsCreated) write(out, `MKDIR ${item}/`);
        if (result.proposalNormalized) write(out, 'NORMALIZE 01-proposal.md (frontmatter added)');
        if (result.stateCreated) write(out, 'CREATE workflow-state.md');
        for (const item of result.conflicts) write(err, `CONFLICT ${item}`);
        if (!result.write) write(out, 'Re-run with --write to apply.');
        return result.conflicts.length === 0 ? EXIT.OK : EXIT.ERROR;
      }

      default:
        write(err, `Unknown command: ${command}`);
        write(err, USAGE);
        return EXIT.USAGE;
    }
  } catch (error) {
    if (error instanceof HitlBlockedError) {
      write(err, error.message);
      return EXIT.HITL_BLOCKED;
    }
    if (error?.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION' || error?.code === 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE') {
      write(err, error.message);
      return EXIT.USAGE;
    }
    write(err, `Error: ${error.message}`);
    return EXIT.ERROR;
  }
}
