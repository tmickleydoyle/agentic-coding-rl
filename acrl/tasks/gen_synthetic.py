"""Synthetic executable-task generation.

Implements the "generate + validate" pipeline the original scaffold sketched:

  1. Seed from a hand-curated pool of archetypes (one-line task ideas).
  2. Generate: ask Claude to turn each archetype into a self-contained task with a
     reference solution AND a Vitest test suite, returned as structured JSON.
  3. VALIDATE (critical): assemble reference + tests in a tmp dir and run `npx vitest run`.
     Only tasks whose reference passes its OWN tests are kept. This is what stops bad
     synthetic tasks from teaching bad behavior.
  4. Emit to `data/nextjs/<task_id>/` so the existing `_nextjs.py` loader picks them up.

CLI:
    python -m acrl.tasks.gen_synthetic --target nextjs --n 80 --keep 50
    python -m acrl.tasks.gen_synthetic --target nextjs --dry-run   # show archetypes, no API calls

Requires `ANTHROPIC_API_KEY` (in env or in `.env.local` at the repo root). Install the
SDK with `pip install -e ".[judge]"` (the existing `judge` extra includes anthropic).
"""

from __future__ import annotations

import argparse
import json
import os
import random
import shutil
import subprocess
import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_DATA_DIR = _REPO_ROOT / "data" / "nextjs"


# --- 15 archetype seeds across the easy / medium-simple / medium difficulty mix ---
ARCHETYPES = [
    # Easy
    ("counter-variant", "easy", "A counter component with separate '+' and '-' buttons; cannot go below 0."),
    ("toggle-block", "easy", "A 'Show/Hide' button that toggles whether a child block of text is visible."),
    ("theme-switch", "easy", "A switch that toggles 'data-theme' between 'light' and 'dark' on the root div."),
    ("list-from-props", "easy", "Render a list of items received as a `items: string[]` prop; show 'No items' when empty."),
    ("char-count", "easy", "Controlled <input>; show the current character count below it; cap at 100 with a warning."),
    ("star-rating", "easy", "Render N filled stars (out of 5) based on a `rating: number` prop, with `data-testid='star-N'` per star."),
    ("disabled-submit", "easy", "Disable submit button when input is empty/whitespace; enable when there's text."),
    ("price-format", "easy", "Format a `price: number` cents prop as '$X.XX' inside `data-testid='price'`."),
    # Medium-simple
    ("search-filter", "medium-simple", "Filter a fixed list of items by a controlled search input (case-insensitive substring match)."),
    ("accordion-panels", "medium-simple", "Render an array of {title, body}; clicking a title toggles its panel open/closed independently."),
    ("pagination", "medium-simple", "Paginate a fixed array of items, 5 per page, with Prev/Next buttons that respect bounds."),
    ("sortable-list", "medium-simple", "List of names with a button that toggles between alphabetical and reverse-alphabetical order."),
    ("modal-open-close", "medium-simple", "A button opens a modal (data-testid='modal'); modal has a Close button. Modal is absent from DOM when closed."),
    # Medium
    ("shopping-cart", "medium", "List of products with 'Add' buttons; a cart panel shows items with quantities and a total. Removing an item decrements its quantity."),
    ("two-step-form", "medium", "A 2-step form: step 1 captures name, step 2 captures email; a Back button goes to step 1 preserving the name. Submit only enabled on step 2 with non-empty email."),
]


