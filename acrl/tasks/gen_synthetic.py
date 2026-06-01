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


# =========================================================================================
# Scratch / text-to-app generation (v0 / bolt.new / replit / base44 style).
# Pure natural-language prompts, BLANK-CANVAS starter, tolerant role/text tests, plus a
# HELD-OUT hidden suite for generalization. Stricter gates than the component path: reference
# must pass visible AND hidden; the blank starter must pass NOTHING (no reward-hack surface);
# only react/react-dom/relative/testing-lib imports allowed.
# =========================================================================================
from acrl.sandbox.nextjs_runner import run_nextjs_task  # noqa: E402
import re as _re  # noqa: E402
import tempfile as _tempfile  # noqa: E402

_SCRATCH_BLANK_STARTER = (
    "'use client'\n\n"
    "// Build the app described in description.md. The root component must be the default export.\n"
    "export default function App() {\n  return <div />\n}\n"
)
_ALLOWED_IMPORT = _re.compile(r"^(react$|react-dom|react/|@testing-library/|vitest$|\.|/)")

# Product-realistic "Build an app that..." ideas. All buildable with react+react-dom only, no
# timers/animation/network, deterministic. Diverse domains so batches stay varied.
SCRATCH_ARCHETYPES = [
    ("url-shortener", "Shorten URLs: validate the input, list shortened entries with a copy action and a per-link click count."),
    ("invoice-builder", "Build an invoice: add/remove line items (description, qty, unit price), with live subtotal, tax, and total."),
    ("flashcards", "Study a flashcard deck: flip a card, mark it known/unknown, track progress, and restart."),
    ("file-tree", "Render an expandable folder/file tree from nested data; expand/collapse folders and show the selected path."),
    ("chat-ui", "A chat UI: type and send messages into a thread, enforce a character limit, and clear the thread."),
    ("playlist", "A music playlist: add songs, reorder them up/down, mark a now-playing track, and show total duration."),
    ("image-gallery", "A thumbnail gallery: click a thumb to open a lightbox with next/prev and close, showing 'n of N'."),
    ("todo-filters", "A todo list with add, complete toggle, all/active/completed filters, an items-left count, and clear-completed."),
    ("tip-splitter", "A bill splitter: enter the bill, a tip percent, and number of people; show tip, total, and per-person amount."),
    ("contact-manager", "A contact manager: add contacts, search by name, edit and delete, with an alphabetized list and a count."),
    ("inventory", "An inventory tracker: items with stock; increment/decrement stock, flag low-stock below a threshold, show total value."),
    ("helpdesk", "A support queue: create tickets, move status open -> in progress -> closed, filter by status, show per-status counts."),
    ("leaderboard", "A leaderboard: add players with scores, award points, rank descending, and highlight the leader."),
    ("calculator", "A calculator: digits and + - * / with chained operations, a clear, and a running display."),
    ("pricing-configurator", "A pricing configurator: a base plan plus toggleable add-ons, live total, and a monthly/annual switch with a discount."),
    ("gradebook", "A gradebook: students with numeric grades; show class average, each student's letter grade, and highest/lowest."),
    ("menu-order", "A restaurant order: a menu, add items with quantities, remove them, an order total, and a place-order confirmation."),
    ("seat-booking", "A seat map grid: select/deselect available seats, block already-booked ones, show selected count and price."),
    ("event-rsvp", "An event RSVP: a guest list with yes/no/maybe, per-status counts, and a capacity-exceeded warning."),
    ("workout-log", "A workout log: add exercises with sets x reps x weight, per-exercise volume, and total session volume."),
    ("recipe-scaler", "A recipe with ingredient quantities; scale by a servings factor and show recomputed amounts."),
    ("password-strength", "A password field with a live rules checklist (length, number, symbol, case) and a weak/medium/strong label."),
    ("savings-goal", "A savings goal: a target, add contributions, show progress percent, amount remaining, and whether the goal is met."),
    ("unit-converter", "A unit converter (e.g. length or temperature) that converts a value live and updates when the units change."),
    ("bracket", "A single-elimination bracket: seed players, pick winners to advance each round, and crown a champion."),
    ("color-palette", "A palette tool: pick a base color, generate tints/shades, copy a hex, and save palettes to a list."),
    ("expense-approvals", "An expense approval queue: submit expenses, approve/reject each, filter by status, and show approved total."),
    ("reading-list", "A reading list: add books with a want/reading/finished status, filter by status, and show counts and a finished percent."),
]

