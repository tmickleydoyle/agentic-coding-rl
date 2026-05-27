"""Core harness tests — no GPU/model needed. Validates tasks + sandbox + reward."""

import textwrap

import pytest

from acrl.reward.verifiable import extract_code, verifiable_reward
from acrl.sandbox.runner import run_python_task
from acrl.tasks.build_tasks import load_tasks


def _all_bundled():
    return load_tasks(source="bundled", split=None)


def test_bundled_tasks_load():
    train = load_tasks(source="bundled", split="train")
    test = load_tasks(source="bundled", split="test")
    assert len(train) >= 5
    assert len(test) >= 2
    # splits are disjoint
    assert set(t.task_id for t in train).isdisjoint(t.task_id for t in test)


@pytest.mark.parametrize("task", _all_bundled(), ids=lambda t: t.task_id)
def test_canonical_solution_passes_all_tests(task):
    """Every bundled task's reference solution must pass its own tests."""
    result = run_python_task(task.canonical_solution, task.tests, setup=task.setup)
    assert result.compiled, result.errors
    assert result.all_passed, f"{task.task_id}: {result.passed}/{result.total} {result.errors}"


def test_wrong_solution_scores_low():
    [task] = load_tasks(source="bundled", split="train", limit=1)
    wrong = f"def {task.entry_point}(*args, **kwargs):\n    return None\n"
    result = run_python_task(wrong, task.tests)
    assert result.fraction < 1.0


def test_syntax_error_scores_zero():
    result = run_python_task("def broken(:\n    pass", ["assert broken() == 1"])
    assert not result.compiled
    assert result.fraction == 0.0


def test_timeout_scores_zero():
    result = run_python_task(
        "def f():\n    while True:\n        pass\n",
        ["assert f() == 1"],
        timeout=2.0,
    )
    assert result.timed_out
    assert result.fraction == 0.0


def test_partial_credit():
    code = "def f(x):\n    return 1\n"
    tests = ["assert f(1) == 1", "assert f(2) == 1", "assert f(3) == 99"]
    result = run_python_task(code, tests)
    assert result.passed == 2
    assert result.total == 3
    assert abs(result.fraction - 2 / 3) < 1e-9


def test_extract_code_from_fence():
    text = textwrap.dedent(
        """
        Sure, here you go:
        ```python
        def add(a, b):
            return a + b
        ```
        Hope that helps!
        """
    )
    assert extract_code(text) == "def add(a, b):\n    return a + b"


def test_extract_code_no_fence_returns_text():
    assert extract_code("def add(a, b): return a + b") == "def add(a, b): return a + b"


def test_verifiable_reward_trl_signature():
    tasks = load_tasks(source="bundled", split="train", limit=2)
    prompts = [[{"role": "user", "content": t.model_prompt()}] for t in tasks]
    completions = [
        f"```python\n{tasks[0].canonical_solution}```",  # correct
        "```python\ndef wrong():\n    return 0\n```",  # wrong
    ]
    rewards = verifiable_reward(
        prompts,
        completions,
        tests=[tasks[0].tests, tasks[1].tests],
        setup=[tasks[0].setup, tasks[1].setup],
    )
    assert rewards[0] == 1.0
    assert rewards[1] < 1.0
