# scratch-app-home-budget

## Overview
A home budget tracker app with 4 routes: Home (summary), Expenses, Income, and Reports. Users can add/delete expenses and income entries, and view summary statistics.

## Routes
- **Home** (`home`): Shows total income, total expenses, and balance (income - expenses) for all time. Shows recent 3 entries from expenses and income.
- **Expenses** (`expenses`): List all expenses. Form to add expense (description, amount, category, date). Delete button per row.
- **Income** (`income`): List all income entries. Form to add income (source, amount, date). Delete button per row.
- **Reports** (`reports`): Shows breakdown of expenses by category as totals. Shows total income vs total expenses vs balance.

## Seed Data
Expenses:
- { id: "e1", description: "Rent", amount: 1500, category: "housing", date: "2024-01-01" }
- { id: "e2", description: "Groceries", amount: 200, category: "food", date: "2024-01-05" }
- { id: "e3", description: "Gas", amount: 80, category: "transport", date: "2024-01-10" }

Incomes:
- { id: "i1", source: "Salary", amount: 4000, date: "2024-01-01" }
- { id: "i2", source: "Freelance", amount: 500, date: "2024-01-15" }

## Fields
- Expense: id (uuid), description (string), amount (number > 0), category (housing|food|transport|utilities|entertainment|other), date (YYYY-MM-DD)
- Income: id (uuid), source (string), amount (number > 0), date (YYYY-MM-DD)

## Behaviors
- Balance = total income - total expenses
- Adding expense/income appends to list with generated id
- Deleting removes by id
- Reports show per-category expense sum
- Nav links switch route via AppState

## Edge Cases
- Empty state shows $0 for all totals
- Balance can be negative (shown as negative number)
- Categories must be one of the 6 defined values
