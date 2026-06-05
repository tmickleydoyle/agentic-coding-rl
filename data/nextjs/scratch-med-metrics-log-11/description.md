# Build a Metrics Logger app

Build a complete single-page React application — a simple internal metrics tracking tool — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — the main view for entering and reviewing metric readings.
- An input labeled **Metric name** and an input labeled **Metric value** (accepts any number) plus an **Add entry** button adds a new entry (ignore blank name or blank value).
- All entries are shown in a list in the order they were added (oldest first). Each entry shows its metric name, its numeric value, and its entry number (1-based), e.g. `#1 Weight: 72`.
- Each entry shows a **trend indicator** to the right of its value: for the very first entry of a metric, show `—`; for subsequent entries of the same metric, show `▲` if the new value is strictly greater than the previous entry for that metric, or `▼` if strictly less, or `—` if equal.
- A **Clear all** button removes every entry (only shown when there is at least one entry).

**Dashboard** — a read-only summary derived from the log entries.
- Shows `Total entries: N`.
- For each unique metric name (in the order that metric first appeared), shows one row with the **latest value** for that metric and its trend vs the prior entry for that same metric, e.g. `Weight: 72 ▲` or `Steps: 10000 —`. If the metric has only one entry, the trend is `—`.
- Shows `Tracked metrics: N` where N is the number of unique metric names.
- When there are no entries at all, shows the text `No entries yet`.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists across views.
- A **Filter low values** checkbox; when checked, the Log view hides any entries whose numeric value is strictly below **10** (they still count in Dashboard totals).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
