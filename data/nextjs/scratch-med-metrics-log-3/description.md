# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — the main list of metric entries.
- An input labeled **Metric name** and an input labeled **Value** (numeric) plus an **Add entry** button records a new entry (ignore if either field is blank or value is not a valid number).
- Each entry is displayed in the order it was added, showing the metric name and numeric value.
- For each metric name, only the **latest** entry for that name shows a trend indicator: **↑** if the latest value is strictly greater than the previous entry for that same metric, **↓** if strictly less, or **→** if equal. Older entries for the same metric name show no trend indicator.
- A **Clear all** button removes every entry.

**Dashboard** — a read-only summary computed from the log entries:
- Shows `Total entries: N`.
- Shows `Unique metrics: N` (count of distinct metric names).
- For each distinct metric name (in the order each name first appeared), show the **latest value** and its trend vs the previous entry for that name. Format each row as `<name>: <value> <trend>` where trend is **↑**, **↓**, or **→** (omit trend entirely — no trailing space — when there is only one entry for that metric, i.e. no previous value to compare).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Reset log** button clears all entries (same effect as Clear all on the Log view). After clicking it the total entries shown on the Dashboard should be zero.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).