"""Loader for MultiPL-E (nuprl/MultiPL-E) — multilingual translations of HumanEval / MBPP.

We expose four single-function JS/TS sources:
  - "multipl-e-humaneval-js" / "multipl-e-humaneval-ts"
  - "multipl-e-mbpp-js"      / "multipl-e-mbpp-ts"

Each MultiPL-E row has:
  - prompt: function signature + docstring (the policy completes the body)
  - tests:  a string of test-driver code (asserts that throw on failure)
  - name:   task id
  - language: "js" / "ts" / ...
  - stop_tokens: stop tokens for generation (we pass them through metadata)

Reward shape: tests are one combined driver per row → binary 1/0 (matches the HumanEval
style we already accept). For fractional reward you'd need to split the driver; that's
unnecessary at this scale.

NOTE on training/eval pollution: MultiPL-E was designed as an EVAL benchmark. If you use
it for training, do NOT also report results on it. Reserve a fresh task source for the
held-out demo number.
"""

from __future__ import annotations

from acrl.tasks.build_tasks import Task

_CONFIG_FOR_SOURCE = {
    "multipl-e-humaneval-js": ("humaneval-js", "js"),
    "multipl-e-humaneval-ts": ("humaneval-ts", "ts"),
    "multipl-e-mbpp-js": ("mbpp-js", "js"),
    "multipl-e-mbpp-ts": ("mbpp-ts", "ts"),
}


def load_multipl_e(source: str, split: str | None = None, limit: int | None = None) -> list[Task]:
    if source not in _CONFIG_FOR_SOURCE:
        raise ValueError(f"unknown MultiPL-E source: {source!r}")
    config, lang = _CONFIG_FOR_SOURCE[source]

    from datasets import load_dataset

    # MultiPL-E has only a "test" split (it's an eval-shaped corpus); we accept any
    # `split` arg and load the only available one.
    ds = load_dataset("nuprl/MultiPL-E", config, split="test")

    tasks: list[Task] = []
    for row in ds:
        prompt = (row["prompt"] or "").strip()
        tests = row["tests"] or ""
        if not prompt or not tests:
            continue
        # Entry point isn't always parseable; leave a best-effort hint from the name.
        entry_point = (row.get("name") or "").split("_", 1)[0]
        tasks.append(
            Task(
                task_id=f"{source}/{row.get('name','?')}",
                prompt=prompt,
                entry_point=entry_point,
                tests=[tests],  # single-element list → binary reward via JS runner
                canonical_solution="",  # MultiPL-E doesn't ship references
                split=split or "test",
                setup="",
                framework=lang,  # "js" or "ts" — verifiable_reward dispatches on this
                metadata={
                    "stop_tokens": row.get("stop_tokens", []),
                    "language": row.get("language"),
                },
            )
        )
        if limit and len(tasks) >= limit:
            break
    return tasks
