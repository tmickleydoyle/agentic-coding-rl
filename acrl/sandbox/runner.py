"""Execute candidate code against a task's tests, in isolation, and score it.

Rung 1 uses subprocess isolation: each candidate runs in a fresh `python` process in
a temp dir, with a wall-clock timeout and best-effort CPU/memory rlimits. This is
adequate for ephemeral GPU pods running model-generated *function-level* code.

Rung 2 (agentic, repo-level) will swap this for Docker-container isolation behind the
same `run_python_task` interface — see acrl/sandbox (Docker TODO) and the plan.

Reward granularity: tests are independent snippets, so the result reports
`passed / total`, giving a smooth signal for GRPO rather than pass/fail.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from dataclasses import dataclass

# Harness runs INSIDE the sandboxed subprocess. It loads the candidate + tests from
# files (avoids any source-escaping issues), execs them in one namespace, and prints
# a JSON summary as the final stdout line.
_HARNESS = r'''
import json, sys

def _run():
    with open("candidate.py") as f:
        candidate_src = f.read()
    with open("setup.py") as f:
        setup_src = f.read()
    with open("tests.json") as f:
        tests = json.load(f)

    ns = {"__name__": "__candidate__"}
    compiled = True
    compile_error = ""
    try:
        if setup_src.strip():
            exec(compile(setup_src, "setup.py", "exec"), ns)
        exec(compile(candidate_src, "candidate.py", "exec"), ns)
    except Exception as e:  # syntax error, import error, top-level crash
        compiled = False
        compile_error = f"{type(e).__name__}: {e}"

    passed = 0
    errors = []
    if compiled:
        for i, t in enumerate(tests):
            try:
                exec(compile(t, f"test_{i}.py", "exec"), dict(ns))
                passed += 1
            except Exception as e:
                errors.append(f"test[{i}] {type(e).__name__}: {e}")
    else:
        errors.append(compile_error)

    print(json.dumps({
        "passed": passed,
        "total": len(tests),
        "compiled": compiled,
        "errors": errors[:5],
    }))

_run()
'''


@dataclass
class RunResult:
    passed: int
    total: int
    compiled: bool
    timed_out: bool
    errors: list[str]

    @property
    def fraction(self) -> float:
        if self.total == 0:
            return 0.0
        return self.passed / self.total

    @property
    def all_passed(self) -> bool:
        return self.total > 0 and self.passed == self.total


def _limit_resources(cpu_seconds: int, mem_bytes: int):
    """preexec_fn: cap CPU time and address space (POSIX, best-effort)."""
    try:
        import resource

        resource.setrlimit(resource.RLIMIT_CPU, (cpu_seconds, cpu_seconds))
        # RLIMIT_AS only on Linux: macOS maps multi-GB of virtual space even for tiny
        # programs, so an address-space cap there kills legit processes. Rely on the
        # wall-clock timeout on macOS instead.
        if sys.platform.startswith("linux"):
            try:
                resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))
            except (ValueError, OSError):
                pass
    except Exception:
        pass


def run_python_task(
    candidate_code: str,
    tests: list[str],
    setup: str = "",
    timeout: float = 10.0,
    mem_mb: int = 1024,
) -> RunResult:
    total = len(tests)
    if not candidate_code.strip():
        return RunResult(0, total, compiled=False, timed_out=False, errors=["empty candidate"])

    with tempfile.TemporaryDirectory(prefix="acrl_sbx_") as d:
        with open(os.path.join(d, "candidate.py"), "w") as f:
            f.write(candidate_code)
        with open(os.path.join(d, "setup.py"), "w") as f:
            f.write(setup)
        with open(os.path.join(d, "tests.json"), "w") as f:
            json.dump(tests, f)
        with open(os.path.join(d, "harness.py"), "w") as f:
            f.write(_HARNESS)

        preexec = None
        if os.name == "posix":
            preexec = lambda: _limit_resources(int(timeout) + 1, mem_mb * 1024 * 1024)  # noqa: E731

        try:
            proc = subprocess.run(
                [sys.executable, "harness.py"],
                cwd=d,
                capture_output=True,
                text=True,
                timeout=timeout,
                preexec_fn=preexec,
            )
        except subprocess.TimeoutExpired:
            return RunResult(0, total, compiled=True, timed_out=True, errors=["timeout"])

        summary = _parse_summary(proc.stdout)
        if summary is None:
            err = (proc.stderr or proc.stdout or "no output").strip().splitlines()[-5:]
            return RunResult(0, total, compiled=False, timed_out=False, errors=err)
        return RunResult(
            passed=summary.get("passed", 0),
            total=summary.get("total", total),
            compiled=summary.get("compiled", False),
            timed_out=False,
            errors=summary.get("errors", []),
        )


def _parse_summary(stdout: str) -> dict | None:
    for line in reversed(stdout.strip().splitlines()):
        line = line.strip()
        if line.startswith("{") and line.endswith("}"):
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                continue
    return None
