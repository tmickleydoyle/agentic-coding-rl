# scratch-app-net-worth

## Overview
A net worth tracker with 4 routes: Summary, Assets, Liabilities, and History.

## Routes
- **Summary** (`summary`): Shows total assets, total liabilities, net worth (assets - liabilities).
- **Assets** (`assets`): List assets (name, value, category). Add/delete assets.
- **Liabilities** (`liabilities`): List liabilities (name, amount, category). Add/delete liabilities.
- **History** (`history`): List net worth snapshots (date, netWorth). Add snapshot with current net worth. Show all snapshots sorted by date descending.

## Seed Data
Assets:
- { id: "a1", name: "Checking Account", value: 5000, category: "cash" }
- { id: "a2", name: "Home", value: 350000, category: "real_estate" }
- { id: "a3", name: "401k", value: 85000, category: "retirement" }

Liabilities:
- { id: "l1", name: "Mortgage", amount: 280000, category: "real_estate" }
- { id: "l2", name: "Car Loan", amount: 12000, category: "loan" }

Snapshots:
- { id: "s1", date: "2024-01-01", netWorth: 147000 }

## Fields
- Asset: id, name, value, category (cash|investment|real_estate|retirement|other)
- Liability: id, name, amount, category (mortgage|loan|credit_card|other)
- Snapshot: id, date (YYYY-MM-DD), netWorth (number)

## Behaviors
- Net worth = totalAssets - totalLiabilities
- Adding snapshot captures current calculated net worth with a given date
