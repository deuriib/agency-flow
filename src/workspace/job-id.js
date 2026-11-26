import {
  JOB_ID_MAX,
  JOB_ID_MIN,
  JOB_ID_PATTERN,
} from './constants.js';

export class JobIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JobIdError';
  }
}

/**
 * A job id names a directory. Reject anything that could escape the workspace
 * root or collide with the numeric-prefix rule.
 */
export function assertJobId(jobId) {
  if (typeof jobId !== 'string' || jobId.length === 0) {
    throw new JobIdError('Job id must be a non-empty string.');
  }
  if (jobId.length < JOB_ID_MIN || jobId.length > JOB_ID_MAX) {
    throw new JobIdError(`Job id must be ${JOB_ID_MIN}-${JOB_ID_MAX} characters, got ${jobId.length}.`);
  }
  if (jobId !== jobId.trim()) {
    throw new JobIdError('Job id must not contain leading or trailing whitespace.');
  }
  if (!JOB_ID_PATTERN.test(jobId)) {
    throw new JobIdError(
      `Job id "${jobId}" is not kebab-case. Use lowercase letters, digits, and single hyphens (e.g. "issue-9-workspace").`,
    );
  }
  if (jobId.startsWith('..') || jobId.includes('/') || jobId.includes('\\')) {
    throw new JobIdError('Job id must not contain path separators or traversal segments.');
  }
  return jobId;
}

export function isValidJobId(jobId) {
  try {
    assertJobId(jobId);
    return true;
  } catch {
    return false;
  }
}
