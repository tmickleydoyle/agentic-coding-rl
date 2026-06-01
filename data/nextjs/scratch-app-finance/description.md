# Build a budgeting app

Build a complete single-page React application — a personal budgeting tool — with **four views**
reached from a top navigation bar: **Transactions**, **Budgets**, **Reports**, and **Settings**.
The app starts on Transactions. State is shared across all views and kept in memory.

There are three expense categories with monthly budgets: **Food** ($300), **Transport** ($100),
and **Fun** ($150). Income uses the category **Salary**.

Navigation: a nav bar with a button for each view (**Transactions**, **Budgets**, **Reports**,
**Settings**).

**Transactions**
- A form with inputs labeled **Description** and **Amount** (a number), a **Category** selector
  (Food, Transport, Fun, Salary), and a **Type** selector (income, expense). An **Add transaction**
  button records it. Ignore a non-positive amount.
- A list shows each transaction as `Description: -$Amount (Category)` for an expense, or
  `Description: +$Amount (Category)` for income.

**Budgets** — for each of the three budget categories, a line `Category: $Spent of $Limit` where
Spent is the total of expenses in that category. When Spent exceeds the limit, also show
`Category over budget`.

**Reports** — read-only summary lines: `Total income: $X`, `Total expense: $Y`, `Balance: $Z`
(income − expense), and `Savings rate: P%` (income minus expense, divided by income, as a
whole-number percent; 0% when there is no income).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show expenses only** checkbox; when checked, the Transactions list hides income entries
  (they still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
