# scratch-app-startup-runway

A startup runway calculator app that tracks monthly expenses, current cash balance, and projects how many months of runway remain.

## Routes
- `/` — Dashboard showing current cash, monthly burn, runway in months, and a summary table
- `/runway` — Runway calculator: enter current cash balance and see projected months remaining based on current burn
- `/expenses` — Manage monthly expense line items (add, edit, delete). Fields: name, category (Engineering/Marketing/Operations/Sales), amount (USD)
- `/projections` — View a month-by-month projection table for the next 12 months showing cumulative cash burn
- `/settings` — Configure starting cash balance and target runway (in months)

## Seed Data (loaded on first render, stored in lib/store.ts)
Expenses:
1. { id: "1", name: "Engineering Salaries", category: "Engineering", amount: 45000 }
2. { id: "2", name: "Office Rent", category: "Operations", amount: 8000 }
3. { id: "3", name: "Google Ads", category: "Marketing", amount: 5000 }
4. { id: "4", name: "Sales Tools", category: "Sales", amount: 2000 }

Settings:
- cashBalance: 500000
- targetRunway: 18 (months)

## Behaviors
- Total monthly burn = sum of all expense amounts
- Runway months = floor(cashBalance / monthlyBurn)
- Dashboard shows: cash balance, monthly burn, runway months, and whether runway >= target (green) or < target (red)
- Projections table: Month 1..12, starting cash, expenses, ending cash (ending cash goes negative after runway exhausted)
- Adding an expense requires name (non-empty) and amount > 0
- Editing updates in place; deleting removes from list
- Settings changes immediately update dashboard and projections

## Edge Cases
- If monthly burn is 0, runway = Infinity (display "∞")
- Negative cash balance shows as red on dashboard
- Expense amount must be a positive number; form shows error otherwise
