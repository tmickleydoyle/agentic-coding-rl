# Build a Business Expense Tracker

Build a complete single-page React application — a small business expense tracker — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the Expenses view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — the main list of expense entries.
- Three inputs to add a new expense:
  - A text input labeled **Vendor** (the business name)
  - A select labeled **Category** with options: **Food**, **Travel**, **Software**, **Office**, **Other**
  - A number input labeled **Amount**
- An **Add Expense** button that adds the entry (ignore if Vendor is blank or Amount is not a positive number).
- Below the form, a **Filter by category** select with the same category options plus a leading **All** option (default). Selecting a category shows only expenses in that category; selecting **All** shows all.
- Each expense row shows the vendor name, the category, and the amount formatted as `$X.XX` (two decimal places).
- Each expense row has a **Delete** button that removes it.
- A line below the list shows `Showing: N expenses` reflecting the currently filtered count.
- A line below that shows `Total: $X.XX` — the sum of the **filtered** expenses.

**Summary** — a read-only derived view.
- Shows `Total expenses: N` (count of all expenses regardless of filter).
- Shows `Grand total: $X.XX` (sum of all expenses).
- For each category that has at least one expense, shows one line formatted as `Category: $X.XX` (e.g. `Food: $12.50`). Categories with zero expenses are omitted.

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Seed the app with **no expenses** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).