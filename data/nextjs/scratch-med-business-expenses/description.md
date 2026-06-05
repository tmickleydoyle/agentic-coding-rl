# Build a Business Expense Tracker

Build a complete single-page React application — a small business expense tracker — with **three views** the user navigates between using a top navigation bar: **Expenses**, **Summary**, and **Settings**. The app starts on the Expenses view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Expenses**, **Summary**, **Settings**) switches the active view.

**Expenses** — a list of expense entries.
- Three inputs: one labeled **Vendor**, one labeled **Category**, and one labeled **Amount** (a number), plus an **Add Expense** button that adds the entry. Ignore the submission if Vendor is blank, Category is blank, or Amount is not a positive number.
- Below the inputs, show a **Filter by category** dropdown (`<select>`) labeled **Filter by category**. Its options are `All` plus each unique category present in the expense list (in the order they first appear). Selecting a category filters the visible list to only that category; selecting `All` shows every expense.
- The filtered list shows each expense as a row with the vendor name, category, and the amount formatted with a dollar sign and two decimal places (e.g. `$12.50`).
- An **Delete** button on each row removes that expense from the list.
- Below the filtered list show the total of the **currently visible (filtered)** expenses as `Filtered Total: $X.XX` (two decimal places).

**Summary** — a read-only derived view.
- Show the total of **all** expenses (unfiltered) as `Total: $X.XX`.
- Show the number of expenses as `Expenses: N`.
- For each unique category (in the order they first appear), show one line formatted exactly as `<Category>: $X.XX` (the sum for that category, two decimal places).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no** initial expenses (empty list).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
