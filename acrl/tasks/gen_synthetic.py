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

# Product-scale app ideas — each is a FULL multi-view application (the kind v0/bolt.new emit),
# NOT a single widget. Every idea names ~4 navigable views with shared state. react+react-dom
# only, in-memory, deterministic (no timers/animation/network).
SCRATCH_ARCHETYPES = [
    ("crm", "A sales CRM with a Contacts list, a Pipeline board (Lead/Qualified/Won), a Reports view (counts + win rate), and Settings."),
    ("habit", "A habit tracker with a Today checklist, a Weekly grid, a Stats view (streaks/completion %), and Settings."),
    ("recipes", "A recipe app with a Browse list, a Meal Planner, a Shopping List derived from planned meals, and Settings."),
    ("finance", "A budgeting app with a Transactions list, a Budgets view (per-category limits + over-budget flags), a Reports view, and Settings."),
    ("fitness", "A workout app with a Log view, a Routines builder, a Progress view (totals/volume), and Settings."),
    ("notes", "A notes app with a Notes list, an Editor, a Tags view (filter by tag), and Settings."),
    ("issues", "An issue tracker with a Board (Open/In Progress/Closed), a Backlog, a Reports view (per-status counts), and Settings."),
    ("inventory", "An inventory app with a Stock list, a Receiving form, a Low-stock report, and Settings."),
    ("events", "An event planner with an Agenda, a Guest list (RSVP yes/no/maybe), a Stats view (attendance), and Settings."),
    ("courses", "A learning app with a Courses list, a Lesson view, a Progress view (% complete), and Settings."),
    ("support", "A helpdesk with a Tickets queue, a New Ticket form, a Dashboard (per-status counts), and Settings."),
    ("travel", "A trip planner with an Itinerary, a Packing list, a Budget view, and Settings."),
    ("store", "A storefront with a Catalog, a Cart, a Checkout summary (subtotal/tax/total), and Settings."),
    ("jobs", "A job-application tracker with a Listings view, an Applications board (Applied/Interview/Offer), a Stats view, and Settings."),
    ("library", "A reading app with a Library list, a Currently-Reading shelf, a Stats view (finished count/percent), and Settings."),
    ("expense", "An expense-report app with an Expenses list, a New Expense form, an Approvals view (approve/reject), and a Totals dashboard."),
    ("garden", "A garden planner with a Beds list, a Plant catalog, a Care schedule view, and Settings."),
    ("music", "A music app with a Library, Playlists (add/remove tracks), a Now-Playing queue, and Settings."),
    ("polls", "A polling app with a Create view, an Active-polls list (vote once), a Results dashboard (counts/percentages), and Settings."),
    ("realestate", "A listings app with a Listings grid, a Saved/Favorites view, a Compare view, and Settings."),
]

