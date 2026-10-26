import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const BOOTSTRAP_MARKER = "agency-flow:using-agency-flow bootstrap for pi";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(extensionDir, "../..");
const skillsDir = resolve(packageRoot, "skills");
const bootstrapSkillPath = resolve(skillsDir, "using-agency-flow", "SKILL.md");

let cachedBootstrap: string | null | undefined;

type TextBlock = { type: string; text?: string };
type MessageContent = string | TextBlock[] | undefined;
interface MessageLike {
	content?: MessageContent;
}

export default function agencyFlowPiExtension(pi: ExtensionAPI) {
	let injectBootstrap = true;

	pi.on("resources_discover", async () => ({
		skillPaths: [skillsDir],
	}));

	pi.on("session_start", async () => {
		injectBootstrap = true;
	});

	pi.on("session_compact", async () => {
		injectBootstrap = true;
	});

	pi.on("agent_end", async () => {
		injectBootstrap = false;
	});

	pi.on("context", async (event) => {
		if (!injectBootstrap) return;
		if (event.messages.some(messageContainsBootstrap)) return;

		const bootstrap = getBootstrapContent();
		if (!bootstrap) return;

		const bootstrapMessage = {
			role: "user" as const,
			content: [{ type: "text" as const, text: bootstrap }],
			timestamp: Date.now(),
		};

		const insertAt = firstNonCompactionSummaryIndex(event.messages);
		return {
			messages: [
				...event.messages.slice(0, insertAt),
				bootstrapMessage,
				...event.messages.slice(insertAt),
			],
		};
	});
}

function getBootstrapContent(): string | null {
	if (cachedBootstrap !== undefined) return cachedBootstrap;

	try {
		const skillContent = readFileSync(bootstrapSkillPath, "utf8");
		const body = stripFrontmatter(skillContent);
		cachedBootstrap = `<EXTREMELY_IMPORTANT>
${BOOTSTRAP_MARKER}

You are operating under Agency-Flow.

**IMPORTANT: The using-agency-flow skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-agency-flow" again - that would be redundant.**

${body}

**Tool Mapping for Pi / OpenCode:**
- Use OpenCode's native \`skill\` tool to list and load skills.
- Read files → \`read\`
- Create/edit files → \`write\`, \`edit\`
- Run shell commands → \`shell\`
</EXTREMELY_IMPORTANT>`;
	} catch {
		cachedBootstrap = null;
	}

	return cachedBootstrap;
}

function stripFrontmatter(content: string): string {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	return match ? match[2] : content;
}

function toTextBlocks(content: MessageContent): TextBlock[] {
	if (content === undefined) return [];
	if (typeof content === "string") return [{ type: "text", text: content }];
	return content;
}

function messageContainsBootstrap(message: MessageLike): boolean {
	return toTextBlocks(message.content).some(
		(block) =>
			block.type === "text" &&
			typeof block.text === "string" &&
			block.text.includes(BOOTSTRAP_MARKER),
	);
}

function firstNonCompactionSummaryIndex(messages: MessageLike[]): number {
	for (let i = 0; i < messages.length; i++) {
		const isCompaction = toTextBlocks(messages[i].content).some(
			(block) =>
				block.type === "text" &&
				typeof block.text === "string" &&
				block.text.includes("compaction"),
		);
		if (!isCompaction) return i;
	}
	// All messages were compaction summaries (or there were none) — append
	// after them rather than prepending before the summary context.
	return messages.length;
}