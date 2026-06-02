# Build a Business Expense Tracker

Build a complete single-page React application — a simple business expense tracker — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the Expenses view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list of business expenses.
- Three inputs to add a new expense:
  - An input labeled **Vendor** (text)
  - An input labeled **Category** (text)
  - An input labeled **Amount** (number)
- An **Add expense** button that adds the expense to the list. Ignore the submission if Vendor is blank, Category is blank, or Amount is not a positive number.
- A **Filter by category** input that filters the displayed list to only show expenses whose category matches (case-insensitive). An empty filter shows all expenses.
- Each expense row shows the vendor, category, and amount formatted as `$X.XX` (two decimal places).
- A **Delete** button on each row removes that expense.
- Below the list, show the total of the currently displayed (filtered) expenses as `Filtered total: $X.XX`.

Seed the app with these three expenses already present on first render:
1. Vendor: `Staples`, Category: `Office`, Amount: `45.00`
2. Vendor: `Delta Airlines`, Category: `Travel`, Amount: `320.50`
3. Vendor: `WeWork`, Category: `Office`, Amount: `800.00`

**Summary** — a read-only derived stats view.
- Shows the grand total of ALL expenses (not affected by the filter) as `Total: $X.XX`.
- Shows a per-category breakdown. For each category present, show one line formatted as `Category: $X.XX` (e.g. `Office: $845.00`, `Travel: $320.50`). Categories are listed in the order they first appear.
- Shows the count of total expenses as `Expenses: N`.

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
