# Build an A/B Experiment Log app

Build a complete single-page React application — an internal A/B test tracker — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the Experiments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list of A/B tests.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status `running` and no winner.
- Each experiment row shows its name, its status (`running` or `done`), and — if done — its winner label (e.g. `Winner: B`).
- Each running experiment has a **Mark done** button that opens (inline, in the same row) two buttons: **Winner: A** and **Winner: B**. Clicking either marks the experiment as `done` with the chosen winner and closes the inline picker.
- A filter control labeled **Show** with options **All**, **Running**, and **Done** (a `<select>`) filters the displayed list. Changing the filter does NOT remove experiments — it only hides/shows them.
- The heading above the list shows the active filter count, e.g. `Experiments (3)` reflecting how many rows are currently visible.

**Stats** — a read-only summary computed from all experiments (ignoring the filter):
- `Total: N` — total number of experiments.
- `Running: N` — count with status running.
- `Done: N` — count with status done.
- `Winner A: N` — count of done experiments where winner is A.
- `Winner B: N` — count of done experiments where winner is B.
- `Win rate: P%` — percentage of ALL experiments that are done, as a whole-number percent (0% when there are none).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset experiments** button clears all experiments (sets the list back to empty).

Seed the app with **no experiments** on load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