# A one-shot example from our hand-authored seed set (counter-button) gives Claude the
# exact conventions to follow: 'use client', data-testids, default exports, etc.
_FEW_SHOT_EXAMPLE = {
    "task_id": "counter-button",
    "description": (
        "# Counter button\n\n"
        "Implement a client component `Counter` in `components/Counter.tsx` that:\n\n"
        "- Renders a `<button>` labeled \"Increment\".\n"
        "- Displays the current count in an element with `data-testid=\"count\"`.\n"
        "- Starts at 0; clicking the button increases the count by 1 each click.\n\n"
        "Export the component as the default export."
    ),
    "difficulty": "easy",
    "entry_point": "components/Counter.tsx",
    "starter_files": {
        "components/Counter.tsx": (
            "'use client'\nimport { useState } from 'react'\n\n"
            "export default function Counter() {\n"
            "  // TODO\n"
            "  return (\n    <div>\n"
            "      <span data-testid=\"count\">0</span>\n"
            "      <button>Increment</button>\n"
            "    </div>\n  )\n}\n"
        )
    },
    "test_files": {
        "Counter.test.tsx": (
            "import { describe, it, expect } from 'vitest'\n"
            "import { render, screen } from '@testing-library/react'\n"
            "import userEvent from '@testing-library/user-event'\n"
            "import Counter from '../components/Counter'\n\n"
            "describe('Counter', () => {\n"
            "  it('starts at 0', () => {\n"
            "    render(<Counter />)\n"
            "    expect(screen.getByTestId('count')).toHaveTextContent('0')\n"
            "  })\n\n"
            "  it('increments on click', async () => {\n"
            "    const user = userEvent.setup()\n"
            "    render(<Counter />)\n"
            "    await user.click(screen.getByRole('button', { name: /increment/i }))\n"
            "    expect(screen.getByTestId('count')).toHaveTextContent('1')\n"
            "  })\n"
            "})\n"
        )
    },
    "reference_files": {
        "components/Counter.tsx": (
            "'use client'\nimport { useState } from 'react'\n\n"
            "export default function Counter() {\n"
            "  const [count, setCount] = useState(0)\n"
            "  return (\n    <div>\n"
            "      <span data-testid=\"count\">{count}</span>\n"
            "      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n"
            "    </div>\n  )\n}\n"
        )
    },
}


SYSTEM_PROMPT = """\
You generate self-contained Next.js + Vitest coding tasks for an RL training dataset.

Each task has:
  - description.md: clear, exact requirements (testids, button labels, behaviors)
  - starter/<files>: skeleton the agent starts from (component file present but with TODO body)
  - tests/<files>: Vitest tests using @testing-library/react + @testing-library/user-event
  - reference/<files>: working solution (must pass its own tests)

Conventions:
  - Client components use the 'use client' directive.
  - Components are TypeScript .tsx files under components/.
  - Tests import the component from '../components/<Name>'.
  - Use data-testid for elements the tests need to query.
  - Default export the component.
  - Tests must be deterministic — no timing/animation/network calls.

Output ONLY a JSON object — no prose, no markdown fence. Schema:
{
  "task_id": "kebab-case-slug",
  "description": "<full markdown body for description.md>",
  "difficulty": "easy" | "medium-simple" | "medium",
  "entry_point": "components/<Component>.tsx",
  "starter_files": { "<relpath>": "<content>", ... },
  "test_files":    { "<relpath>": "<content>", ... },
  "reference_files": { "<relpath>": "<content>", ... }
}
"""


def _load_env_local() -> None:
    """If ANTHROPIC_API_KEY isn't set, try to load it from repo .env.local."""
    if os.environ.get("ANTHROPIC_API_KEY"):
        return
    env_path = _REPO_ROOT / ".env.local"
    if not env_path.is_file():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _claude_generate(archetype_slug: str, difficulty: str, idea: str, model: str) -> dict | None:
    """Call Claude to expand one archetype into a task JSON. Returns None on failure."""
    try:
        import anthropic
    except ImportError:
        sys.exit("anthropic SDK not installed. Run: pip install -e \".[judge]\"")

    client = anthropic.Anthropic()
    user_msg = (
        f"Generate ONE task variation around this archetype:\n"
        f"  slug hint: {archetype_slug}\n"
        f"  difficulty: {difficulty}\n"
        f"  idea: {idea}\n\n"
        f"Here is a reference example (note the conventions and shape):\n"
        f"```json\n{json.dumps(_FEW_SHOT_EXAMPLE, indent=2)}\n```\n\n"
        f"Now generate a NEW task following the same structure. Vary the specifics — "
        f"don't just rephrase the example. The task_id must be a unique kebab-case slug "
        f"(do not reuse 'counter-button'). Return ONLY the JSON object."
    )
    try:
        resp = client.messages.create(
            model=model,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        text = resp.content[0].text.strip()
        # Be lenient about a leading/trailing code fence.
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3]
        return json.loads(text)
    except Exception as e:
        print(f"  [{archetype_slug}] generation failed: {type(e).__name__}: {str(e)[:160]}")
        return None


