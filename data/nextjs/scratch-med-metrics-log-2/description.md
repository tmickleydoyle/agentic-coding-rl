# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — the main list of metric entries.
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button records a new metric entry (ignore if either field is blank; Value must be a valid number — ignore non-numeric values).
- Each entry is stored with the metric name, numeric value, and the order it was entered (1-based insertion index shown as `#N`).
- The list shows ALL entries (not deduplicated), each displayed as one line: `#N — MetricName: Value` (e.g. `#1 — Revenue: 4200`).
- A **Clear all** button removes every entry.

**Dashboard** — a read-only derived summary.
- Shows the heading **Dashboard**.
- For every **unique metric name** that has been logged (in first-seen order), display a summary block containing:
  - The metric name as a subheading.
  - `Latest: V` where V is the value of the most recently entered entry for that metric (i.e. the one with the highest insertion index).
  - `Entries: N` where N is the total count of entries for that metric.
  - `Trend: up`, `Trend: down`, or `Trend: steady` — comparing the latest entry's value to the previous entry's value for that metric (if there is only one entry, show `Trend: steady`).
- If no entries exist, show the text `No metrics logged yet`.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element and persists across view changes.
- A **Show all entries** checkbox (checked by default); when unchecked, the Log view shows only the **latest entry per metric name** (one row per unique metric, the one with the highest insertion index). The Dashboard is unaffected by this toggle.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
