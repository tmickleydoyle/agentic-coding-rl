# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — the main entry view.
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button records a new metric reading (ignore blank name or blank value; value must be a number).
- All entries are shown in a table with columns **Metric**, **Value**, and **#** (the entry number in insertion order, starting at 1).
- Each row also shows a trend indicator: for the latest entry of each metric, compare it to the immediately previous entry of the same metric. Show **↑** if the value went up, **↓** if it went down, and **–** if it is unchanged. For entries that are not the most recent for their metric, show nothing in the trend column. The table heading for that column is **Trend**.
- A **Clear all** button removes every entry.

**Dashboard** — a read-only summary computed from the log entries.
- Shows a heading **Dashboard**.
- Lists each distinct metric name that has been logged at least once. For each metric show a line in the format `MetricName: N entries, latest N` where the first N is the count of entries for that metric and the second N is the most recently entered value for that metric.
- Shows a line `Total entries: N` at the bottom.
- When there are no entries at all, shows the text `No data yet`.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists across view changes.
- A **Show trend column** checkbox; when unchecked, the Trend column (heading and cells) is hidden on the Log view. The checkbox is labeled **Show trend column**.

Seed no initial data — the log starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).