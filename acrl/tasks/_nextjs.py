"""Loader for the on-disk Next.js task directories under data/nextjs/.

Each task dir has:
  description.md   -> Task.prompt
  meta.json        -> task_id, framework, difficulty, entry_point
  starter/         -> Task.files (recursive {relpath: content})
  tests/           -> verifier (consumed by the Node sandbox at reward time, not here)
  reference/       -> known-good solution (validation only; ignored by the loader)

Python tasks (the existing MBPP/HumanEval/bundled flow) are untouched.
"""

from __future__ import annotations

import json
from pathlib import Path

from acrl.tasks.build_tasks import Task

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_DATA_DIR = _REPO_ROOT / "data" / "nextjs"


def _read_files(root: Path) -> dict[str, str]:
    """Walk `root` and return {relative_posix_path: content}."""
    out: dict[str, str] = {}
    if not root.is_dir():
        return out
    for p in root.rglob("*"):
        if p.is_file():
            try:
                out[p.relative_to(root).as_posix()] = p.read_text()
            except UnicodeDecodeError:
                # Skip non-text artifacts (none expected in seed tasks, defensive).
                continue
    return out


def load_nextjs_tasks(split: str | None = None) -> list[Task]:
    """Iterate `data/nextjs/<task>/` and yield Task objects (framework='nextjs').

    Each task's split comes from `meta.json["split"]` (default "train"). When `split` is
    given, only tasks with that split are returned; `split=None` returns everything. Tasks
    are held out by adding `"split": "test"` to their meta.json.
    """
    if not _DATA_DIR.is_dir():
        return []
    tasks: list[Task] = []
    for task_dir in sorted(p for p in _DATA_DIR.iterdir() if p.is_dir()):
        meta_path = task_dir / "meta.json"
        desc_path = task_dir / "description.md"
        starter = task_dir / "starter"
        tests = task_dir / "tests"
        reference = task_dir / "reference"
        # A task is valid iff all five pieces exist.
        if not (meta_path.is_file() and desc_path.is_file()
                and starter.is_dir() and tests.is_dir() and reference.is_dir()):
            continue
        meta = json.loads(meta_path.read_text())
        task_split = meta.get("split", "train")
        if split is not None and task_split != split:
            continue
        starter_files = _read_files(starter)
        # Tests live under tests/<...> in the on-disk layout; expose them through
        # metadata so the reward step (Node sandbox) can find them by task_id.
        tests_files = _read_files(tests)
        reference_files = _read_files(reference)
        tasks.append(
            Task(
                task_id=meta.get("task_id", f"nextjs/{task_dir.name}"),
                prompt=desc_path.read_text(),
                entry_point=meta.get("entry_point", ""),
                tests=[],  # not used; Node verifier reads tests_files from metadata
                canonical_solution="",
                split=meta.get("split", "train"),
                files=starter_files,
                framework="nextjs",
                metadata={
                    "difficulty": meta.get("difficulty"),
                    "summary": meta.get("summary"),
                    "tests_files": tests_files,
                    "reference_files": reference_files,
                    "task_dir": str(task_dir),
                },
            )
        )
    return tasks
