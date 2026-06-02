# Build an A/B Experiment Log app

Build a complete single-page React application — an internal tool for tracking A/B tests — with **three views** navigated via a top nav bar: **Experiments**, **Stats**, and **Settings**. The app starts on the **Experiments** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list view.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status **running** and no winner.
- Each experiment row shows its name, its status (**running** or **done**), and — if status is **done** — its winner (either **A** or **B**).
- Each running experiment has a **Mark done** button that reveals two buttons: **Winner: A** and **Winner: B**. Clicking one of them sets the experiment's status to **done** and records the winner (A or B).
- A filter control with label **Filter** offers options **All**, **Running**, and **Done**. When set to **Running**, only running experiments are listed. When set to **Done**, only done experiments are listed. **All** shows everything. The filter defaults to **All**.
- The section heading shows the filtered count like `Experiments (3)`.

**Stats** — a read-only summary computed from all experiments (ignoring the filter):
- `Total: N` — total number of experiments.
- `Running: N` — number with status running.
- `Done: N` — number with status done.
- `Win rate: P%` — percentage of done experiments where a winner was declared, out of all experiments (done ÷ total, as a whole-number percent, 0% when there are none).
- `A wins: N` — number of done experiments whose winner is A.
- `B wins: N` — number of done experiments whose winner is B.

**Settings**
- A **Toggle theme** button that switches between **light** and **dark** theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
