# Build a Business Expense Tracker

Build a complete single-page React application — a lightweight business expense tracker — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the Expenses view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list of business expenses.
- Three inputs to add a new expense:
  - A text input labeled **Vendor** for the vendor/payee name.
  - A select input labeled **Category** with options: **Food**, **Travel**, **Software**, **Office**, **Other**.
  - A number input labeled **Amount** for the dollar amount (positive numbers only).
- An **Add expense** button that adds the expense to the list (ignore if Vendor is blank or Amount is not a positive number).
- A select input labeled **Filter by category** with options: **All**, **Food**, **Travel**, **Software**, **Office**, **Other**. When a category is selected, only expenses in that category are shown in the list. The filter does NOT affect the Summary view.
- Each expense row shows the vendor name, category, and amount formatted as `$X.XX` (two decimal places, e.g. `$12.50`).
- Each expense row has a **Delete** button (accessible as `Delete <vendor>`) that removes that expense.

**Summary** — a read-only derived view showing totals computed from ALL expenses (ignoring the filter).
- Shows a line for each category that has at least one expense, in the format `Food: $X.XX`, `Travel: $X.XX`, etc.
- Shows a monthly total line in the format `Total: $X.XX`.
- Shows a count line in the format `Expenses: N`.
- If there are no expenses, shows the text `No expenses yet`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all expenses** button that removes every expense. After clicking, navigating to Summary shows `No expenses yet`.

Seed the app with these three initial expenses so tests can rely on them:
- Vendor: `Acme Corp`, Category: `Office`, Amount: `45.00`
- Vendor: `Fly High`, Category: `Travel`, Amount: `320.50`
- Vendor: `Lunch Spot`, Category: `Food`, Amount: `18.75`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
