# Feature quality tracker for our platform

I'm a PM and I need one small app to keep our **features** and the **bugs** filed against them
together, so I can see which features are dragging us down. Build a single-page React app with
**three views** reached from a top navigation bar: **Features**, **Bugs**, and **Quality**. The
app starts on **Features**. Everything is kept in memory and shared across the three views.

Navigation: a nav bar with a button for each view (**Features**, **Bugs**, **Quality**).

**Features** — our shipped/planned features.
- A form with an input labeled **Feature name** and an **Add feature** button. Adding creates a
  feature (ignore a blank name, trimming surrounding whitespace).
- A list shows each feature as `Name` on its own line.

**Bugs** — bugs filed against a feature.
- A **Feature** selector that lists every feature I have added (by name), an input labeled
  **Title**, a **Severity** selector (**low**, **high**), and a **File bug** button. Filing
  creates a bug, open by default, against the chosen feature. Ignore a bug with a blank title, and
  ignore it if no feature is selected. New bugs start **open**.
- A list shows each bug as `Title [Severity] - Status (Feature)` where Status is `open` or
  `closed`. Each open bug has a **Close** button next to it that marks it closed; once closed the
  button is gone.

**Quality** — the join I care about: open bugs per feature.
- For **each feature**, a line `Name: Open open / Total total` where Open is the number of bugs
  on that feature still open and Total is the number of bugs ever filed against it. Features with
  no bugs still show, as `0 open / 0 total`. A feature with at least one **open high-severity** bug
  also shows the words `at risk` on that line.
- A summary line `Open bugs: X` (count of all open bugs across every feature).
- A summary line `Healthiest feature: Name` naming the feature with the fewest open bugs (when
  there is a tie, the one added first wins); show `Healthiest feature: none` when there are no
  features yet.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is just in-app state).
