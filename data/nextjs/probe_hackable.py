"""Reward-integrity probe for nextjs tasks. Run before trusting a task as an RL signal.

Two checks per task:
  1. HACKABILITY — run the visible tests against the *starter* (the degenerate blank canvas /
     stub). It should score ~0. Any test the starter passes is satisfiable with no real logic
     (e.g. an "initial state" assertion an empty render happens to meet) — a reward-hacking
     surface. Flagged if starter_fraction > FLOOR.
  2. GENERALIZATION — if the task ships a `tests_hidden/` suite (held-out assertions the agent
     never sees at rollout), the reference must pass visible+hidden (==1.0) and the starter must
     still fail it. Confirms the hidden suite is well-formed and actually discriminates.

Usage:
  python data/nextjs/probe_hackable.py            # all tasks
  python data/nextjs/probe_hackable.py 'scratch-*' # subset (glob)

Env: FLOOR (default 0.0) — max starter pass-fraction tolerated before flagging.
"""
import sys, os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from acrl.sandbox.nextjs_runner import run_nextjs_task

ROOT = Path(__file__).resolve().parent
FLOOR = float(os.environ.get("FLOOR", "0.0"))


def main():
    pat = sys.argv[1] if len(sys.argv) > 1 else "*"
    tasks = sorted(p for p in ROOT.glob(pat) if p.is_dir() and p.name != "node_modules")
    flags, checked = [], 0
    for t in tasks:
        if not (t / "tests").is_dir() or not (t / "starter").is_dir() or not (t / "reference").is_dir():
            continue
        checked += 1
        hidden = (t / "tests_hidden") if (t / "tests_hidden").is_dir() else None

        st = run_nextjs_task(t / "starter", task_dir=t)
        line = f"{t.name:28} starter={st.fraction:.2f} ({st.passed}/{st.total})"
        if st.fraction > FLOOR:
            flags.append((t.name, f"starter passes {st.passed}/{st.total} tests with no logic (hackable)"))

        if hidden:
            ref_h = run_nextjs_task(t / "reference", task_dir=t, extra_tests_dir=hidden)
            st_h = run_nextjs_task(t / "starter", task_dir=t, extra_tests_dir=hidden)
            line += f" | +hidden: ref={ref_h.fraction:.2f}({ref_h.passed}/{ref_h.total}) starter={st_h.fraction:.2f}"
            if not ref_h.all_passed:
                flags.append((t.name, f"reference fails hidden suite {ref_h.passed}/{ref_h.total}"))
            if st_h.all_passed:
                flags.append((t.name, "starter passes hidden suite — not discriminating"))
        print(line, flush=True)

    print(f"\n{'='*64}\n{checked} tasks probed, {len(flags)} flag(s)")
    for name, why in flags:
        print(f"  ✗ {name:28} {why}")
    return 1 if flags else 0


if __name__ == "__main__":
    sys.exit(main())