SCRATCH_SYSTEM_PROMPT = """\
You generate self-contained, from-scratch "text-to-app" coding tasks for an RL dataset — the
kind of request a user types into v0 / bolt.new / replit / base44.

Each task:
  - description.md: a NATURAL-LANGUAGE product request ("Build an application that ..."). It
    MUST name the concrete visible labels, button text, headings/column names, and the EXACT
    format of any numbers/totals shown (e.g. `Total: $35.15`, `Page 1 of 3`), because the tests
    key off those visible strings. Do NOT list data-testids and do NOT dictate the file tree.
    Seed any fixed data the tests depend on directly in the prompt.
  - The root component is the default export of app/page.tsx. Use ONLY react + react-dom — no
    next/* imports, no third-party libraries. In-memory state only; NO network/timers/animation.
  - reference/ (app/page.tsx plus any components/hooks/lib it wants): a correct working app that
    passes every test.
  - tests/: a Vitest suite querying by ROLE / LABEL / VISIBLE TEXT only (getByRole,
    getByLabelText, getByText, within) — NEVER data-testid. `import App from '../app/page'`.
    15-25 independent it() blocks. Deterministic.
  - hidden_test_files: a SEPARATE held-out suite (same tolerant style, FRESH scenarios — other
    inputs, edge cases, sequences) used only to measure generalization. It must also pass against
    the reference, and must be different enough that hardcoding the visible strings would fail it.

Hard constraints (these break tests if ignored):
  - tsconfig lib is ES2022+DOM (no DOM.Iterable): no for..of over Map/Set — use .forEach /
    Array.from / index loops.
  - Compose any displayed composite string as ONE text node via a template literal so getByText
    matches (not `Total: {a} of {b}` which splits into several nodes).
  - getByLabelText also matches a section's aria-label: give inputs distinct accessible names and
    don't let a region's aria-label equal an input's label.
  - Do NOT put the two-word sequence  from "..."  (the word from immediately before a quote)
    inside any test title or string — a naive import scanner flags it as a forbidden import.

Output ONLY a JSON object — no prose, no code fence. Schema:
{ "task_id": "scratch-<kebab>", "description": "<markdown>", "difficulty": "hard",
  "entry_point": "app/page.tsx", "reference_files": {"app/page.tsx": "...", ...},
  "test_files": {"<name>.test.tsx": "..."}, "hidden_test_files": {"<name>_hidden.test.tsx": "..."} }
"""


def _scratch_few_shot() -> str:
    """Build the few-shot from the validated scratch-kanban task on disk (stays authoritative)."""
    base = _DATA_DIR / "scratch-kanban"
    rd = lambda p: (base / p).read_text()
    example = {
        "task_id": "scratch-kanban",
        "description": rd("description.md"),
        "difficulty": "hard",
        "entry_point": "app/page.tsx",
        "reference_files": {"app/page.tsx": rd("reference/app/page.tsx")},
        "test_files": {"kanban.test.tsx": rd("tests/kanban.test.tsx")},
        "hidden_test_files": {"kanban_hidden.test.tsx": rd("tests_hidden/kanban_hidden.test.tsx")},
    }
    return json.dumps(example, indent=2)


def _claude_generate_scratch(slug: str, idea: str, model: str) -> dict | None:
    try:
        import anthropic
    except ImportError:
        sys.exit("anthropic SDK not installed. Run: pip install -e \".[judge]\"")
    client = anthropic.Anthropic()
    user_msg = (
        f"Generate ONE from-scratch text-to-app task around this product idea:\n"
        f"  slug hint: scratch-{slug}\n  idea: {idea}\n\n"
        f"Follow this VALIDATED example exactly in shape and test style:\n"
        f"```json\n{_scratch_few_shot()}\n```\n\n"
        f"Generate a NEW task (not kanban). The description must name the visible labels/totals "
        f"the tests rely on. Return ONLY the JSON object."
    )
    try:
        resp = client.messages.create(
            model=model, max_tokens=8192, system=SCRATCH_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        text = resp.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3]
        return json.loads(text)
    except Exception as e:
        print(f"  [{slug}] generation failed: {type(e).__name__}: {str(e)[:160]}")
        return None


def _forbidden_imports(files: dict) -> list:
    bad = set()
    for content in files.values():
        for m in _re.findall(r"from ['\"]([^'\"]+)['\"]", content):
            if not _ALLOWED_IMPORT.match(m):
                bad.add(m)
    return sorted(bad)


