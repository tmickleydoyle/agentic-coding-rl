# Expense Split App

A multi-route app for splitting expenses among groups of people.

## Routes
- **Home** (`/`): Shows group count and total expenses across all groups.
- **Groups** (`/groups`): CRUD for groups. Each group: id, name, members (string[], comma-separated on input).
- **Expenses** (`/expenses`): Add/delete expenses per group. Each expense: id, groupId, description, amount, paidBy (member name), date.
- **Settle** (`/settle`): For a selected group, show each member's balance (amount paid minus fair share). Fair share = total expenses / number of members. Show who owes whom.

## Seed Data
Groups: `[{ id: "g1", name: "Trip to Paris", members: ["Alice", "Bob", "Carol"] }]`
Expenses: `[{ id: "e1", groupId: "g1", description: "Hotel", amount: 300, paidBy: "Alice", date: "2024-03-01" }, { id: "e2", groupId: "g1", description: "Dinner", amount: 90, paidBy: "Bob", date: "2024-03-02" }]`

## Behaviors
- Adding a group requires a non-empty name and at least one member.
- Adding an expense requires a description, positive amount, valid groupId, and paidBy must be a member of the group.
- Balance = amount paid by member - (total group expenses / number of members).
- Positive balance: others owe this member; negative balance: this member owes others.
- Settle page computes simplified debts: who should pay whom.

## API
`GET /api/expenses?groupId=<id>` → returns `{ expenses: Expense[] }` filtered by groupId
`POST /api/expenses` body `{ groupId, description, amount, paidBy, date }` → returns `{ expense: Expense }`
`DELETE /api/expenses?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Group with no expenses: all balances 0.
- Single-member group: fair share = total, balance = 0.
- Amount must be positive.
