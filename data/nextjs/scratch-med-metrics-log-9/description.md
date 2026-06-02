# Build a Metrics Log app

Build a complete single-page React application — a lightweight internal metrics tracker — with **three views** the user navigates between using a top navigation bar: **Log**, **Dashboard**, and **Settings**. The app starts on the Log view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Log**, **Dashboard**, **Settings**) switches the active view.

**Log** — a list of all recorded metric entries.
- An input labeled **Metric name** and an input labeled **Value** plus an **Add entry** button adds a new entry (ignore if either field is blank; Value must be a valid number).
- Entries are displayed in a list, newest first (insertion order reversed). Each entry shows its metric name and numeric value.
- For each metric name, only the **latest** entry (by insertion order) is marked with a trend indicator: if the current latest value is strictly greater than the previous entry for that metric, show `▲`; if strictly less, show `▼`; if equal or it is the first entry for that metric, show `—`.
- The trend indicator is shown as part of each latest-entry row in the format `▲`, `▼`, or `—` as plain text.
- A **Clear all** button removes all entries.

**Dashboard** — a read-only summary derived from the log.
- Shows `Total entries: N` where N is the total number of entries logged.
- Shows `Unique metrics: N` where N is the count of distinct metric names.
- For each unique metric name (in alphabetical order), shows a line: `<name>: <latestValue>` where latestValue is the most recent value entered for that metric (as a plain number, no trailing zeros beyond what the user typed — just use the stored numeric value rendered with toString()).
- When there are no entries, shows `No metrics logged yet.`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A checkbox labeled **Show trend indicators** that toggles whether the trend indicators (▲ / ▼ / —) are visible on the Log view. When unchecked, no trend indicators appear. Defaults to checked.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
