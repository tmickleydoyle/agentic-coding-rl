# Build an A/B Experiment Log app

Build a complete single-page React application — an internal A/B testing tracker — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the Experiments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list of A/B tests.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status `running` and no winner.
- Each experiment row shows its name, its status (`running` or `done`), and — if the status is `done` — its winner (either `A` or `B`).
- Each running experiment has a **Mark done** button that, when clicked, reveals two buttons in that row: **Winner A** and **Winner B**. Clicking either sets the experiment's status to `done` with the chosen winner, and hides the winner-selection buttons.
- A checkbox labeled **Show running only** filters the list to show only experiments with status `running`; when unchecked all experiments are shown.
- The heading above the list reads `Experiments (N)` where N is the count of currently visible experiments (respecting the filter).

**Stats** — a read-only summary computed from all experiments (ignoring the filter):
- `Total: N` — total number of experiments
- `Running: N` — number with status running
- `Finished: N` — number with status done
- `Winner A: N` — number of done experiments where winner is A
- `Winner B: N` — number of done experiments where winner is B
- `Win rate: P%` — percentage of finished experiments out of total, as a whole-number percent (0% when there are no experiments)

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- The button label reads `Toggle theme (current: light)` or `Toggle theme (current: dark)` depending on the active theme.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed no initial data; the app starts empty.
