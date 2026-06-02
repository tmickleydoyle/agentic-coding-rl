# Build an A/B Experiment Log app

Build a complete single-page React application — an internal A/B test tracker — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the Experiments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — a list of A/B tests.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment with status `running` and no winner (ignore a blank name).
- Each experiment row shows its name, its status (`running` or `done`), and — if status is `done` — its winner label (either `A` or `B`).
- Each running experiment has a **Mark done** button. Clicking it reveals two buttons in that row: **Winner: A** and **Winner: B**. Clicking either sets the experiment's status to `done` and records the winner, hiding the choice buttons.
- A **Filter** control (a `<select>` labeled **Filter by status**) with options **All**, **Running**, and **Done** filters the list. The select defaults to **All**.
- The heading above the list reads `Experiments (N)` where N is the count of experiments currently visible after filtering.

**Stats** — a read-only derived summary:
- `Total experiments: N` — total across all experiments regardless of filter.
- `Running: N` — count with status running.
- `Done: N` — count with status done.
- `Win rate (A): P%` — among done experiments, percentage where winner is A (whole-number percent, 0% when no done experiments).
- `Win rate (B): P%` — among done experiments, percentage where winner is B (whole-number, 0% when no done experiments).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with two experiments on first load:
1. Name: `Homepage hero`, status: `done`, winner: `A`
2. Name: `Checkout flow`, status: `running`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
