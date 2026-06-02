# Build an A/B Experiment Log app

Build a complete single-page React application — an internal tool for tracking A/B tests — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the Experiments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list of A/B tests.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status **running** and no winner.
- Each experiment row shows its name, its status (**running** or **done**), and — when status is **done** — its winner (either **A** or **B**).
- Each running experiment has a **Mark done** button. Clicking it reveals two buttons in that row: **Winner: A** and **Winner: B**. Clicking one sets the experiment's status to **done** and records the winner, collapsing the picker.
- A filter control labeled **Show** with three options: **All**, **Running**, **Done** (default **All**). Selecting **Running** hides finished experiments; selecting **Done** hides running ones.
- The view heading shows a live count: `Experiments (N)` where N is the number of experiments currently visible (matching the active filter).

**Stats** — a read-only summary derived from all experiments (ignoring the filter):
- `Total: N` — total number of experiments.
- `Running: N` — experiments still running.
- `Finished: N` — experiments with status done.
- `Win rate A: P%` — among finished experiments, percentage whose winner is A (whole-number percent, 0% when none finished).
- `Win rate B: P%` — among finished experiments, percentage whose winner is B (whole-number percent, 0% when none finished).

**Settings**
- A **Toggle theme** button that switches between **light** and **dark** theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with **no experiments** initially. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
