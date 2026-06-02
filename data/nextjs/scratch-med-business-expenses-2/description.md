# Build a Business Expense Tracker

Build a complete single-page React application — a simple business expense tracker — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the Expenses view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list of business expenses.
- Three inputs for adding an expense: a text input labeled **Vendor**, a text input labeled **Amount**, and a select labeled **Category** with options: **Food**, **Travel**, **Supplies**, **Software**, **Other**.
- An **Add Expense** button that adds the expense. Ignore submissions where Vendor is blank or Amount is not a valid positive number.
- Each expense entry shows its vendor name, category, and amount formatted as a dollar value with two decimal places (e.g. `$12.50`).
- A select labeled **Filter by category** (options: **All**, **Food**, **Travel**, **Supplies**, **Software**, **Other**) that filters the list to show only expenses in the selected category. When set to **All**, all expenses are shown.
- The total of the currently visible (filtered) expenses is shown as `Filtered Total: $X.XX`.

**Summary** — a read-only derived stats view.
- Shows the overall monthly total as `Monthly Total: $X.XX` (sum of all expenses regardless of filter).
- For each category that has at least one expense, shows a line formatted as `Category: $X.XX` — e.g. `Food: $24.00`, `Travel: $110.50`. Categories with no expenses are not shown.
- Shows a count of total expenses as `Total Expenses: N`.

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A **Clear all expenses** button that removes every expense from the list.

Seed the app with these initial expenses so tests have data to work with:
- Vendor: `Acme Corp`, Category: `Supplies`, Amount: `45.00`
- Vendor: `Jet Airways`, Category: `Travel`, Amount: `200.00`
- Vendor: `Lunch Spot`, Category: `Food`, Amount: `18.75`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).