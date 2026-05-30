"""Validate Next.js tasks for the RL pipeline. Run as you add examples.

Checks BOTH gates a task must pass to be usable:
  1. LOADER gate  — all 5 pieces present (meta.json, description.md, starter/, tests/,
     reference/) with framework=nextjs. Missing any → the loader (acrl/tasks/_nextjs.py)
     SILENTLY SKIPS the task (it never reaches training).
  2. RL-VALIDITY  — reference PASSES all its tests (well-formed) AND starter FAILS them
     (non-trivial → real RL headroom). Plus: no forbidden imports (only react/react-dom +
     relative + testing libs; the @/ alias is NOT configured).

Usage:
  python data/nextjs/validate_rl.py                 # all tasks
  python data/nextjs/validate_rl.py 'app-*'         # just the new full apps (glob)
"""
import sys, json, re, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from acrl.sandbox.nextjs_runner import run_nextjs_task

ROOT = Path(__file__).resolve().parent
PIECES = ["meta.json", "description.md", "starter", "tests", "reference"]
# allowed import roots: react, react-dom (+ submodules), relative, @testing-library, vitest
ALLOWED = re.compile(r"^(react$|react-dom|react/|@testing-library/|vitest$|\.|/)")

def forbidden_imports(task: Path):
    bad = set()
    for f in list(task.rglob("*.ts")) + list(task.rglob("*.tsx")):
        for m in re.findall(r"from ['\"]([^'\"]+)['\"]", f.read_text(errors="ignore")):
            if not ALLOWED.match(m):
                bad.add(m)
    return sorted(bad)

def main():
    pat = sys.argv[1] if len(sys.argv) > 1 else "*"
    tasks = sorted(p for p in ROOT.glob(pat) if p.is_dir() and p.name != "node_modules")
    ready, issues = [], []
    t0 = time.time()
    for t in tasks:
        if not (t / "reference").is_dir() and not (t / "meta.json").exists():
            continue  # not a task dir
        missing = [p for p in PIECES if not (t / p).exists()]
        if missing:
            issues.append((t.name, f"missing: {', '.join(missing)} → loader SKIPS it")); continue
        try:
            meta = json.loads((t / "meta.json").read_text())
            if meta.get("framework") != "nextjs":
                issues.append((t.name, f"framework={meta.get('framework')} (need 'nextjs')")); continue
        except Exception as e:
            issues.append((t.name, f"bad meta.json: {e}")); continue
        bad = forbidden_imports(t)
        if bad:
            issues.append((t.name, f"forbidden imports (no shared dep / @ alias): {bad[:4]}")); continue
        ref = run_nextjs_task(t / "reference", task_dir=t)
        if not ref.all_passed:
            issues.append((t.name, f"reference {ref.passed}/{ref.total} — must pass all "
                                   f"({(ref.errors[:1] or ['?'])[0][:50]})")); continue
        st = run_nextjs_task(t / "starter", task_dir=t)
        if st.all_passed:
            issues.append((t.name, f"starter already passes {st.passed}/{st.total} — trivial, no RL signal")); continue
        ready.append(t.name)
    print(f"\n{'='*64}\n{len(ready)} READY / {len(ready)+len(issues)} checked  ({time.time()-t0:.0f}s)")
    if issues:
        print(f"\n{len(issues)} NOT ready:")
        for name, why in issues:
            print(f"  ✗ {name:30} {why}")
    else:
        print("All checked tasks are RL-valid. ✅")
    return 0 if not issues else 1

if __name__ == "__main__":
    sys.exit(main())
