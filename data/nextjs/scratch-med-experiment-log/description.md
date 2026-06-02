# Build an A/B Experiment Log app

Build a complete single-page React application — an internal tool for tracking A/B tests — with **three views** the user navigates between using a top navigation bar: **Experiments**, **Stats**, and **Settings**. The app starts on the **Experiments** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Experiments**, **Stats**, **Settings**) switches the active view.

**Experiments** — the main list of A/B tests.
- An input labeled **Experiment name** plus an **Add experiment** button adds a new experiment (ignore a blank name). New experiments start with status **running** and no winner.
- Each experiment row shows its name, its status (**running** or **done**), and — if status is **done** — the winner label (either **A** or **B**).
- Each running experiment has a **Mark done** button. Clicking it reveals two buttons inline: **Winner: A** and **Winner: B**. Clicking either sets the experiment's status to **done** with the chosen winner, and hides the inline picker.
- A filter control — a set of buttons labeled **All**, **Running**, **Done** — filters the list. The active filter button has `aria-pressed="true"`. Default filter is **All**.
- The heading above the list shows the active filter and count, like `All (3)`, `Running (1)`, or `Done (2)`.

**Stats** — a read-only summary derived from the experiments list:
- `Total experiments: N`
- `Running: N`
- `Done: N`
- `Win rate (A): P%` — among done experiments, how many were won by A, as a whole-number percent (0% when no done experiments).
- `Win rate (B): P%` — same for B.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).