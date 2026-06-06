# scratch-app-contract-tracker

## Overview
A contract tracking application where users manage contracts with parties, values, start/end dates, and lifecycle status.

## Seed Data
Three initial contracts:
1. { id: "1", title: "Software License Agreement", party: "Acme Corp", value: 50000, startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" }
2. { id: "2", title: "Consulting Services Contract", party: "Globex Inc", value: 25000, startDate: "2024-03-01", endDate: "2024-09-30", status: "Active" }
3. { id: "3", title: "Maintenance Agreement", party: "Initech LLC", value: 12000, startDate: "2023-01-01", endDate: "2023-12-31", status: "Expired" }

## Routes
- `/` — Dashboard: total contracts, total value of Active contracts, count by status
- `/contracts` — Contract list with status filter
- `/contracts/add` — Add new contract form
- `/contracts/[id]` — Contract detail

## Behaviors
- NavBar links to Dashboard and Contracts
- Status filter on list page filters in real time
- Add form fields: title (required), party (required), value (number, required), startDate, endDate, status (default Active)
- Validation: title required, party required, value must be > 0
- POST /api/contracts adds contract, returns 201
- GET /api/contracts returns all contracts
- Total active value on dashboard = sum of value for Active contracts

## Edge Cases
- Missing title or party shows respective validation errors
- Value <= 0 shows "Value must be greater than 0"
- Filter with no matches shows "No contracts found"
