# Expense Tracker

A multi-route personal expense tracking application.

## Routes
- `/home` — Dashboard showing total spent this month, recent 5 expenses, quick-add button
- `/expenses` — Full list of all expenses with delete button per row, and an "Add Expense" form
- `/categories` — List of categories with total spent per category; allow adding new categories
- `/summary` — Bar-chart-style summary showing per-category totals for the current month

## Data Model

### Expense
```ts
{ id: string; description: string; amount: number; category: string; date: string /* ISO */ }
```

### Category
```ts
{ id: string; name: string; color: string }
```

## Seed Data (loaded on store init)
Categories: `[{id:"c1",name:"Food",color:"#f59e0b"},{id:"c2",name:"Transport",color:"#3b82f6"},{id:"c3",name:"Entertainment",color:"#8b5cf6"}]`

Expenses:
```
{id:"e1", description:"Groceries", amount:45.50, category:"Food", date:"2026-06-01"}
{id:"e2", description:"Bus pass",  amount:30.00, category:"Transport", date:"2026-06-02"}
{id:"e3", description:"Movie",     amount:12.00, category:"Entertainment", date:"2026-06-03"}
{id:"e4", description:"Lunch",     amount:15.75, category:"Food", date:"2026-06-04"}
```

## Behaviors
- Add expense: description (required), amount (positive number), category (select from list), date (defaults today)
- Delete expense: removes from list immediately
- Add category: name (required, unique), color (color input, default #6b7280)
- Summary page: shows each category name + total amount spent; categories with $0 are shown as 0
- Home: total = sum of ALL expenses; recent = last 5 by date descending
- Amounts displayed with 2 decimal places and $ prefix

## Edge Cases
- Cannot add expense with empty description or zero/negative amount
- Cannot add duplicate category name (case-insensitive)
- Deleting an expense updates summary totals immediately
- If no expenses exist, home shows $0.00 total

## UI Requirements
- NavBar with links: Home, Expenses, Categories, Summary
- data-testid attributes: `nav-home`, `nav-expenses`, `nav-categories`, `nav-summary`
- Expense list rows: `data-testid="expense-row-{id}"`
- Delete buttons: `data-testid="delete-expense-{id}"`
- Add expense form: `data-testid="expense-description"`, `data-testid="expense-amount"`, `data-testid="expense-category"`, `data-testid="expense-date"`, `data-testid="add-expense-btn"`
- Category rows: `data-testid="category-row-{id}"`
- Add category form: `data-testid="category-name"`, `data-testid="category-color"`, `data-testid="add-category-btn"`
- Summary rows: `data-testid="summary-row-{categoryName}"`
- Home total: `data-testid="total-spent"`
- Home recent list: `data-testid="recent-expenses"`
