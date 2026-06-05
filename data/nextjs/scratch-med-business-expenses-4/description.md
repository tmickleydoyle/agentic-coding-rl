# Build a Business Expense Tracker

Build a complete single-page React application for tracking business expenses, with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the Expenses view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list of business expenses.
- A form with three fields:
  - An input labeled **Vendor** (the business name)
  - A select labeled **Category** with options: **Food**, **Travel**, **Software**, **Office**, **Other**
  - An input labeled **Amount** (a positive number)
  - An **Add Expense** button that adds the expense (ignore submissions where Vendor is blank or Amount is not a positive number)
- A select labeled **Filter by category** with options: **All**, **Food**, **Travel**, **Software**, **Office**, **Other**. When a category is selected, only expenses in that category are shown in the list.
- The list shows each expense as a row with the vendor name, category, and amount formatted as `$X.XX` (two decimal places).
- A line below the list showing the total of visible (filtered) expenses: `Showing total: $X.XX`
- When no expenses match the filter, show the text `No expenses found`.

**Summary** — a read-only derived view showing stats across ALL expenses (ignoring the filter).
- A line: `Total expenses: N` (count of all expenses)
- A line: `Grand total: $X.XX` (sum of all expense amounts, two decimal places)
- For each category that has at least one expense, show a line: `<Category>: $X.XX` (category total, two decimal places), in the order Food, Travel, Software, Office, Other.

**Settings**
- A **Toggle theme** button that switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and persists as the user navigates between views.

Seed the app with NO initial expenses (empty state).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
