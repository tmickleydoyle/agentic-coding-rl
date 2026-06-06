# scratch-app-travel-budget

## Overview
A travel budget tracker app where users set a trip budget, log expenses by category, and monitor spending vs. budget remaining.

## Routes
- `/` — Home: budget overview (total budget, spent, remaining)
- `/expenses` — All expenses list
- `/add-expense` — Form to log a new expense
- `/summary` — Spending breakdown by category with percentages

## Data Model
```ts
interface Expense {
  id: string;
  date: string;         // "YYYY-MM-DD"
  description: string;
  category: string;     // "Food", "Transport", "Accommodation", "Activities", "Shopping", "Other"
  amount: number;       // USD
  currency: string;     // original currency code
  originalAmount: number; // amount in original currency
}

interface BudgetConfig {
  totalBudget: number;
  tripName: string;
  currency: string;
}
```

## Seed Data
```ts
budget: { totalBudget: 3000, tripName: "Japan Adventure", currency: "USD" }

expenses:
[
  { id: "1", date: "2024-03-15", description: "Hotel check-in", category: "Accommodation", amount: 120, currency: "JPY", originalAmount: 17640 },
  { id: "2", date: "2024-03-15", description: "Ramen lunch", category: "Food", amount: 12, currency: "JPY", originalAmount: 1764 },
  { id: "3", date: "2024-03-16", description: "Shinkansen", category: "Transport", amount: 80, currency: "JPY", originalAmount: 11760 },
  { id: "4", date: "2024-03-16", description: "Temple entry", category: "Activities", amount: 5, currency: "JPY", originalAmount: 735 },
  { id: "5", date: "2024-03-17", description: "Souvenir shopping", category: "Shopping", amount: 60, currency: "JPY", originalAmount: 8820 },
]
```

## Behaviors

### Home (`/`)
- Heading "Japan Adventure" (trip name from config)
- data-testid="home-total-budget" — total budget
- data-testid="home-total-spent" — sum of all expense amounts
- data-testid="home-remaining" — totalBudget - totalSpent
- data-testid="home-percent-used" — percentage spent, rounded to 1 decimal (e.g. "9.2%")

### Expenses (`/expenses`)
- data-testid="expense-card" per expense
- data-testid="expense-description", "expense-category", "expense-amount", "expense-date"

### Add Expense (`/add-expense`)
- Fields: date, description, category (select), amount (number USD), currency, originalAmount
- data-testid: input-date, input-description, input-category, input-amount, input-currency, input-original-amount, submit-expense
- On submit: adds expense, navigates to /expenses

### Summary (`/summary`)
- data-testid="summary-page"
- Groups expenses by category
- data-testid="summary-row" per category
- data-testid="summary-category", "summary-amount", "summary-percent" within each row
- summary-percent = (category total / total spent) * 100, rounded to 1 decimal + "%"
- Rows sorted by amount descending

## API: /api/expenses
- GET: returns { expenses, budget } JSON object
- POST: creates expense, returns 201 + new expense

## Edge Cases
- remaining can be negative if overspent
- percent-used can exceed 100%
- Summary percentages sum to 100% across categories
