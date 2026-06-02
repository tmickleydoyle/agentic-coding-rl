# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — a list of metric entries.
- An input labeled **Metric name** and an input labeled **Metric value** (numeric) plus an **Add entry** button add a new metric entry (ignore the submission if either field is blank or if the value is not a valid number).
- Each entry is shown as a row with its metric name, its value, and a **trend indicator**: the very first entry for a given metric name shows `—`; subsequent entries show `▲` if the new value is strictly greater than the previous entry for that same metric, or `▼` if strictly less, or `—` if equal.
- Entries are displayed in the order they were added (oldest first).
- Each row has a **Delete** button that removes that entry.
- Below the entry list show a count: `Entries: N` where N is the total number of entries currently shown.

**Dashboard** — a read-only summary computed from the Log entries.
- Shows the heading **Dashboard**.
- For each unique metric name, show one summary row with: the metric name, the **latest value** (the value of the most-recently added entry for that metric), and the **trend** compared to the prior entry for that metric (`▲`, `▼`, or `—` using the same rules as above; `—` when there is only one entry for that metric).
- Show a line: `Tracked metrics: N` where N is the count of unique metric names.
- Show a line: `Total entries: N` where N is the total number of entries across all metrics.
- If there are no entries at all, show the message `No metrics logged yet`.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists as the user navigates between views.
- A **Clear all entries** button removes every entry in the log (resets to zero entries). After clearing, the Dashboard should show `No metrics logged yet`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
