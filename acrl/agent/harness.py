"""Multi-turn agentic rollout loop for rung 2+. SCAFFOLD — not yet implemented.

A Trajectory is the rung-2 analog of a single completion: the model reads/edits files and
runs commands over several turns until it stops or hits a budget, then the verifiable reward
runs the repo's tests. The trainer (acrl/train) treats the whole trajectory as one sample.

The interface below is intentionally model-agnostic so the SAME harness drives the small
rung-2 model and Laguna at rung 3 — only the policy backend changes.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class Trajectory:
    task_id: str
    messages: list[dict[str, Any]] = field(default_factory=list)  # full turn history
    tool_calls: list[dict[str, Any]] = field(default_factory=list)
    final_reward: float = 0.0


class AgentHarness:
    """Runs a policy in the sandboxed repo until done, producing a Trajectory. SCAFFOLD."""

    def __init__(self, max_turns: int = 20, turn_timeout: float = 60.0):
        self.max_turns = max_turns
        self.turn_timeout = turn_timeout

    def run(self, task, policy) -> Trajectory:
        # Loop: render state -> policy emits tool call -> execute_tool -> append result ->
        # repeat until the policy stops or max_turns; then score with verifiable reward.
        raise NotImplementedError("rung 2: implement the read/edit/terminal/search agent loop")