def _validate_scratch(task: dict) -> tuple[bool, str]:
    """Assemble the task in a tmp dir and gate it: reference passes visible AND hidden, blank
    starter passes NOTHING, no forbidden imports."""
    if not (task.get("test_files") and task.get("hidden_test_files") and task.get("reference_files")):
        return False, "missing reference / visible tests / hidden tests"
    allf = {**task["reference_files"], **task["test_files"], **task["hidden_test_files"]}
    bad = _forbidden_imports(allf)
    if bad:
        return False, f"forbidden imports {bad[:4]}"
    with _tempfile.TemporaryDirectory(prefix="acrl_scratch_") as d:
        root = Path(d)
        for sub, dirn in (("reference_files", "reference"), ("test_files", "tests"),
                          ("hidden_test_files", "tests_hidden")):
            for rel, c in task[sub].items():
                p = root / dirn / rel
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(c)
        (root / "starter" / "app").mkdir(parents=True, exist_ok=True)
        (root / "starter" / "app" / "page.tsx").write_text(_SCRATCH_BLANK_STARTER)

        ref = run_nextjs_task(root / "reference", task_dir=root)
        if not ref.all_passed:
            return False, f"reference fails visible {ref.passed}/{ref.total}"
        refh = run_nextjs_task(root / "reference", task_dir=root, extra_tests_dir=root / "tests_hidden")
        if not refh.all_passed:
            return False, f"reference fails hidden {refh.passed}/{refh.total}"
        st = run_nextjs_task(root / "starter", task_dir=root)
        if st.all_passed:
            return False, "blank starter passes all (trivial)"
        if st.passed > 0:
            return False, f"blank starter passes {st.passed} visible tests (hackable)"
    return True, "ok"


def _write_scratch_task(task: dict, split: str) -> Path:
    tid = task["task_id"]
    if not tid.startswith("scratch-"):
        tid = "scratch-" + tid
    out = _DATA_DIR / tid
    if out.exists():
        s = 2
        while (_DATA_DIR / f"{tid}-{s}").exists():
            s += 1
        out = _DATA_DIR / f"{tid}-{s}"
        tid = out.name
    out.mkdir(parents=True)
    (out / "description.md").write_text(task["description"])
    (out / "meta.json").write_text(json.dumps({
        "task_id": f"nextjs/{tid}", "framework": "nextjs", "difficulty": task.get("difficulty", "hard"),
        "entry_point": "app/page.tsx",
        "summary": task["description"].splitlines()[0].lstrip("# ").strip(),
        "split": split, "from_scratch": True,
    }, indent=2))
    (out / "starter" / "app").mkdir(parents=True)
    (out / "starter" / "app" / "page.tsx").write_text(_SCRATCH_BLANK_STARTER)
    for sub, dirn in (("reference_files", "reference"), ("test_files", "tests"),
                      ("hidden_test_files", "tests_hidden")):
        for rel, c in (task.get(sub) or {}).items():
            p = out / dirn / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(c)
    return out


def main_scratch(n_attempts: int, keep_target: int, model: str, dry_run: bool, seed: int):
    rng = random.Random(seed)
    _load_env_local()
    if not dry_run and not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("ANTHROPIC_API_KEY not set (env or .env.local).")
    pool = list(SCRATCH_ARCHETYPES)
    rng.shuffle(pool)
    print(f"scratch: {n_attempts} attempts, keep up to {keep_target}, model={model}, seed={seed}")
    kept = rejected = 0
    for i in range(n_attempts):
        slug, idea = pool[i % len(pool)]
        print(f"[{i+1}/{n_attempts}] scratch archetype={slug}")
        if dry_run:
            print("  (dry-run, no API call)")
            continue
        task = _claude_generate_scratch(slug, idea, model)
        if task is None:
            rejected += 1
            continue
        ok, msg = _validate_scratch(task)
        if not ok:
            print(f"  reject: {msg}")
            rejected += 1
            continue
        # Mixed split: hold out every 5th kept task for eval.
        split = "test" if (kept % 5 == 4) else "train"
        out = _write_scratch_task(task, split)
        kept += 1
        print(f"  KEEP -> {out.name} [{split}]   ({kept}/{keep_target})")
        if kept >= keep_target:
            break
    print(f"\n=== scratch done: kept {kept} / rejected {rejected} ===")
    print("verify: python data/nextjs/probe_hackable.py 'scratch-*' && python data/nextjs/validate_rl.py 'scratch-*'")


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
    ap.add_argument("--style", choices=["component", "scratch"], default="component",
                    help="'component' = scaffolded testid tasks (legacy); 'scratch' = from-scratch "
                         "text-to-app tasks (blank canvas, tolerant tests, hidden suite).")
    ap.add_argument("--n", type=int, default=20, help="Max generation attempts")
    ap.add_argument("--keep", type=int, default=10, help="Stop early once N valid tasks kept (use 25 for a batch)")
    ap.add_argument("--model", default="claude-sonnet-4-5", help="Anthropic model id")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--dry-run", action="store_true",
                    help="Print archetypes that would be sent, but don't call the API.")
    args = ap.parse_args()
    if args.target == "nextjs":
        if args.style == "scratch":
            main_scratch(args.n, args.keep, args.model, args.dry_run, args.seed)
        else:
            main_nextjs(args.n, args.keep, args.model, args.dry_run, args.seed)


if __name__ == "__main__":
    main()
