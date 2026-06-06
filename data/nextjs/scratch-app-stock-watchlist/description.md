# Stock Watchlist App

A multi-route stock watchlist for tracking stocks, setting price alerts, and viewing history.

## Routes
- **Home** (`/`): Shows total stocks watched, number of active alerts, and portfolio total value (sum of price * quantity).
- **Watchlist** (`/watchlist`): CRUD for stocks. Each stock: id, ticker (uppercase), name, price (number), quantity (number), currency ("USD").
- **Alerts** (`/alerts`): Set price alerts per stock. Each alert: id, stockId, targetPrice, condition ("above"|"below"), triggered (boolean).
- **History** (`/history`): Log of price updates. Each entry: id, stockId, price, timestamp (ISO string).

## Seed Data
Stocks: `[{ id: "stk1", ticker: "AAPL", name: "Apple Inc.", price: 185.50, quantity: 10, currency: "USD" }, { id: "stk2", ticker: "GOOGL", name: "Alphabet Inc.", price: 140.25, quantity: 5, currency: "USD" }]`
Alerts: `[{ id: "al1", stockId: "stk1", targetPrice: 200, condition: "above", triggered: false }]`

## Behaviors
- Adding a stock requires a non-empty ticker (auto-uppercased) and positive price and quantity.
- Duplicate tickers are rejected.
- Updating a stock's price adds an entry to history.
- Alerts are marked triggered if the new price meets the condition.
- Deleting a stock also deletes its alerts and history entries.

## API
`GET /api/stocks` → returns `{ stocks: Stock[] }`
`POST /api/stocks` body `{ ticker, name, price, quantity, currency }` → returns `{ stock: Stock }`
`DELETE /api/stocks?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Ticker with lowercase input: auto-convert to uppercase.
- Duplicate ticker: show error "Ticker already in watchlist".
- Price must be > 0, quantity must be > 0.
