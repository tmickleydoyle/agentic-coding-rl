# Build a sales CRM app

Build a complete single-page React application — a small sales CRM — with **four views** reached
from a top navigation bar: **Contacts**, **Pipeline**, **Reports**, and **Settings**. The app
starts on Contacts. State is shared across all views and kept in memory.

Navigation: a nav bar with a button for each view (**Contacts**, **Pipeline**, **Reports**,
**Settings**).

**Contacts** — manage deals.
- A form with inputs labeled **Name**, **Company**, and **Amount** (a number), plus an **Add
  contact** button. Adding creates a new deal in the **Lead** stage (ignore a blank name). New
  amounts default to 0 if blank.
- A list shows each contact as `Name — Company ($Amount)`.

**Pipeline** — a board with three stage columns in order: **Lead**, **Qualified**, **Won**.
- Each deal appears as a card showing the contact's name in its current stage column.
- Each card has an **Advance …** control (moves to the next stage) and a **Regress …** control
  (moves to the previous stage); Advance is disabled at Won, Regress is disabled at Lead.
- Each column heading shows its name and a live count, like `Lead (2)`.

**Reports** — read-only summary lines:
`Total contacts: N`, `Lead: N`, `Qualified: N`, `Won: N`, `Win rate: P%` (won ÷ total as a
whole-number percent, 0% when there are no contacts), `Pipeline value: $X` (sum of all amounts),
and `Won value: $Y` (sum of amounts in the Won stage).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show won** checkbox; when unchecked, cards in the Won column are hidden on the Pipeline
  (they still count in Reports).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
