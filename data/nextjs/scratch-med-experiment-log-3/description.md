# Build an A/B Experiment Log app

Build a complete single-page React application — an internal tool for tracking A/B tests — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the Experiments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list view.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status `running` and no winner.
- Each experiment row shows its name, its status (`running` or `done`), and — if status is `done` — its winner label (either `A` or `B`).
- Each running experiment has a **Mark done** button. Clicking it reveals two buttons in that row: **Winner: A** and **Winner: B**. Clicking one sets the experiment's status to `done` with the chosen winner and hides the choice buttons.
- A filter control: a **Show** dropdown (labeled **Show**) with options `All`, `Running`, `Done`. Selecting `Running` hides finished experiments; selecting `Done` hides running ones; `All` shows everything. The heading above the list reads `Experiments (N)` where N is the count of currently visible experiments.
- Each experiment row has a **Delete** button that permanently removes it.

**Stats** — a read-only summary computed from all experiments (ignoring the filter):
- `Total: N` — total number of experiments.
- `Running: N` — how many are currently running.
- `Done: N` — how many are finished.
- `Win rate: P%` — among finished experiments, the percentage that have a winner (always 100% when there are any done experiments, but if there are zero done experiments show `Win rate: 0%`).
- `A wins: N` — count of done experiments where winner is A.
- `B wins: N` — count of done experiments where winner is B.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
