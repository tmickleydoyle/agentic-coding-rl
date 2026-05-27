"""Verifiable reward: run the model's code against the task's tests.

This is the reward signal that scales all the way to the Composer-class target:
correctness you can *check*, not a judge's opinion. Reward = fraction of tests passing.

Signature matches TRL's GRPOTrainer reward-function contract:
    reward_fn(prompts, completions, **dataset_columns) -> list[float]
where dataset columns (tests, setup, entry_point, ...) arrive as per-row lists.
"""

from __future__ import annotations

import re
from typing import Any

from acrl.sandbox.runner import run_python_task

_FENCE_RE = re.compile(r"```(?:python|py)?\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)


def extract_code(text: str) -> str:
    """Pull a Python code block from a model completion.

    Prefer a fenced block; among multiple, prefer one that defines a function.
    Fall back to the raw text (some models emit code without fences).
    """
    blocks = _FENCE_RE.findall(text)
    if blocks:
        for b in blocks:
            if "def " in b:
                return b.strip()
        return blocks[0].strip()
    return text.strip()


def _completion_text(completion: Any) -> str:
    # Conversational format: completion is a list of {role, content} messages.
    if isinstance(completion, list):
        for msg in reversed(completion):
            if isinstance(msg, dict) and msg.get("content"):
                return str(msg["content"])
        return ""
    return str(completion)


def verifiable_reward(
    prompts: list[Any],
    completions: list[Any],
    tests: list[list[str]] | None = None,
    setup: list[str] | None = None,
    timeout: float = 10.0,
    **kwargs: Any,
) -> list[float]:
    n = len(completions)
    if tests is None:
        raise ValueError("verifiable_reward requires a per-row `tests` column from the dataset")

    rewards: list[float] = []
    for i in range(n):
        code = extract_code(_completion_text(completions[i]))
        row_tests = tests[i]
        row_setup = setup[i] if setup is not None else ""
        result = run_python_task(code, row_tests, setup=row_setup, timeout=timeout)
        rewards.append(result.fraction)
    return rewards
