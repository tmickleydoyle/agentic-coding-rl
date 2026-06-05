# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — a list of metric entries.
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button adds a new entry (ignore blank metric name or blank value; value must be a valid number).
- Each entry is shown in the order it was added (oldest first). Each entry displays the metric name, the numeric value (formatted to 2 decimal places), and its entry number (1-based), like `#1 Weight: 72.50`.
- Each entry has a **Delete** button that removes it.
- The list heading reads **Entries (N)** where N is the total number of entries currently shown.

**Dashboard** — a read-only summary. For each unique metric name (in order of first appearance), show one summary block containing:
- The metric name as a heading.
- `Latest: V` where V is the value of the most recent (highest entry-order) entry for that metric, formatted to 2 decimal places.
- `Trend: up` if the latest value is strictly greater than the previous entry for that metric, `Trend: down` if strictly less, or `Trend: flat` if equal or if there is only one entry for that metric.
- `Count: N` where N is the number of entries for that metric.
- If there are no entries at all, show the text `No metrics logged yet.`

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element and persists across views.
- A **Clear all entries** button that deletes every entry and resets the log to empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO initial entries (empty state).
