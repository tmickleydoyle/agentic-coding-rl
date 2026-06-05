# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — a list of metric entries, one row per entry in the order they were added (oldest first).
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button adds a new entry (ignore blank name or blank value; value must be a valid number).
- Each row shows: the metric name, the numeric value, and a trend indicator. The trend indicator compares the entry to the **immediately preceding entry for the same metric name** (case-sensitive): show `▲` if the value is strictly higher than the previous entry, `▼` if strictly lower, `—` if equal, or nothing (no indicator) if it is the first entry for that metric.
- Each row has a **Delete** button that permanently removes that entry.
- The total number of entries is shown as `Entries: N` above the list.

**Dashboard** — a read-only summary computed from all current entries.
- For each distinct metric name (in the order the metric name first appeared), show one summary row containing: the metric name, the **latest value** (value of the most recently added entry for that metric, i.e. the last entry in log order), and the **count** of entries for that metric shown as `(N entries)`.
- Show the total number of distinct metrics as `Metrics tracked: N`.
- Show the total number of log entries as `Total entries: N`.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Clear all entries** button removes every entry from the log (Dashboard and Log both reflect this immediately).

Seed the app with NO initial entries. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).