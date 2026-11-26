import fs from 'node:fs';
import path from 'node:path';
import {
  MAX_ATTEMPTS,
  PHASES,
  TASK_ID_PATTERN,
  TASK_STATUSES,
  TASKS_DIR,
} from './constants.js';
import { parseYaml, stringifyYaml } from './yaml.js';

export class TaskError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TaskError';
  }
}

export const TASK_FIELDS = [
  'id',
  'title',
  'phase',
  'owner',
  'validator',
  'status',
  'attempts',
  'depends_on',
  'acceptance_criteria',
  'notes',
];

const REQUIRED_FIELDS = TASK_FIELDS.filter((field) => field !== 'notes');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function validateTask(task, { knownIds } = {}) {
  const errors = [];
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    return ['Task must be a mapping.'];
  }

  for (const key of Object.keys(task)) {
    if (!TASK_FIELDS.includes(key)) errors.push(`Unknown field "${key}".`);
  }
  for (const field of REQUIRED_FIELDS) {
    if (!Object.hasOwn(task, field)) errors.push(`Missing required field "${field}".`);
  }

  if (Object.hasOwn(task, 'id') && !TASK_ID_PATTERN.test(String(task.id))) {
    errors.push(`id must match T-000, got "${task.id}".`);
  }
  if (Object.hasOwn(task, 'title') && !isNonEmptyString(task.title)) {
    errors.push('title must be a non-empty string.');
  }
  if (Object.hasOwn(task, 'phase') && !PHASES.includes(task.phase)) {
    errors.push(`phase must be one of ${PHASES.join(', ')}, got "${task.phase}".`);
  }
  if (Object.hasOwn(task, 'owner') && !isNonEmptyString(task.owner)) {
    errors.push('owner must name an agent.');
  }
  if (Object.hasOwn(task, 'validator') && !isNonEmptyString(task.validator)) {
    errors.push('validator must name an agent.');
  }
  if (isNonEmptyString(task.owner) && isNonEmptyString(task.validator) && task.owner === task.validator) {
    errors.push('owner and validator must be different agents; a producer never validates its own work.');
  }
  if (Object.hasOwn(task, 'status') && !TASK_STATUSES.includes(task.status)) {
    errors.push(`status must be one of ${TASK_STATUSES.join(', ')}, got "${task.status}".`);
  }
  if (Object.hasOwn(task, 'attempts')) {
    const attempts = task.attempts;
    if (!Number.isInteger(attempts) || attempts < 0 || attempts > MAX_ATTEMPTS) {
      errors.push(`attempts must be an integer 0-${MAX_ATTEMPTS}, got "${attempts}".`);
    }
  }
  if (Object.hasOwn(task, 'depends_on')) {
    if (!Array.isArray(task.depends_on)) {
      errors.push('depends_on must be an array of task ids.');
    } else {
      for (const dep of task.depends_on) {
        if (!TASK_ID_PATTERN.test(String(dep))) errors.push(`depends_on entry "${dep}" is not a task id.`);
        if (dep === task.id) errors.push('depends_on must not reference the task itself.');
        if (knownIds && !knownIds.has(dep)) errors.push(`depends_on references unknown task "${dep}".`);
      }
    }
  }
  if (Object.hasOwn(task, 'acceptance_criteria')) {
    const criteria = task.acceptance_criteria;
    if (!Array.isArray(criteria) || criteria.length === 0) {
      errors.push('acceptance_criteria must be a non-empty array.');
    } else {
      criteria.forEach((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`acceptance_criteria[${index}] must be a mapping.`);
          return;
        }
        if (!isNonEmptyString(item.criterion)) errors.push(`acceptance_criteria[${index}].criterion is required.`);
        if (!isNonEmptyString(item.evidence)) errors.push(`acceptance_criteria[${index}].evidence is required.`);
        for (const key of Object.keys(item)) {
          if (!['criterion', 'evidence'].includes(key)) {
            errors.push(`acceptance_criteria[${index}] has unknown field "${key}".`);
          }
        }
      });
    }
  }
  if (Object.hasOwn(task, 'notes') && task.notes !== null && typeof task.notes !== 'string') {
    errors.push('notes must be a string when present.');
  }

  return errors;
}

export function parseTask(text) {
  const parsed = parseYaml(text);
  const errors = validateTask(parsed);
  if (errors.length > 0) throw new TaskError(errors.join(' '));
  return parsed;
}

export function serializeTask(task) {
  const errors = validateTask(task);
  if (errors.length > 0) throw new TaskError(errors.join(' '));
  const entries = TASK_FIELDS.filter((field) => Object.hasOwn(task, field)).map((field) => [field, task[field]]);
  return stringifyYaml(entries);
}

export function tasksPath(workspaceDir) {
  return path.join(workspaceDir, TASKS_DIR);
}

export function taskFiles(workspaceDir) {
  const dir = tasksPath(workspaceDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.yaml') || name.endsWith('.yml'))
    .sort()
    .map((name) => path.join(dir, name));
}

export function readTask(file) {
  const task = parseTask(fs.readFileSync(file, 'utf8'));
  const base = path.basename(file).replace(/\.ya?ml$/, '');
  if (base !== task.id) {
    throw new TaskError(`${path.basename(file)}: file name must match the task id "${task.id}".`);
  }
  return task;
}

/**
 * Load and cross-validate every task in the workspace. Returns all errors
 * instead of the first one so a fix pass can address them together.
 */
export function loadTasks(workspaceDir) {
  const tasks = [];
  const errors = [];
  const files = taskFiles(workspaceDir);
  const ids = new Set();

  for (const file of files) {
    let task;
    try {
      task = readTask(file);
    } catch (error) {
      errors.push(`${path.basename(file)}: ${error.message}`);
      continue;
    }
    if (ids.has(task.id)) {
      errors.push(`${path.basename(file)}: duplicate task id "${task.id}".`);
      continue;
    }
    ids.add(task.id);
    tasks.push(task);
  }

  for (const task of tasks) {
    const taskErrors = validateTask(task, { knownIds: ids });
    for (const error of taskErrors) errors.push(`${task.id}: ${error}`);
  }

  const cycle = findCycle(tasks);
  if (cycle) errors.push(`dependency cycle: ${cycle.join(' -> ')}.`);

  return { tasks, errors };
}

export function writeTask(workspaceDir, task) {
  const dir = tasksPath(workspaceDir);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${task.id}.yaml`);
  fs.writeFileSync(file, serializeTask(task));
  return file;
}

export function findCycle(tasks) {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const state = new Map();
  const stack = [];

  const visit = (id) => {
    const current = state.get(id);
    if (current === 'done') return null;
    if (current === 'visiting') {
      const start = stack.indexOf(id);
      return [...stack.slice(start), id];
    }
    state.set(id, 'visiting');
    stack.push(id);
    const task = byId.get(id);
    for (const dep of task?.depends_on ?? []) {
      if (!byId.has(dep)) continue;
      const cycle = visit(dep);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(id, 'done');
    return null;
  };

  for (const task of tasks) {
    const cycle = visit(task.id);
    if (cycle) return cycle;
  }
  return null;
}
