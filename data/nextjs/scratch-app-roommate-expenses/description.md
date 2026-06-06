# Roommate Expenses

A shared expense tracker for roommates to log costs, split bills, and track who owes whom.

## Routes
- **/** — Dashboard with balance summary per roommate
- **/expenses** — List expenses, add new expense with payer and split
- **/roommates** — Manage roommates
- **/settle** — Record settlements between roommates
- **/history** — Full payment history

## Features
- Add roommates (name, email)
- Add expenses (description, amount, payer, split equally among selected roommates)
- View who owes what to whom
- Record settlements to zero out balances
- History of all transactions

## Data Model
- Roommate: id, name, email
- Expense: id, description, amount, payerId, splitWith (string[]), date, category
- Settlement: id, fromId, toId, amount, date
