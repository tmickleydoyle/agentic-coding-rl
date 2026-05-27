"""Agent tools for rung 2+ (multi-turn agentic RL). SCAFFOLD — not yet implemented.

The rung-2 environment gives the policy the same kind of tools Composer uses, executed
against a checked-out repo inside the Docker sandbox (acrl/sandbox, Docker backend TODO):

  - read_file(path)              -> str
  - edit_file(path, old, new)    -> applies a search/replace edit
  - write_file(path, content)
  - run_terminal(cmd)            -> {stdout, stderr, exit_code}   (the powerful one)
  - search_code(query)           -> ranked file/line hits         (semantic/grep)

Each tool call is a structured action the policy emits; `acrl/agent/harness.py` executes
it and feeds the result back as the next turn. The reward (acrl/reward/verifiable) runs
the repo's test command at the end of the trajectory.

Design the schemas here as a stable contract; the trainer and reward never change when
tools are added.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ToolSpec:
    name: str
    description: str
    # JSON-schema-style parameter spec; filled in when rung 2 is built.
    parameters: dict


# Placeholder registry — populated in rung 2.
RUNG2_TOOLS: list[ToolSpec] = []


def execute_tool(name: str, args: dict, workdir: str) -> dict:
    """Execute one tool call inside the sandbox working dir. SCAFFOLD."""
    raise NotImplementedError("rung 2: tool execution against the Docker sandbox")