def _validate(task: dict) -> tuple[bool, str]:
    """Assemble reference + tests + shared config in /tmp/_acrl_run and run vitest from
    that workdir (matches validate.sh exactly). Returns (passed, msg)."""
    work = Path("/tmp/_acrl_run")
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)
    # 1. Reference files (the candidate solution under test).
    for rel, content in (task.get("reference_files") or {}).items():
        p = work / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)
    # 2. Test files under tests/.
    tests_dir = work / "tests"
    tests_dir.mkdir(exist_ok=True)
    for rel, content in (task.get("test_files") or {}).items():
        p = tests_dir / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)
    # 3. Shared config + setup + symlinked node_modules so vitest resolves react etc.
    for f in ("vitest.config.ts", "vitest.setup.ts", "tsconfig.json", "package.json"):
        src = _DATA_DIR / f
        if src.exists():
            shutil.copy(src, work / f)
    nm_src = _DATA_DIR / "node_modules"
    nm_dst = work / "node_modules"
    if nm_src.exists() and not nm_dst.exists():
        os.symlink(nm_src, nm_dst)
    # 4. Run vitest *from* the workdir.
    try:
        proc = subprocess.run(
            ["npx", "vitest", "run", "--silent"],
            cwd=str(work),
            capture_output=True,
            text=True,
            timeout=120,
        )
    except FileNotFoundError:
        return False, "npx not found — install Node + run `npm install` in data/nextjs/"
    except subprocess.TimeoutExpired:
        return False, "vitest timed out"
    if proc.returncode == 0:
        return True, "ok"
    tail = (proc.stderr or proc.stdout or "").strip().splitlines()[-3:]
    return False, " | ".join(tail)


def _write_task(task: dict) -> Path:
    """Write a validated task to data/nextjs/<task_id>/."""
    task_id = task["task_id"]
    out = _DATA_DIR / task_id
    if out.exists():
        # Unique-ify on collision
        suffix = 2
        while (_DATA_DIR / f"{task_id}-{suffix}").exists():
            suffix += 1
        out = _DATA_DIR / f"{task_id}-{suffix}"
        task["task_id"] = out.name
    out.mkdir(parents=True)
    (out / "description.md").write_text(task["description"])
    (out / "meta.json").write_text(
        json.dumps(
            {
                "task_id": f"nextjs/{out.name}",
                "framework": "nextjs",
                "difficulty": task.get("difficulty", "easy"),
                "entry_point": task.get("entry_point", ""),
                "summary": task["description"].splitlines()[0].lstrip("# ").strip(),
            },
            indent=2,
        )
    )
    for sub in ("starter_files", "test_files", "reference_files"):
        sub_dir_name = {"starter_files": "starter", "test_files": "tests", "reference_files": "reference"}[sub]
        for rel, content in (task.get(sub) or {}).items():
            p = out / sub_dir_name / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content)
    return out


def main_nextjs(n_attempts: int, keep_target: int, model: str, dry_run: bool, seed: int):
    rng = random.Random(seed)
    _load_env_local()
    if not dry_run and not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("ANTHROPIC_API_KEY not set (env or .env.local). See module docstring.")
    if not dry_run and not _DATA_DIR.exists():
        sys.exit(f"{_DATA_DIR} doesn't exist; create it first.")

    print(f"target: {n_attempts} attempts, keep up to {keep_target}, model={model}, seed={seed}")
    kept = 0
    rejected = 0
    archetype_pool = list(ARCHETYPES)
    rng.shuffle(archetype_pool)

    for i in range(n_attempts):
        slug, difficulty, idea = archetype_pool[i % len(archetype_pool)]
        print(f"[{i+1}/{n_attempts}] archetype={slug} difficulty={difficulty}")
        if dry_run:
            print("  (dry-run, no API call)")
            continue
        task = _claude_generate(slug, difficulty, idea, model)
        if task is None:
            rejected += 1
            continue
        ok, msg = _validate(task)
        if not ok:
            print(f"  reject: validation failed — {msg}")
            rejected += 1
            continue
        out = _write_task(task)
        kept += 1
        print(f"  KEEP -> {out.name}   ({kept}/{keep_target})")
        if kept >= keep_target:
            break

    print(f"\n=== done: kept {kept} / rejected {rejected} ===")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", choices=["nextjs"], required=True,
                    help="Which dataset to generate into. Currently only 'nextjs' is wired.")
    ap.add_argument("--n", type=int, default=20, help="Max generation attempts")
    ap.add_argument("--keep", type=int, default=10, help="Stop early once N valid tasks kept")
    ap.add_argument("--model", default="claude-sonnet-4-5", help="Anthropic model id")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--dry-run", action="store_true",
                    help="Print archetypes that would be sent, but don't call the API.")
    args = ap.parse_args()
    if args.target == "nextjs":
        main_nextjs(args.n, args.keep, args.model, args.dry_run, args.seed)


if __name__ == "__main__":
    main()
