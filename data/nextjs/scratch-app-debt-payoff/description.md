# scratch-app-debt-payoff

## Overview
A debt payoff planner with 4 routes: Overview, Debts, Payments, and Strategy.

## Routes
- **Overview** (`overview`): Total debt remaining, total paid, number of debts.
- **Debts** (`debts`): List debts. Add debt form (name, balance, interestRate, minimumPayment). Delete debt.
- **Payments** (`payments`): Log a payment (debtId, amount, date). List all payments. Payments reduce debt balance.
- **Strategy** (`strategy`): Show debts ordered by highest interest rate first (avalanche method). Display each debt's balance, rate, and recommended priority.

## Seed Data
Debts:
- { id: "d1", name: "Credit Card", balance: 3000, interestRate: 22.9, minimumPayment: 60 }
- { id: "d2", name: "Car Loan", balance: 8000, interestRate: 6.5, minimumPayment: 200 }
- { id: "d3", name: "Student Loan", balance: 15000, interestRate: 4.5, minimumPayment: 150 }

Payments:
- { id: "p1", debtId: "d1", amount: 200, date: "2024-01-05" }
- { id: "p2", debtId: "d2", amount: 300, date: "2024-01-10" }

## Fields
- Debt: id, name, balance (original), interestRate (%), minimumPayment
- Payment: id, debtId, amount, date

## Behaviors
- Remaining balance per debt = balance - sum of payments for that debt
- Total remaining = sum of all remaining balances
- Total paid = sum of all payment amounts
- Strategy sorts debts by interestRate descending (avalanche)
