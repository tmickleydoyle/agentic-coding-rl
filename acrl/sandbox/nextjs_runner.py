"""Execute a multi-file Next.js/React candidate against its Vitest suite.

This mirrors `data/nextjs/validate.sh`, but as a reward function returning a `RunResult`
so it slots into the same pipeline as `run_python_task` / `run_js_task`.

Given a directory of candidate files (the agent's final workdir, or a `reference/` dir),
we assemble a clean workdir:

  - copy the candidate's files in, EXCEPT any `tests/` it may contain
  - overlay the CANONICAL `tests/` from the task dir  (anti-cheat: the agent can edit its
    own tests during a rollout, but the reward always runs against the original tests)
  - copy the shared vitest config/setup/tsconfig/package.json from `data/nextjs/`
  - symlink the shared `node_modules` (whose `.vite` transform cache warms across runs)

then run `npx vitest run --reporter=json --outputFile=...` and parse the JSON *file*
(never stdout — vitest interleaves config warnings and tsx compile errors there).

Reward = numPassedTests / numTotalTests, NaN-safe: a workdir that won't compile or
emits zero tests scores 0.0 with `compiled=False`.

Requires Node + `npm install` already run in `data/nextjs/` (one-time).
"""

from __future__ import annotations

import json
import os
import shutil
import signal
import subprocess
import tempfile
from pathlib import Path

from acrl.sandbox.runner import RunResult

# The shared config files copied into every assembled workdir.
_CONFIG_FILES = ("vitest.config.ts", "vitest.setup.ts", "tsconfig.json", "package.json")
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DATA_ROOT = _REPO_ROOT / "data" / "nextjs"


def _infer_task_dir(candidate_dir: Path) -> Path:
    """If candidate_dir is a task subdir like .../<task>/reference, the task is its parent."""
    if candidate_dir.name in ("reference", "starter") and candidate_dir.parent.is_dir():
        return candidate_dir.parent
    return candidate_dir


def _copy_candidate(candidate_dir: Path, work: Path) -> None:
    """Copy candidate files into `work`, skipping any tests/ and node_modules the agent left."""
    for item in candidate_dir.iterdir():
        if item.name in ("tests", "node_modules") or item.name in _CONFIG_FILES:
            continue
        dest = work / item.name
        if item.is_dir():
            shutil.copytree(item, dest, symlinks=False)
        else:
            shutil.copy2(item, dest)


def run_nextjs_task(
    candidate_dir: str | os.PathLike,
    task_dir: str | os.PathLike | None = None,
    data_root: str | os.PathLike | None = None,
    timeout: float = 60.0,
    test_timeout_ms: int = 8000,
) -> RunResult:
    """Run the candidate files in `candidate_dir` against the task's canonical Vitest suite.

    candidate_dir: dir holding the model's solution (agent workdir or a reference/ dir).
    task_dir:      data/nextjs/<task>/ that provides the canonical `tests/`. Inferred from
                   candidate_dir if omitted.
    data_root:     dir holding the shared vitest config + node_modules (default data/nextjs/).
    """
    candidate_dir = Path(candidate_dir).resolve()
    task_dir = Path(task_dir).resolve() if task_dir else _infer_task_dir(candidate_dir)
    data_root = Path(data_root).resolve() if data_root else _DEFAULT_DATA_ROOT

    tests_src = task_dir / "tests"
    node_modules = data_root / "node_modules"
    if not tests_src.is_dir():
        return RunResult(0, 0, compiled=False, timed_out=False,
                         errors=[f"no tests/ dir at {tests_src}"])
    if not node_modules.is_dir():
        return RunResult(0, 0, compiled=False, timed_out=False,
                         errors=[f"node_modules missing at {node_modules} — run `npm install`"])

    with tempfile.TemporaryDirectory(prefix="acrl_next_") as d:
        work = Path(d)
        _copy_candidate(candidate_dir, work)
        shutil.copytree(tests_src, work / "tests", symlinks=False)
        for cfg in _CONFIG_FILES:
            src = data_root / cfg
            if src.is_file():
                shutil.copy2(src, work / cfg)
        os.symlink(node_modules, work / "node_modules")

        out_file = work / "_vitest_result.json"
        cmd = [
            "npx", "vitest", "run",
            "--reporter=json",
            f"--outputFile={out_file}",
            f"--testTimeout={test_timeout_ms}",
        ]
        try:
            proc = subprocess.run(
                cmd,
                cwd=str(work),
                capture_output=True,
                text=True,
                timeout=timeout,
                # New process group so we can kill any lingering vitest workers on timeout.
                start_new_session=True,
            )
        except subprocess.TimeoutExpired:
            return RunResult(0, 0, compiled=False, timed_out=True, errors=["vitest wall-clock timeout"])

        return _parse_vitest(out_file, proc)


def _parse_vitest(out_file: Path, proc: subprocess.CompletedProcess) -> RunResult:
    """Parse vitest's JSON report file. Fall back to a clear error on no/garbage output."""
    if not out_file.is_file():
        tail = (proc.stderr or proc.stdout or "no output").strip().splitlines()[-6:]
        return RunResult(0, 0, compiled=False, timed_out=False, errors=tail)
    try:
        data = json.loads(out_file.read_text())
    except json.JSONDecodeError:
        tail = (proc.stderr or proc.stdout or "unparseable report").strip().splitlines()[-6:]
        return RunResult(0, 0, compiled=False, timed_out=False, errors=tail)

    total = int(data.get("numTotalTests", 0) or 0)
    passed = int(data.get("numPassedTests", 0) or 0)
    # No tests ran => the suite didn't compile or the files weren't found. Score 0, not NaN.
    if total == 0:
        tail = (proc.stderr or proc.stdout or "0 tests ran (compile/import failure)").strip().splitlines()[-6:]
        return RunResult(0, 0, compiled=False, timed_out=False, errors=tail)

    errors: list[str] = []
    for res in data.get("testResults", []):
        msg = res.get("message") or ""
        if msg:
            errors.append(msg.strip().splitlines()[0][:200])
    return RunResult(passed=passed, total=total, compiled=True, timed_out=False, errors=errors[:5])


def _main() -> None:
    import argparse

    ap = argparse.ArgumentParser(description="Run a Next.js candidate dir against its Vitest suite.")
    ap.add_argument("candidate_dir", help="dir holding the solution files (e.g. data/nextjs/<task>/reference)")
    ap.add_argument("--task-dir", default=None, help="task dir providing canonical tests/ (inferred if omitted)")
    ap.add_argument("--data-root", default=None, help="dir with shared vitest config + node_modules")
    ap.add_argument("--timeout", type=float, default=60.0)
    args = ap.parse_args()

    r = run_nextjs_task(args.candidate_dir, task_dir=args.task_dir, data_root=args.data_root, timeout=args.timeout)
    print(f"RunResult(passed={r.passed}, total={r.total}, compiled={r.compiled}, "
          f"timed_out={r.timed_out}, fraction={r.fraction:.3f})")
    if r.errors:
        print("errors:")
        for e in r.errors:
            print("  -", e)


if __name__ == "__main__":
    _main()
