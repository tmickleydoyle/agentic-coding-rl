"""Repurpose the existing scaffolded app-* full apps into from-scratch (blank-canvas) tasks.

The 137 app-* tasks are already complete multi-route applications (reference + comprehensive
Vitest suite). The only thing making them "fill in the blanks" instead of "build from scratch"
is the scaffolded starter/. This script clones each app into a `scratch-app-*` task that REUSES
the reference + tests + description, but replaces the starter with a blank app/page.tsx — so the
agent must build the whole app from nothing. Instant, free, full-app training pool (calibration
then sorts which land in the reachable band vs the dead tail).

Existing targets are skipped, so hand-authored scratch-app-* tasks are never overwritten.

Usage:
  python data/nextjs/repurpose_apps.py            # all app-*
  python data/nextjs/repurpose_apps.py 'app-task*' # subset
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BLANK = (
    "'use client'\n\n"
    "// Build the entire application from scratch. The root component must be the default export.\n"
    "export default function App() {\n  return <div />\n}\n"
)
NOTE = (
    "> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, "
    "`hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` "
    "(no Next.js APIs; routing is in-app state). The starter is an empty page.\n\n"
)


def main():
    pat = sys.argv[1] if len(sys.argv) > 1 else "app-*"
    made = skipped = 0
    for src in sorted(ROOT.glob(pat)):
        if not src.is_dir() or not (src / "reference").is_dir() or not (src / "tests").is_dir():
            continue
        name = "scratch-" + src.name
        dst = ROOT / name
        if dst.exists():
            skipped += 1
            continue
        try:
            meta = json.loads((src / "meta.json").read_text())
        except Exception:
            continue
        entry = meta.get("entry_point", "app/page.tsx")
        dst.mkdir()
        desc = (src / "description.md").read_text() if (src / "description.md").exists() else ""
        (dst / "description.md").write_text(NOTE + desc)
        (dst / "meta.json").write_text(json.dumps({
            "task_id": f"nextjs/{name}",
            "framework": "nextjs",
            "difficulty": meta.get("difficulty", "hard"),
            "entry_point": entry,
            "summary": meta.get("summary", ""),
            "split": meta.get("split", "train"),
            "from_scratch": True,
            "repurposed_from": src.name,
        }, indent=2))
        shutil.copytree(src / "reference", dst / "reference")
        shutil.copytree(src / "tests", dst / "tests")
        starter_entry = dst / "starter" / Path(entry)
        starter_entry.parent.mkdir(parents=True, exist_ok=True)
        starter_entry.write_text(BLANK)
        made += 1
    print(f"made {made}, skipped {skipped} (already existed)")
    print("next: python data/nextjs/validate_rl.py 'scratch-app-*'  (then calibrate)")


if __name__ == "__main__":
    main()
