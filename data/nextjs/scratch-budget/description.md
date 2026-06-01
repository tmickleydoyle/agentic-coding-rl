# Build a budget tracker

Build a single-page React application that tracks income and expenses, scoped by month, against
per-category budgets.

There are three expense categories with monthly budgets: **Food** ($300), **Transport** ($100),
and **Entertainment** ($150). Income uses the category **Salary** (no budget).

Seed these transactions:

| Type    | Description | Category      | Amount | Month    |
| ------- | ----------- | ------------- | ------ | -------- |
| income  | Salary      | Salary        | 2000   | January  |
| expense | Groceries   | Food          | 120    | January  |
| expense | Restaurant  | Food          | 250    | January  |
| expense | Bus pass    | Transport     | 60     | January  |
| expense | Movies      | Entertainment | 80     | January  |
| income  | Freelance   | Salary        | 500    | February |
| expense | Snacks      | Food          | 40     | February |

What the app should do:

- **Month filter.** A control selects the scope: **All**, **January**, or **February**. It filters
  the transaction list and every figure below.
- **Balance.** Show `Balance: $1950.00` for the current scope — total income minus total expenses.
  With no filter (All) the balance is $1950.00; for January it is $1490.00; for February $460.00.
- **Category budgets.** For each of the three expense categories, show how much was spent against
  its budget in the current scope, like `Food: $370.00 of $300.00`. When spending **exceeds** the
  budget, also show a warning `Food over budget`.
- **Add transactions.** A form collects a **Type** (income or expense), **Description**,
  **Category**, **Amount**, and **Month**, and an **Add transaction** button records it. Ignore a
  non-positive amount. New transactions immediately affect the balance, category totals, warnings,
  and list (subject to the active filter).

Format all money with two decimals. All state is in memory. Implement the root component as the
default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no
Next.js APIs.
