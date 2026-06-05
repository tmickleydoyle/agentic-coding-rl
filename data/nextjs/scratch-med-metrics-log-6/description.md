# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — the main list of metric entries.
- An input labeled **Metric name** and an input labeled **Value** (accepts any number) plus an **Add entry** button records a new entry (ignore submissions where either field is blank or the value is not a valid number).
- Entries are stored in the order they were added (oldest first).
- For each **distinct metric name**, show only the **latest** entry as a row in a table. Each row displays the metric name, the latest value, and a **trend indicator**: `▲` if the latest value is strictly greater than the previous entry for that metric, `▼` if strictly less, and `—` if equal or there is no previous entry (i.e. it is the first entry for that metric).
- Each row also has a **Delete** button (labeled `Delete <metric name>`) that removes **all** entries for that metric from the log.
- The table shows a header row with columns **Metric**, **Latest Value**, and **Trend**.
- Below the table, show the text `Metrics tracked: N` where N is the number of distinct metric names currently in the log.

**Dashboard** — a read-only summary derived from the log:
- Show the text `Total entries: N` (total number of individual entries ever added, minus any deleted).
- Show the text `Distinct metrics: N`.
- Show the text `Rising: N` — count of distinct metrics whose latest value is strictly greater than their previous value.
- Show the text `Falling: N` — count of distinct metrics whose latest value is strictly less than their previous value.
- Show the text `Stable: N` — count of distinct metrics with no previous entry or whose latest equals the previous.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all entries** button removes every entry from the log (resets state entirely). After clicking, the counts on both Log and Dashboard reflect zero.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