SCRATCH_SYSTEM_PROMPT = """\
You generate self-contained, from-scratch "text-to-app" coding tasks for an RL dataset — the
kind of FULL APPLICATION a user gets from v0 / bolt.new / replit / base44. NOT a single widget:
each task is a complete multi-view app.

Scope (REQUIRED — match the worked example's shape):
  - 4 navigable views switched by an in-app nav bar (NOT the Next.js router). State is SHARED
    across views via a React Context provider + a use<App> hook; navigating away and back
    preserves state. At least one view is a derived/stats/dashboard view computed from the others,
    and at least one interaction in one view changes data shown in another (cross-view state).
  - MULTI-FILE reference: split into app/page.tsx (default export App = the Context provider
    wrapping an inner Shell that reads context and renders nav + the active view), plus
    components/, hooks/, and lib/ files. app/page.tsx is the entry the tests import.
  - Use ONLY react + react-dom — NO next/* imports, NO third-party libraries. In-memory state
    only; NO network/timers/animation. Routing is in-app state.

description.md: a NATURAL-LANGUAGE product request ("Build a ... app with these views: ..."). It
  MUST name the views, the visible labels/buttons/headings, and the EXACT format of any
  numbers/totals shown (e.g. `Completion: 50%`, `To Do (2)`, `Total: $35.15`), because the tests
  key off those visible strings. Do NOT list data-testids and do NOT dictate the file tree. Seed
  any fixed data the tests need directly in the prompt.

tests/: a Vitest suite querying by ROLE / LABEL / VISIBLE TEXT only (getByRole, getByLabelText,
  getByText, within) — NEVER data-testid. `import App from '../app/page'`. 20-35 independent it()
  blocks covering: navigation to every view, each view's core flow, AT LEAST ONE cross-view
  shared-state interaction, and the derived/stats view. Deterministic.

hidden_test_files: a SEPARATE held-out suite (same tolerant style, FRESH scenarios — other
  inputs, edge cases, sequences, cross-view paths) used only to measure generalization. It must
  also pass against the reference and be different enough that hardcoding visible strings fails it.

Hard constraints (these break tests if ignored):
  - tsconfig lib is ES2022+DOM (no DOM.Iterable): no for..of over Map/Set — use .forEach /
    Array.from / index loops.
  - Compose any displayed composite string as ONE text node via a template literal so getByText
    matches (not `Total: {a} of {b}` which splits into several nodes).
  - getByLabelText also matches a section's aria-label: give inputs distinct accessible names and
    don't let a region's aria-label equal an input's label or a nav button's name.
  - The root App renders the provider, so it canNOT call use<App>() itself — put an inner Shell
    inside the provider that consumes context. The provider must supply a non-null value so the
    app mounts and tests fail on assertions, not a crash.
  - Do NOT put the two-word sequence  from "..."  (the word from immediately before a quote)
    inside any test title or string — a naive import scanner flags it as a forbidden import.

Output ONLY a JSON object — no prose, no code fence. Schema:
{ "task_id": "scratch-app-<kebab>", "description": "<markdown>", "difficulty": "hard",
  "entry_point": "app/page.tsx",
  "reference_files": {"app/page.tsx": "...", "components/...": "...", "hooks/...": "...", "lib/...": "..."},
  "test_files": {"<name>.test.tsx": "..."}, "hidden_test_files": {"<name>_hidden.test.tsx": "..."} }
"""


def _scratch_few_shot() -> str:
    """Build the few-shot from the validated FULL-APP exemplar on disk (multi-file, multi-view —
    teaches the model to emit a complete application, not a single widget)."""
    base = _DATA_DIR / "scratch-app-projecthub"

    def collect(sub: str) -> dict:
        d = base / sub
        out = {}
        for p in sorted(d.rglob("*")):
            if p.is_file():
                out[p.relative_to(d).as_posix()] = p.read_text()
        return out

    example = {
        "task_id": "scratch-app-projecthub",
        "description": (base / "description.md").read_text(),
        "difficulty": "hard",
        "entry_point": "app/page.tsx",
        "reference_files": collect("reference"),     # multi-file: app/, components/, hooks/, lib/
        "test_files": collect("tests"),
        "hidden_test_files": collect("tests_hidden"),
    }
    return json.dumps(example, indent=2)


