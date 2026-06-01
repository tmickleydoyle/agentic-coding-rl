# Build a habit tracker app

Build a complete single-page React application — a weekly habit tracker — with **four views**
reached from a top navigation bar: **Today**, **Weekly**, **Stats**, and **Settings**. The app
starts on Today. State is shared across all views and kept in memory.

The week has seven days: **Mon, Tue, Wed, Thu, Fri, Sat, Sun** (in that order), where **Sun is
"today"** (the last day).

Navigation: a nav bar with a button for each view (**Today**, **Weekly**, **Stats**, **Settings**).

**Today**
- An input labeled **Habit name** plus an **Add habit** button adds a habit (ignore a blank or
  duplicate name).
- Each habit shows its name with a checkbox labeled `<name> today` that marks it done for today
  (Sun).
- A line shows `Done today: N` — how many habits are marked done today.

**Weekly** — a grid: each habit is a row with a checkbox for every day, labeled `<name> <day>`
(e.g. `Run Mon`), toggling whether that habit was done that day.

**Stats** — per habit, show: `Current streak: N` (consecutive days done counting back from Sun;
0 if Sun is not done), `Longest streak: M` (longest run anywhere in the week), and
`Completion: P%` (days done ÷ 7, whole-number percent). Also show `Total habits: N`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide completed today** checkbox; when checked, the Today view hides habits already marked
  done today.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
