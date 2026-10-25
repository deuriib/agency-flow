# Agency-Flow for OpenCode

Complete guide for using Agency-Flow with [OpenCode.ai](https://opencode.ai).

## Installation

OpenCode V2 requires version 2.0.4 or later.

### OpenCode V1

Use the existing V1 plugin configuration:

```json
{
  "plugin": ["agency-flow@git+https://github.com/deuriib/agency-flow.git"]
}
```

### OpenCode V2 (2.0.4 or later)

Use the V2 plugin configuration:

```json
{
  "plugins": ["agency-flow@git+https://github.com/deuriib/agency-flow.git"]
}
```

For a local V2 installation, configure the repository directory containing `index.js`. OpenCode 2.0.4 and 2.0.7 reject a configured direct JavaScript-file path. Discovered plugin symlinks remain supported.

Restart OpenCode. V2 uses the `opencode` command; `opencode2` may be available as an alias. The plugin installs through OpenCode's plugin manager and registers all skills.

Verify by asking: "Tell me about Agency-Flow and the 5+2 phase workflow"

### Migrating from the old install (V1)

If you previously installed using `git clone` and symlinks, remove the old setup:

```bash
# Remove old symlinks
rm -f ~/.config/opencode/plugins/agency-flow.js
rm -rf ~/.config/opencode/skills/agency-flow
```

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list all available skills:

```text
use skill tool to list skills
```

### Loading a Skill

```text
use skill tool to load agency-frame
```

## How It Works

The plugin registers the skills directory and injects bootstrap context with flavor-specific tool mapping.

## Troubleshooting

Check OpenCode logs:

```bash
opencode run --standalone --print-logs "hello" 2>&1 | grep -i agency-flow
```
