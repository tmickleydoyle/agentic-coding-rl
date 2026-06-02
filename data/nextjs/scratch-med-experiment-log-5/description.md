# Build an A/B Experiment Log app

Build a complete single-page React application — an A/B experiment tracking tool — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the Experiments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list of A/B tests.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status **running** and no winner.
- Each experiment row shows its name, its status (**running** or **done**), and — if done — its winner.
- Each running experiment has a **Mark done** button. Clicking it reveals two buttons in that row: **Winner: A** and **Winner: B**. Clicking one of those sets the experiment status to **done** and records the winner (either `A` or `B`), and the two picker buttons disappear.
- A filter control: a **Show** dropdown (labeled **Show**) with options **All**, **Running**, and **Done**. Selecting **Running** hides done experiments; selecting **Done** hides running ones; **All** shows everything. The count in the heading updates to reflect the visible list: `Experiments (N)` where N is the number of experiments currently shown.
- The full list (unfiltered) is used for Stats.

**Stats** — a read-only summary derived from all experiments (ignoring the filter):
- `Total: N` — total number of experiments.
- `Running: N` — how many are currently running.
- `Finished: N` — how many are done.
- `Win rate A: P%` — among finished experiments, the percentage where A won (0% when none are finished), rounded to a whole number.
- `Win rate B: P%` — among finished experiments, the percentage where B won (0% when none are finished), rounded to a whole number.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigations.

Seed the app with **no experiments** (empty list on first load). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
