# Budget Planner App

A multi-route personal budget planner for tracking income and expenses.

## Routes
- **Home** (`/`): Shows total balance (income - expenses), total income, total expenses.
- **Transactions** (`/transactions`): Add and delete transactions. Each transaction: id, description, amount (positive=income, negative=expense), category, date (ISO string).
- **Categories** (`/categories`): CRUD for budget categories. Each: id, name, type ("income"|"expense"), budgetLimit (number).
- **Summary** (`/summary`): Monthly breakdown — for current month: total income, total expenses, balance, spending by category vs. budget limit.

## Seed Data
Categories: `[{ id: "cat1", name: "Salary", type: "income", budgetLimit: 5000 }, { id: "cat2", name: "Food", type: "expense", budgetLimit: 500 }, { id: "cat3", name: "Transport", type: "expense", budgetLimit: 200 }]`
Transactions: `[{ id: "t1", description: "Monthly salary", amount: 3000, category: "cat1", date: "2024-01-01" }, { id: "t2", description: "Groceries", amount: -150, category: "cat2", date: "2024-01-05" }, { id: "t3", description: "Bus pass", amount: -50, category: "cat3", date: "2024-01-07" }]`

## Behaviors
- Balance = sum of all transaction amounts.
- Adding a transaction requires description, non-zero amount, and a category.
- Deleting a category does NOT delete its transactions.
- Summary groups expense transactions by category, shows actual vs. budget limit.
- Category type determines whether budgetLimit applies to income or expense grouping.

## API
`GET /api/transactions` → returns `{ transactions: Transaction[] }`
`POST /api/transactions` body `{ description, amount, category, date }` → returns `{ transaction: Transaction }`
`DELETE /api/transactions?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Amount of 0 is rejected.
- Summary with no transactions for a category shows 0 actual.
- Balance shown with 2 decimal places.
