# Portfolio Tracker App

A multi-route investment portfolio tracking application.

## Routes
- **Home** (`home`): Dashboard showing total holdings count, total portfolio value (sum of quantity * currentPrice for each holding), and number of transactions.
- **Holdings** (`holdings`): List all holdings with symbol, name, quantity, purchase price, current price, and gain/loss. Add new holding (symbol, name, quantity, purchasePrice, currentPrice). Delete a holding.
- **Transactions** (`transactions`): List all transactions with symbol, type (buy/sell), quantity, price, date. Add new transaction (symbol, type, quantity, price, date).
- **Performance** (`performance`): Show each holding with total gain/loss = (currentPrice - purchasePrice) * quantity, formatted with + or - prefix.

## Seed Data
Three holdings:
1. AAPL, Apple Inc., quantity: 10, purchasePrice: 150, currentPrice: 175
2. MSFT, Microsoft Corp., quantity: 5, purchasePrice: 280, currentPrice: 320
3. GOOGL, Alphabet Inc., quantity: 2, purchasePrice: 2800, currentPrice: 2950

Two transactions:
1. AAPL, buy, quantity: 10, price: 150, date: 2024-01-15
2. MSFT, buy, quantity: 5, price: 280, date: 2024-02-10

## Fields & Validation
- Holding: symbol (required), name (required), quantity (required, number), purchasePrice (required, number), currentPrice (required, number)
- Transaction: symbol (required), type buy|sell, quantity (required), price (required), date (required)

## Behaviors
- Holdings page: shows gain/loss per holding as (currentPrice - purchasePrice) * quantity
- Performance page: lists all holdings sorted by gain/loss descending
- Dashboard total value = sum of (quantity * currentPrice)
- API returns 400 for missing required fields

## API
- GET/POST /api/holdings — list / create holding
- DELETE /api/holdings — delete `{ id }`
- GET/POST /api/transactions — list / create transaction

## data-testid Requirements
- nav-home, nav-holdings, nav-transactions, nav-performance
- dashboard-holdings-count, dashboard-portfolio-value, dashboard-transaction-count
- holding-list, holding-item, add-holding-form, holding-symbol-input, holding-name-input, holding-quantity-input, holding-purchase-price-input, holding-current-price-input, submit-holding, delete-holding
- transaction-list, transaction-item, add-transaction-form, transaction-symbol-input, transaction-type-select, transaction-quantity-input, transaction-price-input, transaction-date-input, submit-transaction
- performance-list, performance-item
