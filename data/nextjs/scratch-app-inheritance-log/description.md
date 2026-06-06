# Inheritance Log App

A multi-route React application for logging inheritance transactions, managing heirs, and viewing a timeline.

## Routes
- `/` (Entries): List all inheritance log entries with amount, heir name, date (YYYY-MM-DD), and status (Pending | Transferred | Disputed). Allow adding a new entry and deleting an entry.
- `/heirs`: List heirs with name and share percentage (0-100). Allow adding and deleting heirs. Total share displayed; shows warning if total != 100.
- `/timeline`: List entries sorted by date ascending with amount and heir name.

## Seed Data
Entries:
- { id: "e1", heir: "Alice", amount: 50000, date: "2024-01-15", status: "Transferred" }
- { id: "e2", heir: "Bob", amount: 30000, date: "2024-03-20", status: "Pending" }
- { id: "e3", heir: "Carol", amount: 20000, date: "2024-02-10", status: "Disputed" }

Heirs:
- { id: "h1", name: "Alice", share: 50 }
- { id: "h2", name: "Bob", share: 30 }
- { id: "h3", name: "Carol", share: 20 }

## Behaviors
- Adding entry: heir (text) + amount (positive number) + date + status; appends to list.
- Adding heir: name + share (0-100); appends to list.
- Deleting removes item.
- Timeline shows entries sorted by date ascending.
- Total share warning shown when sum of heir shares != 100.
- NavBar: Entries, Heirs, Timeline.

## API
`GET /api/inheritance` returns `{ entryCount: number, totalAmount: number, heirCount: number }`.

## Edge Cases
- No entries: "No entries found."
- No heirs: "No heirs found."
- Invalid amount (non-positive) on add entry: ignored.
