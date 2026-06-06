# scratch-app-cap-table

A cap table management app for startups to track shareholders, equity rounds, and ownership percentages.

## Routes
- `/` — Dashboard: total shares, number of shareholders, total equity value, ownership breakdown
- `/shareholders` — List/add/delete shareholders. Fields: name, type (Founder/Employee/Investor/Advisor), shares
- `/rounds` — List/add funding rounds. Fields: name (e.g. "Seed"), date, sharePrice, newShares
- `/dilution` — Dilution calculator: enter a hypothetical new shares issuance and see how it affects ownership percentages

## Seed Data
Shareholders:
1. { id: "1", name: "Alice Founder", type: "Founder", shares: 4000000 }
2. { id: "2", name: "Bob Founder", type: "Founder", shares: 3000000 }
3. { id: "3", name: "Accel Fund", type: "Investor", shares: 2000000 }
4. { id: "4", name: "Carol Advisor", type: "Advisor", shares: 100000 }

Rounds:
1. { id: "1", name: "Seed", date: "2023-06-01", sharePrice: 1.00, newShares: 2000000 }
2. { id: "2", name: "Series A", date: "2024-01-15", sharePrice: 5.00, newShares: 1000000 }

Settings:
- totalAuthorizedShares: 10000000

## Behaviors
- Total issued shares = sum of all shareholder shares
- Ownership % = shareholder.shares / totalIssuedShares * 100 (2 decimal places)
- Total equity value = sum of (shares * latest round sharePrice), latest round = most recently added round
- Dilution calculator: shows pre and post new-shares ownership % for each shareholder
- Adding shareholder requires name, type, shares > 0
- Adding round requires name, date, sharePrice > 0, newShares > 0

## Edge Cases
- If no rounds, equity value shows as N/A
- Ownership percentages must sum to 100% (within rounding)
- New shareholder shares cannot exceed (authorizedShares - issuedShares)
