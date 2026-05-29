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
_JS_FENCE_RE = re.compile(r"```(?:javascript|js|typescript|ts)?\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)


def extract_code(text: str, framework: str = "python") -> str:
    """Pull a fenced code block from a model completion.

    Prefer a fenced block; among multiple, prefer one with a function definition for the
    target language. Fall back to the raw text (some models emit code without fences).
    """
    if framework in ("js", "ts"):
        blocks = _JS_FENCE_RE.findall(text)
        if blocks:
            for b in blocks:
                if "function " in b or "=>" in b:
                    return b.strip()
            return blocks[0].strip()
        return text.strip()
    # default: python
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
    framework: list[str] | None = None,
    workdir: list[str] | None = None,
    task_dir: list[str] | None = None,
    timeout: float = 10.0,
    **kwargs: Any,
) -> list[float]:
    """Dispatch on per-row `framework` column. Defaults to 'python' for backward compat.

    'python' / 'js' / 'ts' tasks are single-file: the candidate code is extracted from the
    completion text and run against per-row `tests`. 'nextjs' tasks are multi-file and
    agentic — there is no single text completion to score; the reward runs Vitest against
    the agent's final working directory, supplied per-row via the `workdir` column (with the
    canonical tests sourced from `task_dir`). The rejection-sampling collector computes this
    reward directly via `run_nextjs_task`; this branch keeps the dispatch symmetric for any
    dataset-driven (e.g. GRPO) path that carries those columns.
    """
    n = len(completions)
    rewards: list[float] = []
    for i in range(n):
        fw = (framework[i] if framework is not None else "python") or "python"
        if fw == "nextjs":
            wd = workdir[i] if workdir is not None else None
            if not wd:
                rewards.append(0.0)
                continue
            from acrl.sandbox.nextjs_runner import run_nextjs_task
            td = task_dir[i] if task_dir is not None else None
            result = run_nextjs_task(wd, task_dir=td, timeout=max(timeout, 60.0))
            rewards.append(result.fraction)
            continue

        if tests is None:
            raise ValueError("verifiable_reward requires a per-row `tests` column for non-nextjs tasks")
        code = extract_code(_completion_text(completions[i]), framework=fw)
        row_tests = tests[i]
        row_setup = setup[i] if setup is not None else ""
        if fw in ("js", "ts"):
            from acrl.sandbox.js_runner import run_js_task
            result = run_js_task(code, row_tests, timeout=timeout)
        else:
            result = run_python_task(code, row_tests, setup=row_setup, timeout=timeout)
        rewards.append(result.fraction)
    return rewards