# Medium tier (GEN_TIER=medium): the CORE-band recipe AND distribution-matched to what real
# users ask a no-code/AI builder for — small-business owners, product managers, designers, and
# solo founders building internal tools. Single-entity, list+filter+derived-stat apps the base
# gets ~30-60% right (not the hard multi-entity/REST-API full apps that calibrate to "dead").
MEDIUM_ARCHETYPES = [
    # --- Small business owner ---
    ("client-roster", "A client list: name + status (active/lead/churned) + lifetime value; filter by status, total value, active count."),
    ("invoice-tracker", "An invoice list: client + amount + paid/unpaid; mark paid, filter unpaid, total outstanding."),
    ("appointment-book", "An appointment list: customer + service + status (booked/done/no-show); filter by status, counts."),
    ("order-tracker", "An order list: customer + status (new/packing/shipped/delivered); advance status, filter, count per status."),
    ("service-pricing", "A service menu: name + price + active toggle; toggle active, count active, average price."),
    ("staff-schedule", "A shift list: employee + hours; add, filter by employee, total hours per employee."),
    ("business-expenses", "A business expense list: vendor + category + amount; filter by category, per-category totals, monthly total."),
    ("stock-levels", "A product list: name + on-hand + reorder point; adjust stock, low-stock flag, total inventory value."),
    ("customer-reviews", "A review list: customer + rating + responded toggle; filter unresponded, average rating."),
    ("quote-tracker", "A quote list: client + amount + status (sent/won/lost); filter, total pending value, win rate."),
    # --- Product manager ---
    ("feature-backlog", "A feature backlog: title + priority (P0/P1/P2) + status (idea/building/shipped); filter, count by priority."),
    ("bug-triage", "A bug list: title + severity + status (open/closed); filter by status, open count by severity."),
    ("roadmap-board", "A roadmap: item + quarter + status (planned/in-progress/shipped); filter by quarter, shipped count."),
    ("feedback-inbox", "A feedback list: note + theme + upvotes; sort by upvotes, count per theme."),
    ("okr-tracker", "An objectives list: objective + progress %; update progress, overall average, on-track (>=70%) count."),
    ("release-checklist", "A launch checklist: task + owner + done toggle; completion %, count remaining by owner."),
    ("experiment-log", "An A/B test list: name + status (running/done) + winner; filter running, win rate of finished."),
    ("user-interviews", "An interview list: participant + segment + key takeaway; filter by segment, count per segment."),
    ("sprint-board", "A task board: task + status (todo/doing/done) + points; counts and total points per status."),
    ("stakeholder-map", "A stakeholder list: name + influence (high/med/low) + supportive toggle; filter, count by influence."),
    # --- Designer (non-technical) ---
    ("design-requests", "A design-request queue: title + status (new/in-progress/done) + priority; filter by status, count per status."),
    ("asset-library", "An asset list: name + type (logo/icon/photo) + tags; filter by type, count per type."),
    ("design-feedback", "A feedback list: note + screen + status (open/addressed); filter open, open count."),
    ("portfolio-projects", "A project list: title + category + status (live/draft); filter, count live."),
    ("deliverables", "A deliverables list: item + status (pending/delivered) + due; filter pending, delivered count / total."),
    ("brand-colors", "A brand-color list: name + hex; add, count, show a swatch and the hex; total colors."),
    ("handoff-checklist", "A dev-handoff checklist: item + done toggle; completion %, remaining count."),
    ("content-review", "A content-review list: item + reviewer + status (draft/approved/changes); filter, approved %."),
    # --- Solo founder ---
    ("lead-pipeline", "A sales-lead list: company + stage (new/demo/won) + deal value; filter by stage, total pipeline value."),
    ("waitlist", "A waitlist: email + status (pending/invited) + source; invite, filter, invited count, count per source."),
    ("content-calendar", "A content list: title + platform + status (draft/scheduled/published); filter, scheduled count."),
    ("subscriber-mrr", "A subscriber list: name + plan + active toggle (plan has a monthly price); total MRR, active count."),
    ("investor-crm", "An investor list: firm + stage (intro/pitched/committed) + check size; filter, total committed."),
    ("metrics-log", "A metrics list: metric name + value + entered order; latest per metric, up/down vs the previous entry."),
    ("founder-tasks", "A task list: task + priority (high/med/low) + done toggle; filter by priority, done %, count by priority."),
]
MEDIUM_ADDENDUM = (
    "\n\nThis must read like a REAL request from a small-business owner, product manager, designer, "
    "or solo founder building a simple internal tool — practical and professional, not a personal "
    "hobby app. Keep it SIMPLER than the example (medium difficulty): exactly 2-3 views (a main list "
    "view, a stats/summary view, optionally a settings view with a theme toggle); exactly ONE main "
    "entity; NO app/api/*/route.ts handlers (in-memory state only); and ONE tractable logic feature "
    "(a filter, sort, count, total/percentage, or status-toggle). 15-25 tests. Aim so a competent "
    "model gets most of it right but can slip an edge case."
)


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
        f"Generate a NEW full multi-view app (not project management / not the example). The "
        f"description must name the views and the visible labels/totals the tests rely on. "
        f"Return ONLY the JSON object."
        + (MEDIUM_ADDENDUM if os.environ.get("GEN_TIER") == "medium" else "")
    )
    try:
        with client.messages.stream(
            model=model, max_tokens=32000, system=SCRATCH_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        ) as stream:
            resp = stream.get_final_message()
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
    prefix = os.environ.get("GEN_PREFIX", "scratch-")
    base = task["task_id"]
    for p in ("scratch-med-", "scratch-app-", "scratch-"):  # strip whatever the model prepended
        if base.startswith(p):
            base = base[len(p):]
            break
    tid = prefix + base
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
    pool = list(MEDIUM_ARCHETYPES if os.environ.get("GEN_TIER") == "medium" else SCRATCH_ARCHETYPES)
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
