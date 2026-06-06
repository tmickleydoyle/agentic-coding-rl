# Utilities Tracker

Track household utility bills (electricity, water, gas, internet) with monthly usage and cost history.

## Routes
- **/** — Dashboard with monthly summary and totals
- **/utilities** — Manage utility accounts (electricity, water, gas, internet)
- **/bills** — Log monthly bills for each utility
- **/usage** — Log meter readings / usage amounts
- **/reports** — View spending trends by utility

## Features
- Add utility accounts (name, type, provider, account number)
- Log bills (utility, month, amount, due date, paid status)
- Log usage readings (utility, month, units, reading)
- Dashboard shows current month totals and paid/unpaid bills
- Filter bills by utility type or month

## Data Model
- Utility: id, name, type (electricity|water|gas|internet|other), provider, accountNumber
- Bill: id, utilityId, month, amount, dueDate, paid
- Reading: id, utilityId, month, units, reading
