# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — a list of metric entries.
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button records a new metric entry (ignore if either field is blank; value must be a valid number).
- Each submitted entry is stored with its metric name, numeric value, and entry order (1-based integer, assigned in submission order across all entries).
- The list shows ALL entries ever submitted, newest first, each as a row displaying: the metric name, the value, the entry order as `#N`, and a trend indicator.
  - The trend indicator compares this entry's value to the immediately preceding entry **for the same metric name** (by entry order). If there is no previous entry for that metric, show `—`. If this value is strictly greater than the previous, show `↑`. If strictly less, show `↓`. If equal, show `→`.
- A **Clear all** button removes every entry.

**Dashboard** — a read-only summary derived from the log entries.
- Shows `Total entries: N`.
- Shows `Unique metrics: N` (count of distinct metric names across all entries).
- For each unique metric name (in the order the metric was first logged), shows one summary line: the metric name, its **latest value** (the value of the highest entry-order entry for that metric), and the trend of that latest entry vs the one before it (`—`, `↑`, `↓`, or `→`) in the format `MetricName: latest=V trend=T`.
- When there are no entries, shows `No entries yet`.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Show all entries** checkbox (checked by default); when unchecked, the Log view shows only the **latest entry per metric** (the entry with the highest entry-order for each metric name). The Dashboard is not affected.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
