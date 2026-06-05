# Build a Business Expense Tracker

Build a complete single-page React application — a simple internal expense tracking tool for small businesses — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the **Expenses** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list view where you log and browse expense records.
- Three inputs to add a new expense:
  - A text input labeled **Vendor** (the name of the vendor/supplier)
  - A select/dropdown labeled **Category** with options: **Food**, **Travel**, **Software**, **Office**, **Other**
  - A number input labeled **Amount** (in dollars, e.g. `12.50`)
- An **Add Expense** button that adds the entry to the list. Ignore the entry if Vendor is blank or Amount is not a positive number.
- A filter dropdown labeled **Filter by category** with options **All**, **Food**, **Travel**, **Software**, **Office**, **Other**. When a category is selected, only expenses in that category are shown in the list.
- Each expense row shows the vendor name, the category, and the amount formatted as `$12.50` (two decimal places).
- A **Delete** button on each row removes that expense.
- Below the list, show a line `Showing: N expenses` that reflects the current filtered count.
- A line `Filtered Total: $0.00` showing the sum of the currently visible (filtered) expenses, formatted to two decimal places.

**Summary** — a read-only derived stats view.
- Shows `Total Expenses: N` (count of all expenses, unfiltered).
- Shows `Monthly Total: $0.00` (sum of all expenses regardless of category, formatted to two decimal places).
- Shows one line per category (Food, Travel, Software, Office, Other) in that order, each formatted as `Food: $0.00`, `Travel: $0.00`, etc., showing the total amount in that category.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.
- Displays the current theme as `Current theme: light` or `Current theme: dark`.

Seed the app with these three initial expenses so tests have data to work with:
1. Vendor: `Acme Corp`, Category: `Office`, Amount: `45.00`
2. Vendor: `Delta Air`, Category: `Travel`, Amount: `320.75`
3. Vendor: `GitHub`, Category: `Software`, Amount: `9.99`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
