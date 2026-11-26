// Minimal YAML subset used by task files.
//
// Supports exactly what the task schema needs: top-level `key: scalar`,
// inline arrays (`[]`, `[a, b]`), and block sequences of scalars or of
// single-level mappings. Anything else is rejected loudly rather than guessed
// at — a task file the engine half-understands is worse than one it refuses.

export class YamlError extends Error {
  constructor(message) {
    super(message);
    this.name = 'YamlError';
  }
}

const KEY_LINE = /^([A-Za-z_][\w-]*):(.*)$/;

function parseScalar(raw) {
  const value = raw.trim();
  if (value === '' || value === '~' || value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (value === '[]') return [];
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((part) => parseScalar(part));
  }
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseYaml(text) {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  const result = {};
  let listKey = null;
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim() === '' || raw.trimStart().startsWith('#')) continue;
    if (raw.includes('\t')) {
      throw new YamlError(`Line ${i + 1}: tabs are not allowed; use spaces.`);
    }

    const indent = raw.match(/^ */)[0].length;
    const content = raw.slice(indent);

    if (indent === 0) {
      const match = content.match(KEY_LINE);
      if (!match) throw new YamlError(`Line ${i + 1}: expected "key: value", got "${content}".`);
      const [, key, rest] = match;
      if (Object.hasOwn(result, key)) throw new YamlError(`Line ${i + 1}: duplicate key "${key}".`);
      const value = rest.trim();
      if (value === '') {
        result[key] = null;
        listKey = key;
        currentItem = null;
      } else {
        result[key] = parseScalar(value);
        listKey = null;
        currentItem = null;
      }
      continue;
    }

    if (listKey === null) {
      throw new YamlError(`Line ${i + 1}: unexpected indented line outside a block sequence.`);
    }

    if (content.startsWith('- ')) {
      if (!Array.isArray(result[listKey])) result[listKey] = [];
      const itemContent = content.slice(2).trim();
      const match = itemContent.match(KEY_LINE);
      if (match) {
        currentItem = { [match[1]]: parseScalar(match[2]) };
        result[listKey].push(currentItem);
      } else {
        result[listKey].push(parseScalar(itemContent));
        currentItem = null;
      }
      continue;
    }

    const match = content.match(KEY_LINE);
    if (!match || currentItem === null) {
      throw new YamlError(`Line ${i + 1}: expected a sequence item or a mapping continuation.`);
    }
    if (Object.hasOwn(currentItem, match[1])) {
      throw new YamlError(`Line ${i + 1}: duplicate key "${match[1]}" in sequence item.`);
    }
    currentItem[match[1]] = parseScalar(match[2]);
  }

  return result;
}

function formatScalar(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[${value.map((item) => formatScalar(item)).join(', ')}]`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const text = String(value);
  const needsQuotes =
    text === '' ||
    text !== text.trim() ||
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(text) ||
    /: |\s#/.test(text) ||
    /^(true|false|null|~|-?\d+)$/.test(text);
  return needsQuotes ? JSON.stringify(text) : text;
}

export function stringifyYaml(entries) {
  const lines = [];
  for (const [key, value] of entries) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      lines.push(`${key}:`);
      for (const item of value) {
        const fields = Object.entries(item);
        fields.forEach(([field, fieldValue], index) => {
          lines.push(`${index === 0 ? '  - ' : '    '}${field}: ${formatScalar(fieldValue)}`);
        });
      }
      continue;
    }
    if (Array.isArray(value) && value.length > 0) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${formatScalar(item)}`);
      continue;
    }
    lines.push(`${key}: ${formatScalar(value)}`);
  }
  return `${lines.join('\n')}\n`;
}
