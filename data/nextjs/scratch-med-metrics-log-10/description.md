# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — the main data-entry and list view.
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button records a new entry (ignore if either field is blank; value must be a valid number).
- Entries are displayed in a list, each showing the metric name, the numeric value, and the order they were entered (e.g. `#1`, `#2`, `#3`).
- Each entry row shows a trend indicator compared to the immediately previous entry for the **same metric name**: `↑` if the value is higher, `↓` if lower, or `—` if it is the first entry for that metric (or equal to the previous).
- A **Filter by metric** input (labeled **Filter by metric**) filters the visible list to rows whose metric name contains the typed text (case-insensitive). The full unfiltered data is still used for all stats.
- A **Clear all** button removes all entries.

**Dashboard** — a read-only summary derived from the log data.
- Shows `Total entries: N`.
- Shows `Unique metrics: N` (count of distinct metric names).
- For each unique metric name (in the order the metric first appeared), shows one summary line formatted exactly as `<MetricName>: latest <V>, entries <N>` where V is the most recently added value for that metric and N is how many entries exist for that metric.
- When there are no entries, shows `No data yet`.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is reflected as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Decimal places** selector (a `<select>` labeled **Decimal places**) with options `0`, `1`, `2` controls how many decimal places numeric values are displayed with throughout the app (Log list and Dashboard latest values). Default is `2`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed no initial data; the app starts empty.