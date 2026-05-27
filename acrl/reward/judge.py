"""Optional LLM-judge reward (Claude Haiku) — rung-1 PLUMBING SMOKE TEST ONLY.

Use this to confirm the GRPO loop turns a scalar reward into a learning signal
*without* standing up a sandbox. It is deliberately NOT the path to the Composer-class
goal: a judge scores "looks good," not "is correct," and it costs API calls per step.
Switch to acrl.reward.verifiable as soon as the loop is proven.

Requires: pip install ".[judge]" and ANTHROPIC_API_KEY in the environment.
"""

from __future__ import annotations

import hashlib
import os
import re
from typing import Any

_RUBRIC = (
    "You are scoring a candidate solution to a Python coding task. Rate it from 0 to 10 on "
    "correctness, completeness, and code quality. A correct, complete function scores 8-10; "
    "partially correct scores 3-7; irrelevant or broken scores 0-2. "
    "Respond with ONLY the integer score."
)

_cache: dict[str, float] = {}
_client = None


def _get_client():
    global _client
    if _client is None:
        import anthropic  # lazy: only needed when judge reward is actually used

        _client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    return _client


def _completion_text(completion: Any) -> str:
    if isinstance(completion, list):
        for msg in reversed(completion):
            if isinstance(msg, dict) and msg.get("content"):
                return str(msg["content"])
        return ""
    return str(completion)


def _score_one(prompt: str, completion: str, model: str) -> float:
    key = hashlib.sha1(f"{model}\x00{prompt}\x00{completion}".encode()).hexdigest()
    if key in _cache:
        return _cache[key]
    msg = _get_client().messages.create(
        model=model,
        max_tokens=8,
        system=_RUBRIC,
        messages=[{"role": "user", "content": f"TASK:\n{prompt}\n\nCANDIDATE:\n{completion}"}],
    )
    text = "".join(b.text for b in msg.content if getattr(b, "type", None) == "text")
    m = re.search(r"\d+", text)
    score = (min(int(m.group()), 10) / 10.0) if m else 0.0
    _cache[key] = score
    return score


def judge_reward(
    prompts: list[Any],
    completions: list[Any],
    model: str = "claude-haiku-4-5-20251001",
    **kwargs: Any,
) -> list[float]:
    rewards = []
    for p, c in zip(prompts, completions):
        prompt_text = p if isinstance(p, str) else str(p)
        rewards.append(_score_one(prompt_text, _completion_text(c), model))
    return rewards
