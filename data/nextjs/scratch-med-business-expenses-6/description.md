# Build a Business Expense Tracker

Build a complete single-page React application — a lightweight internal tool for tracking business expenses — with **three views** navigated via a top nav bar: **Expenses**, **Summary**, and **Settings**. The app starts on the **Expenses** view. All state is kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list view.
- A form with three fields:
  - An input labeled **Vendor** for the merchant name.
  - A select labeled **Category** with exactly these options: `Meals`, `Travel`, `Software`, `Office`, `Other`.
  - An input labeled **Amount** for the dollar value (a positive number).
- An **Add Expense** button that appends the entry to the list. Ignore submissions where Vendor is blank or Amount is not a positive number.
- A select labeled **Filter by category** with options `All`, `Meals`, `Travel`, `Software`, `Office`, `Other`. When a category other than `All` is selected, only expenses in that category are shown in the list.
- Each expense row shows the vendor name, the category, and the amount formatted as `$N.NN` (two decimal places).
- A line at the bottom of the list reads `Total: $N.NN` showing the sum of **all** expenses currently visible (matching the active filter).
- A **Delete** button on each row removes that expense permanently.

Seed the app with these three expenses already in the list on first load:
- Vendor: `Acme Corp`, Category: `Software`, Amount: `49.99`
- Vendor: `Blue Bottle`, Category: `Meals`, Amount: `18.50`
- Vendor: `Delta Air`, Category: `Travel`, Amount: `320.00`

**Summary** — a read-only stats view derived from all expenses (ignoring the active filter).
- Shows one line per category that has at least one expense, formatted as `Category: $N.NN` (e.g. `Software: $49.99`).
- Shows a grand total line: `Grand Total: $N.NN`.
- Shows a line `Expense Count: N` with the total number of expenses.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
