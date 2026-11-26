// Canonical workspace layout for Agency-Flow.
//
// The layout is the contract between the engine, the skills, and any external
// harness that reads a workspace. Change it here, then re-run the G1 gate.

export const WORKSPACE_ROOT_ENV = 'AGENCY_FLOW_WORKSPACE_ROOT';
export const DEFAULT_WORKSPACE_ROOT = 'docs/agency-flow';

// Kebab-case only. No leading/trailing hyphen, no dots, no slashes.
export const JOB_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const JOB_ID_MIN = 2;
export const JOB_ID_MAX = 64;

export const TASK_ID_PATTERN = /^T-\d{3}$/;
export const NUMERIC_PREFIX_PATTERN = /^\d{2}-/;

export const STATE_FILE = 'workflow-state.md';
export const INTENT_FILE = '00-intent.md';
export const PROPOSAL_FILE = '01-proposal.md';
export const RESEARCH_FILE = '00-research.md';
export const MEASURE_FILE = '07-measure.md';

export const PHASES = ['research', 'intent', 'propose', 'build', 'verify', 'ship', 'measure'];

export const WORKFLOW_STATUSES = ['draft', 'awaiting-approval', 'running', 'blocked', 'done'];
export const STEP_STATUSES = [
  'pending',
  'awaiting-approval',
  'running',
  'done',
  'failed',
  'blocked',
  'skipped',
];
export const TASK_STATUSES = ['pending', 'running', 'passed', 'failed', 'blocked'];

export const MAX_ATTEMPTS = 3;

export const CANONICAL_DIRS = [
  '02-specs',
  '03-artifacts',
  '04-tasks',
  '05-deliverables',
  '06-validation',
];

export const REQUIRED_FILES = [STATE_FILE, INTENT_FILE, PROPOSAL_FILE];

// Canonical entries at the workspace root. Any other `NN-` prefixed artifact is
// also allowed; an entry without a two-digit prefix is a layout error.
export const CANONICAL_ROOT_ENTRIES = new Set([
  STATE_FILE,
  INTENT_FILE,
  PROPOSAL_FILE,
  RESEARCH_FILE,
  MEASURE_FILE,
  ...CANONICAL_DIRS,
]);

export const BUILD_LOG = '03-artifacts/build-log.md';
export const VERIFY_REPORT = '06-validation/verify-report.md';
export const SHIP_NOTES = '05-deliverables/ship-notes.md';
export const TASKS_DIR = '04-tasks';
export const SPECS_DIR = '02-specs';

// Migration mapping from the legacy flat phase files to the canonical layout.
export const LEGACY_MAP = [
  { from: '00-frame.md', to: INTENT_FILE },
  { from: '01-propose.md', to: PROPOSAL_FILE },
  { from: '02-build.md', to: BUILD_LOG },
  { from: '03-verify.md', to: VERIFY_REPORT },
  { from: '04-ship.md', to: SHIP_NOTES },
  { from: '05-measure.md', to: MEASURE_FILE },
];
