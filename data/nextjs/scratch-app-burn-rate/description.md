# scratch-app-burn-rate

A burn rate tracker that logs monthly transactions, calculates gross/net burn, and forecasts runway.

## Routes
- `/` — Dashboard: gross burn, net burn, MRR, net burn month-over-month change
- `/transactions` — Log/delete transactions. Fields: description, amount, type (Income/Expense), category, date (YYYY-MM)
- `/categories` — Manage expense categories. Default: Payroll, Infrastructure, Marketing, G&A, Revenue
- `/forecast` — Forecast table showing next 6 months of projected burn assuming constant current net burn

## Seed Data
Transactions (all for 2024-01):
1. { id: "1", description: "Customer Revenue", amount: 30000, type: "Income", category: "Revenue", date: "2024-01" }
2. { id: "2", description: "Payroll", amount: 55000, type: "Expense", category: "Payroll", date: "2024-01" }
3. { id: "3", description: "AWS", amount: 4000, type: "Expense", category: "Infrastructure", date: "2024-01" }
4. { id: "4", description: "Google Ads", amount: 8000, type: "Expense", category: "Marketing", date: "2024-01" }
5. { id: "5", description: "Office", amount: 3000, type: "Expense", category: "G&A", date: "2024-01" }

Starting cash: 400000

## Behaviors
- Gross burn = sum of all Expense transactions for current month
- Net burn = gross burn - sum of Income transactions for current month
- MRR = sum of Income transactions for current month
- Dashboard month = most recent month in transactions
- Month-over-month change: compare net burn of current month vs previous month (show N/A if no prior data)
- Forecast: starting from current cash, subtract net burn each month for 6 months
- Deleting a transaction updates all calculations

## Edge Cases
- If net burn <= 0 (income exceeds expenses), runway = Infinity
- Transactions with future dates are included in calculations for that month
- Category management: cannot delete a category that has transactions
