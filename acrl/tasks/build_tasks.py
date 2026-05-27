"""Assemble single-turn executable coding tasks (rung 1).

A `Task` is the model-agnostic unit reused at every rung: a prompt, the expected
function name, a list of independent test snippets, and (for harness validation) a
canonical solution.

Sources:
  - "bundled"  : zero-download offline mini-set (acrl/tasks/_bundled.py).
  - "mbpp"     : Google MBPP via `datasets`; its test_list maps to per-test fractional reward.
  - "humaneval": OpenAI HumanEval via `datasets`; single check block => binary reward.

CLI:
    python -m acrl.tasks.build_tasks --source bundled --split train --show
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass, field
from typing import Any

from acrl.tasks._bundled import BUNDLED_TASKS

# Appended to every task prompt so the policy returns something the sandbox can run.
CODE_INSTRUCTION = (
    "\n\nReturn ONLY the complete Python function in a single ```python code block. "
    "Do not include explanations, examples, or test code."
)


@dataclass
class Task:
    task_id: str
    prompt: str  # natural-language instruction (without the code-format suffix)
    entry_point: str
    tests: list[str]  # independent snippets; reward = fraction that pass
    canonical_solution: str = ""
    split: str = "train"
    setup: str = ""  # code prepended before candidate (e.g. MBPP test_setup_code)
    metadata: dict[str, Any] = field(default_factory=dict)

    def model_prompt(self) -> str:
        """The full instruction shown to the policy."""
        return self.prompt + CODE_INSTRUCTION


def _from_bundled(split: str | None) -> list[Task]:
    tasks = []
    for d in BUNDLED_TASKS:
        if split and d["split"] != split:
            continue
        tasks.append(
            Task(
                task_id=d["task_id"],
                prompt=d["prompt"],
                entry_point=d["entry_point"],
                tests=list(d["tests"]),
                canonical_solution=d.get("canonical_solution", ""),
                split=d["split"],
            )
        )
    return tasks


def _entry_point_from_code(code: str) -> str:
    m = re.search(r"^\s*def\s+([A-Za-z_]\w*)\s*\(", code, re.MULTILINE)
    return m.group(1) if m else ""


def _from_mbpp(split: str | None, limit: int | None) -> list[Task]:
    from datasets import load_dataset

    # MBPP "test" split is the conventional eval slice; "train"/"prompt" are smaller.
    hf_split = "train" if split == "train" else "test"
    # Namespaced id: datasets>=3 dropped bare canonical ids like "mbpp".
    ds = load_dataset("google-research-datasets/mbpp", split=hf_split)
    tasks = []
    for row in ds:
        code = row["code"]
        row_tests = list(row["test_list"])
        # MBPP's text omits the function name; the asserts pin it (and the I/O
        # contract). Showing them is the standard MBPP protocol and lets the model
        # name its function to match the reward tests instead of guessing.
        prompt = row["text"].strip()
        if row_tests:
            prompt += "\n\nYour solution must pass these tests:\n" + "\n".join(row_tests)
        tasks.append(
            Task(
                task_id=f"mbpp/{row['task_id']}",
                prompt=prompt,
                entry_point=_entry_point_from_code(code),
                tests=row_tests,
                canonical_solution=code,
                split=split or hf_split,
                setup=row.get("test_setup_code", "") or "",
            )
        )
        if limit and len(tasks) >= limit:
            break
    return tasks


def _from_humaneval(split: str | None, limit: int | None) -> list[Task]:
    from datasets import load_dataset

    ds = load_dataset("openai_humaneval", split="test")
    tasks = []
    for row in ds:
        ep = row["entry_point"]
        # HumanEval ships a `check(candidate)` function; run it as one snippet -> binary reward.
        check_snippet = row["test"] + f"\ncheck({ep})\n"
        tasks.append(
            Task(
                task_id=row["task_id"],
                prompt=row["prompt"],  # already a signature + docstring
                entry_point=ep,
                tests=[check_snippet],
                canonical_solution=row["prompt"] + row["canonical_solution"],
                split=split or "test",
            )
        )
        if limit and len(tasks) >= limit:
            break
    return tasks


def load_tasks(
    source: str = "bundled",
    split: str | None = "train",
    limit: int | None = None,
) -> list[Task]:
    if source == "bundled":
        tasks = _from_bundled(split)
    elif source == "mbpp":
        tasks = _from_mbpp(split, limit)
    elif source == "humaneval":
        tasks = _from_humaneval(split, limit)
    else:
        raise ValueError(f"unknown task source: {source!r}")
    if limit:
        tasks = tasks[:limit]
    return tasks


def to_dataset(tasks: list[Task]):
    """Build an HF Dataset for TRL GRPO.

    Non-"prompt" columns are passed through to the reward function as kwargs
    (aligned per batch row), so the verifiable reward can re-run the tests.
    """
    from datasets import Dataset

    return Dataset.from_list(
        [
            {
                "prompt": t.model_prompt(),
                "task_id": t.task_id,
                "entry_point": t.entry_point,
                "tests": t.tests,
                "setup": t.setup,
            }
            for t in tasks
        ]
    )


def _main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default="bundled", choices=["bundled", "mbpp", "humaneval"])
    ap.add_argument("--split", default="train")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--show", action="store_true", help="print the loaded tasks")
    args = ap.parse_args()

    tasks = load_tasks(source=args.source, split=args.split, limit=args.limit)
    print(f"loaded {len(tasks)} task(s) from source={args.source} split={args.split}")
    if args.show:
        for t in tasks:
            print(f"\n=== {t.task_id} [{t.split}] entry={t.entry_point} tests={len(t.tests)} ===")
            print(t.prompt)


if __name__ == "__main__":
    _main()
