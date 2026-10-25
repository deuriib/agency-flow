import os
import re
from pathlib import Path

BOOTSTRAP_MARKER = "agency-flow:using-agency-flow bootstrap for hermes"


def _skills_dir() -> str:
    """Locate the stock skills/ tree for either supported install layout.

    - git-clone install (`hermes plugins install deuriib/agency-flow`): the plugin
      dir is the repo root, so `.hermes-plugin/` and `skills/` are siblings and
      this module resolves `../skills`.
    - flattened install (plugin files copied to the plugin dir root): `skills/`
      sits next to this module.

    Raises loudly when neither matches.
    """
    here = os.path.dirname(os.path.realpath(__file__))
    candidates = (
        os.path.realpath(os.path.join(here, "..", "skills")),
        os.path.realpath(os.path.join(here, "skills")),
    )
    for cand in candidates:
        if os.path.isfile(os.path.join(cand, "using-agency-flow", "SKILL.md")):
            return cand
    raise RuntimeError(
        "agency-flow plugin: cannot find the skills/ tree "
        f"(looked at {candidates}). Reinstall with "
        "`hermes plugins install deuriib/agency-flow`."
    )


def _strip_frontmatter(content: str) -> str:
    match = re.match(r"^---\n[\s\S]*?\n---\n([\s\S]*)$", content)
    return (match.group(1) if match else content).strip()


def _frontmatter_value(content: str, key: str) -> str:
    match = re.match(r"^---\n([\s\S]*?)\n---\n", content)
    if not match:
        return ""
    for line in match.group(1).splitlines():
        name, sep, value = line.partition(":")
        if sep and name.strip() == key:
            return value.strip().strip("\"'")
    return ""


def _build_bootstrap(skills_dir: str) -> str:
    with open(
        os.path.join(skills_dir, "using-agency-flow", "SKILL.md"),
        encoding="utf-8",
    ) as f:
        body = _strip_frontmatter(f.read())

    return (
        f"<EXTREMELY_IMPORTANT>\n"
        f"{BOOTSTRAP_MARKER}\n\n"
        f"You are operating under Agency-Flow.\n\n"
        f"The using-agency-flow skill content is included below and is already "
        f"loaded for this Hermes session. Follow it now. "
        f"Do not try to load using-agency-flow again.\n\n"
        f"{body}\n\n"
        f"## Loading Agency-Flow Skills on Hermes\n\n"
        f"Agency-Flow skills are registered with Hermes' native skill loader: "
        f'invoke one with `skill_view("agency-flow:skill-name")` '
        f'(for example `skill_view("agency-flow:agency-frame")`). '
        f"If a namespaced lookup returns 'not found', read the skill file "
        f"directly instead:\n"
        f'`read_file("{skills_dir}/skill-name/SKILL.md")`\n\n'
        f"The agency-flow skills directory is: `{skills_dir}`\n\n"
        f"</EXTREMELY_IMPORTANT>"
    )


def register(ctx):
    skills_dir = _skills_dir()
    bootstrap = _build_bootstrap(skills_dir)

    for name in sorted(os.listdir(skills_dir)):
        skill_md = os.path.join(skills_dir, name, "SKILL.md")
        if os.path.isfile(skill_md):
            with open(skill_md, encoding="utf-8") as f:
                description = _frontmatter_value(f.read(), "description")
            ctx.register_skill(name, Path(skill_md), description=description)

    def pre_llm_call(
        session_id=None,
        user_message=None,
        conversation_history=None,
        is_first_turn=None,
        model=None,
        platform=None,
        **kwargs,
    ):
        if is_first_turn:
            return {"context": bootstrap}
        return None

    ctx.register_hook("pre_llm_call", pre_llm_call)
