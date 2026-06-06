# scratch-app-investment-log

## Overview
An investment log app with 4 routes: Portfolio, Holdings, Transactions, and Performance.

## Routes
- **Portfolio** (`portfolio`): Shows total invested, current value (from holdings), overall gain/loss.
- **Holdings** (`holdings`): List holdings (ticker, shares, avgPrice, currentPrice). Add/delete holdings.
- **Transactions** (`transactions`): Log buy/sell transactions (ticker, type, shares, price, date). List all.
- **Performance** (`performance`): For each holding show gain/loss per share and total gain/loss %.

## Seed Data
Holdings:
- { id: "h1", ticker: "AAPL", shares: 10, avgPrice: 150, currentPrice: 180 }
- { id: "h2", ticker: "MSFT", shares: 5, avgPrice: 280, currentPrice: 310 }
- { id: "h3", ticker: "GOOGL", shares: 2, avgPrice: 2800, currentPrice: 2650 }

Transactions:
- { id: "t1", ticker: "AAPL", type: "buy", shares: 10, price: 150, date: "2023-06-01" }
- { id: "t2", ticker: "MSFT", type: "buy", shares: 5, price: 280, date: "2023-07-15" }
- { id: "t3", ticker: "GOOGL", type: "buy", shares: 2, price: 2800, date: "2023-08-01" }

## Fields
- Holding: id, ticker, shares, avgPrice, currentPrice
- Transaction: id, ticker, type (buy|sell), shares, price, date

## Behaviors
- Total invested = sum(shares * avgPrice) across holdings
- Current value = sum(shares * currentPrice) across holdings
- Gain/loss = currentValue - totalInvested
- Per-holding gain% = ((currentPrice - avgPrice) / avgPrice) * 100
