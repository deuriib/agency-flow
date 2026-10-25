/**
 * Agency-Flow plugin for OpenCode.ai
 *
 * Dual-compatible with OpenCode V1 and V2.
 *
 * V1 (opencode): loaded via named export AgencyFlowPlugin — provides config
 * hook for skills registration and experimental.chat.messages.transform for
 * bootstrap injection.
 *
 * V2 (opencode2): loaded via default export { id, setup } by PluginSupervisor.
 * setup() registers skills natively via ctx.skill.transform(), and injects
 * bootstrap context via ctx.session.hook("context").
 *
 * No external dependencies — pure JavaScript works in both V1 and V2 without
 * installing @opencode-ai/plugin or effect.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Skills directory shared by V1 (config hook) and V2 (setup/ctx.skill.transform)
const agencySkillsDir = path.resolve(__dirname, '../../skills');

const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};
  let lastKey = null;

  for (const rawLine of frontmatterStr.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && !/^\s/.test(line)) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = /^(>[+-]?|\|[+-]?)$/.test(value) ? '' : value;
      lastKey = key;
    } else if (lastKey !== null && line.trim() !== '') {
      frontmatter[lastKey] = `${frontmatter[lastKey]} ${line.trim()}`.trim();
    }
  }

  for (const key of Object.keys(frontmatter)) {
    frontmatter[key] = frontmatter[key].replace(/^(["'])([\s\S]*)\1$/, '$2');
  }

  return { frontmatter, content: body };
};

export const V1_MAPPING = `**Tool Mapping for OpenCode:**
When skills request actions, substitute OpenCode equivalents:
- Create or update todos → \`todowrite\`
- \`Subagent (general-purpose):\` → \`task\` with \`subagent_type: "general"\`
- Invoke a skill → OpenCode's native \`skill\` tool
- Read files → \`read\`
- Create, edit, or delete files → \`apply_patch\`
- Run shell commands → \`bash\`
- Search files → \`grep\`, \`glob\`
- Fetch a URL → \`webfetch\`

Use OpenCode's native \`skill\` tool to list and load skills.`;

export const V2_MAPPING = `**Tool Mapping for OpenCode:**
When skills request actions, substitute OpenCode equivalents:
- Create or update todos → OpenCode v2 has no todo tool; track the plan in a markdown file instead
- \`Subagent (general-purpose):\` → \`subagent\` with \`agent: "general"\`
- Invoke a skill → OpenCode's native \`skill\` tool
- Read files → \`read\`
- Create, edit, or delete files → use \`patch\` with \`patchText\` when available; otherwise use \`write\` to create or overwrite files, \`edit\` for targeted changes, and \`shell\` for deletion
- Run shell commands → \`shell\`
- Search files → \`grep\`, \`glob\`
- Fetch a URL → \`webfetch\`
- Search the web → \`websearch\`

Use OpenCode's native \`skill\` tool to list and load skills.`;

const _bootstrapCache = new Map();

const getBootstrapContent = (toolMapping) => {
  if (_bootstrapCache.has(toolMapping)) return _bootstrapCache.get(toolMapping);

  const skillPath = path.join(agencySkillsDir, 'using-agency-flow', 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    _bootstrapCache.set(toolMapping, null);
    return null;
  }

  const fullContent = fs.readFileSync(skillPath, 'utf8');
  const { content } = extractAndStripFrontmatter(fullContent);

  _bootstrapCache.set(toolMapping, `<EXTREMELY_IMPORTANT>
You are operating under Agency-Flow.

**IMPORTANT: The using-agency-flow skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-agency-flow" again - that would be redundant.**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`);

  return _bootstrapCache.get(toolMapping);
};

const CHILD_SESSION_CACHE_MAX = 512;
const _childSessionCache = new Map();

const _cacheChildSession = (sessionID, isChild) => {
  if (_childSessionCache.size >= CHILD_SESSION_CACHE_MAX) {
    let toDrop = Math.ceil(CHILD_SESSION_CACHE_MAX / 4);
    for (const key of _childSessionCache.keys()) {
      if (toDrop-- <= 0) break;
      _childSessionCache.delete(key);
    }
  }
  _childSessionCache.set(sessionID, isChild);
};

const isChildSession = async (fetchSession, sessionID) => {
  if (!sessionID) return false;
  if (_childSessionCache.has(sessionID)) return _childSessionCache.get(sessionID);

  let isChild = false;
  try {
    const result = await fetchSession(sessionID);
    if (!result || typeof result !== 'object' || Array.isArray(result)) {
      throw new Error('Session lookup returned no usable record');
    }
    if (result.error != null || result.response?.ok === false) {
      throw new Error('Session lookup was unsuccessful');
    }
    const session = 'data' in result ? result.data : result;
    if (!session || typeof session !== 'object' || Array.isArray(session) || session.id !== sessionID) {
      throw new Error('Session lookup returned an invalid session identity');
    }
    if (session.parentID !== undefined &&
        (typeof session.parentID !== 'string' || session.parentID.length === 0)) {
      throw new Error('Session lookup returned an invalid parent identity');
    }
    isChild = Boolean(session?.parentID);
  } catch {
    isChild = false;
  }

  _cacheChildSession(sessionID, isChild);
  return isChild;
};

const messageContainsBootstrap = (msg) => {
  if (!msg || !Array.isArray(msg.content)) return false;
  for (const block of msg.content) {
    if (block && typeof block === 'object' && block.type === 'text' && typeof block.text === 'string') {
      if (block.text.includes('Agency-Flow') || block.text.includes('using-agency-flow')) {
        return true;
      }
    }
  }
  return false;
};

// V1 plugin object
export const AgencyFlowPlugin = {
  config: async () => {
    const skills = [];
    if (fs.existsSync(agencySkillsDir)) {
      const entries = fs.readdirSync(agencySkillsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(agencySkillsDir, entry.name, 'SKILL.md');
          if (fs.existsSync(skillPath)) {
            const content = fs.readFileSync(skillPath, 'utf8');
            const { frontmatter } = extractAndStripFrontmatter(content);
            skills.push({
              name: frontmatter.name || entry.name,
              description: frontmatter.description || '',
              path: skillPath,
            });
          }
        }
      }
    }
    return { skills };
  },

  hooks: {
    'experimental.chat.messages.transform': async ({ messages, sessionID, client }) => {
      const fetchSession = client?.session?.get?.bind(client?.session) || client?.getSession?.bind(client);
      if (fetchSession && sessionID) {
        const child = await isChildSession(fetchSession, sessionID);
        if (child) return;
      }

      if (messages.some(messageContainsBootstrap)) return;

      const bootstrap = getBootstrapContent(V1_MAPPING);
      if (!bootstrap) return;

      messages.unshift({
        role: 'user',
        content: [{ type: 'text', text: bootstrap }],
        timestamp: Date.now(),
      });
    },
  },
};

// V2 plugin object
export default {
  id: 'agency-flow',
  setup: async (ctx) => {
    await ctx.skill?.transform?.(async (draft) => {
      if (!fs.existsSync(agencySkillsDir)) return;
      const entries = fs.readdirSync(agencySkillsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(agencySkillsDir, entry.name, 'SKILL.md');
          if (fs.existsSync(skillPath)) {
            const rawContent = fs.readFileSync(skillPath, 'utf8');
            const { frontmatter, content } = extractAndStripFrontmatter(rawContent);
            try {
              draft.add({
                id: entry.name,
                name: frontmatter.name || entry.name,
                description: frontmatter.description || '',
                path: skillPath,
                content: content,
              });
            } catch (err) {
              // Swallow individual draft.add failures per test contract
            }
          }
        }
      }
    });

    ctx.session?.hook?.('context', async (event) => {
      const sessionID = event?.sessionID || event?.session?.id;
      const client = ctx.client || event?.client;
      const fetchSession = client?.session?.get?.bind(client?.session) || client?.getSession?.bind(client);

      if (fetchSession && sessionID) {
        const child = await isChildSession(fetchSession, sessionID);
        if (child) return;
      }

      if (event.messages && event.messages.some(messageContainsBootstrap)) return;

      const bootstrap = getBootstrapContent(V2_MAPPING);
      if (!bootstrap) return;

      const bootstrapMessage = {
        role: 'user',
        content: [{ type: 'text', text: bootstrap }],
        timestamp: Date.now(),
      };

      const messages = event.messages || [];
      const insertAt = messages.findIndex((m) => {
        if (!m || !Array.isArray(m.content)) return false;
        return m.content.some((b) => b && b.type === 'text' && b.text && b.text.includes('compaction'));
      });
      const idx = insertAt !== -1 ? insertAt : 0;

      return {
        messages: [
          ...messages.slice(0, idx),
          bootstrapMessage,
          ...messages.slice(idx),
        ],
      };
    });
  },
};
