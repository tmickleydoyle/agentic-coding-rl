"""Create a held-out hidden suite for full-spec tasks by MOVING a subset of test files from
tests/ into tests_hidden/.

These tasks carry a complete spec in description.md, so the agent builds every feature from the
spec; the held-out test files then measure spec-conformance on features whose tests it never saw
at training — a generalization / anti-test-overfit signal scored only by eval_stats.

Only touches split=test tasks (eval set). Keeps >=2 files visible; moves max(1, N//3) of the
alphabetically-last test files (capped so >=2 remain). Skips tasks that already have tests_hidden.

Usage:
  python data/nextjs/split_hidden.py 'scratch-app-*'
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main():
    pat = sys.argv[1] if len(sys.argv) > 1 else "scratch-app-*"
    done = 0
    for d in sorted(ROOT.glob(pat)):
        if not (d / "tests").is_dir() or not (d / "meta.json").exists():
            continue
        try:
            meta = json.loads((d / "meta.json").read_text())
        except Exception:
            continue
        if meta.get("split") != "test":
            continue
        if (d / "tests_hidden").exists():
            print(f"skip {d.name}: tests_hidden already exists")
            continue
        files = sorted(p for p in (d / "tests").glob("*.test.*"))
        n = len(files)
        if n < 3:
            print(f"skip {d.name}: only {n} test file(s) — too few to hold out")
            continue
        k = min(max(1, n // 3), n - 2)
        move = files[-k:]
        (d / "tests_hidden").mkdir()
        for f in move:
            shutil.move(str(f), str(d / "tests_hidden" / f.name))
        print(f"{d.name}: held out {[f.name for f in move]}  ({n - k} visible / {k} hidden)")
        done += 1
    print(f"\nsplit hidden suites for {done} test-split tasks")
    print("verify: python data/nextjs/probe_hackable.py '<glob>'")


if __name__ == "__main__":
    main()
