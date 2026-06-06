# scratch-app-currency-log

## Overview
A currency exchange log app for travelers to track currency exchanges made during trips, with a log list and spending summary by currency.

## Routes
- `/` — Home: title, total exchanges count, nav links
- `/log` — Exchange log: all exchange records
- `/add-exchange` — Form to log a new exchange
- `/summary` — Summary by currency: total spent per currency

## Data Model (Exchange)
```ts
interface Exchange {
  id: string;
  date: string;         // "YYYY-MM-DD"
  fromCurrency: string; // e.g. "USD"
  toCurrency: string;   // e.g. "EUR"
  amountFrom: number;   // amount given
  amountTo: number;     // amount received
  location: string;     // city/country where exchanged
  fee: number;          // exchange fee in fromCurrency
}
```

## Seed Data
```ts
[
  { id: "1", date: "2024-03-15", fromCurrency: "USD", toCurrency: "JPY", amountFrom: 500, amountTo: 73500, location: "Tokyo Airport", fee: 5 },
  { id: "2", date: "2024-03-18", fromCurrency: "USD", toCurrency: "JPY", amountFrom: 200, amountTo: 29000, location: "Kyoto Bank", fee: 2 },
  { id: "3", date: "2024-05-02", fromCurrency: "USD", toCurrency: "EUR", amountFrom: 300, amountTo: 276, location: "Rome Exchange", fee: 3 },
]
```

## Behaviors

### Home (`/`)
- Heading "Currency Log"
- data-testid="home-exchange-count" — total exchange count
- data-testid="home-total-fees" — total fees sum formatted to 2 decimal places

### Log (`/log`)
- data-testid="exchange-card" per record
- data-testid="exchange-from", "exchange-to", "exchange-date", "exchange-location", "exchange-fee"
- Shows "{amountFrom} {fromCurrency} → {amountTo} {toCurrency}" in exchange-from/exchange-to

### Add Exchange (`/add-exchange`)
- Fields: date, fromCurrency, toCurrency, amountFrom (number), amountTo (number), location, fee (number)
- data-testid: input-date, input-from-currency, input-to-currency, input-amount-from, input-amount-to, input-location, input-fee, submit-exchange
- On submit: adds record, navigates to /log
- Validation: amountFrom and amountTo must be > 0

### Summary (`/summary`)
- data-testid="summary-page"
- Groups by toCurrency, shows total amountTo received per currency
- data-testid="summary-row" per currency
- data-testid="summary-currency" and "summary-total" within each row
- summary-total is sum of amountTo for that currency

## API: /api/exchanges
- GET: all exchanges
- POST: create exchange, return 201

## Edge Cases
- Same toCurrency records aggregate in summary
- Fee of 0 is valid
