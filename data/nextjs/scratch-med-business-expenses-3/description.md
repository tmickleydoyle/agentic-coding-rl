# Build a Business Expense Tracker

Build a complete single-page React application — a business expense tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the **Expenses** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list view.
- Three inputs for adding a new expense:
  - A text input labeled **Vendor** (the vendor name)
  - A select/dropdown labeled **Category** with options: **Food**, **Travel**, **Software**, **Office**, **Other**
  - A number input labeled **Amount**
- An **Add Expense** button that appends the entry to the list (ignore if Vendor is blank or Amount is not a positive number).
- Each expense row shows: vendor name, category, and the amount formatted as `$X.XX` (two decimal places).
- Each row has a **Delete** button that removes that expense.
- A **Filter by category** dropdown (options: **All**, **Food**, **Travel**, **Software**, **Office**, **Other**) that filters the visible list. When a filter is active, only matching rows are shown. The filter does NOT affect the Summary view.
- Below the list, show the total of currently visible expenses as `Visible Total: $X.XX`.

**Summary** — a read-only derived stats view showing totals across ALL expenses (ignoring any active filter):
- `Total Expenses: N` (count of all expense entries)
- `Monthly Total: $X.XX` (sum of all expense amounts, formatted to two decimal places)
- Per-category totals, one line each in this order: `Food: $X.XX`, `Travel: $X.XX`, `Software: $X.XX`, `Office: $X.XX`, `Other: $X.XX`

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with these three expenses already loaded at startup:
- Vendor: `Acme Corp`, Category: `Office`, Amount: `120.00`
- Vendor: `Fly Airlines`, Category: `Travel`, Amount: `340.50`
- Vendor: `GitHub`, Category: `Software`, Amount: `21.00`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
