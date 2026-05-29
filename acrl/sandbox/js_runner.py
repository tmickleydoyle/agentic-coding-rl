"""Execute candidate JavaScript code against tests in a `node` subprocess.

For MultiPL-E and similar single-file JS tasks: the candidate is concatenated with the
test driver (which contains asserts / `throws on failure`) and run as one script. Exit
code 0 = all tests pass; non-zero = fail. The wrapper supports an optional list of
independent test snippets for fractional reward, mirroring `run_python_task`.

Requires `node` on PATH (any recent LTS works).
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile

from acrl.sandbox.runner import RunResult


def _run_one(candidate: str, test_block: str, timeout: float, mem_mb: int) -> tuple[bool, str]:
    """Run candidate + a single test block as one node script. Returns (passed, err)."""
    with tempfile.TemporaryDirectory(prefix="acrl_js_") as d:
        path = os.path.join(d, "main.js")
        with open(path, "w") as f:
            f.write(candidate)
            f.write("\n\n// --- tests ---\n")
            f.write(test_block)
        try:
            proc = subprocess.run(
                ["node", "--no-warnings", path],
                capture_output=True,
                text=True,
                timeout=timeout,
            )
        except subprocess.TimeoutExpired:
            return False, "timeout"
        except FileNotFoundError:
            return False, "node not installed on PATH"
        if proc.returncode == 0:
            return True, ""
        # Show last few lines of stderr/stdout for debugging
        tail = (proc.stderr or proc.stdout or "").strip().splitlines()[-3:]
        return False, " | ".join(tail)


def run_js_task(
    candidate_code: str,
    tests: list[str] | str,
    timeout: float = 10.0,
    mem_mb: int = 1024,
) -> RunResult:
    """Run `candidate_code` against `tests`.

    If `tests` is a list, each entry is treated as an independent test block — total is
    `len(tests)` and the reward is fractional (matches MBPP-style multi-assert tasks). If
    `tests` is a single string, it's treated as one combined test driver (HumanEval-style),
    yielding binary 0/1 reward.
    """
    if not candidate_code.strip():
        return RunResult(0, 1, compiled=False, timed_out=False, errors=["empty candidate"])

    if isinstance(tests, str):
        ok, err = _run_one(candidate_code, tests, timeout, mem_mb)
        return RunResult(
            passed=1 if ok else 0,
            total=1,
            compiled=True,
            timed_out=err == "timeout",
            errors=[] if ok else [err],
        )

    total = len(tests)
    passed = 0
    errs: list[str] = []
    any_timeout = False
    for t in tests:
        ok, err = _run_one(candidate_code, t, timeout, mem_mb)
        if ok:
            passed += 1
        else:
            errs.append(err)
            if err == "timeout":
                any_timeout = True
    return RunResult(passed=passed, total=total, compiled=True, timed_out=any_timeout, errors=errs[:5])
