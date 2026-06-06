# Savings Jar

Build a single-page savings goal tracker. Users can manage multiple savings jars, each with a name, target amount, and current balance.

## Seed Data

Start with these three jars pre-loaded:

| ID | Name          | Target  | Balance |
|----|---------------|---------|---------|
| 1  | Vacation Fund | 1500.00 | 320.00  |
| 2  | New Laptop    | 800.00  | 150.00  |
| 3  | Emergency     | 2000.00 | 2000.00 |

## UI Layout

- Page heading: "Savings Jar"
- A form to add a new jar with fields: Name (text), Target Amount (number). Submit button labeled "Add Jar".
- A list of jar cards. Each card shows:
  - Jar name
  - Progress bar (filled proportion = balance / target, capped at 100%)
  - Balance display: "$X.XX saved of $Y.YY"
  - Percent complete: "Z%" (floor of balance/target * 100, max 100)
  - Status badge: "Complete" if balance >= target, else "In Progress"
  - Deposit input (number) + "Deposit" button
  - Withdraw input (number) + "Withdraw" button
  - "Delete" button to remove the jar

## Behaviors

### Add Jar
- Name must not be empty and target must be > 0; otherwise do nothing.
- New jar starts with balance = 0.
- Assign incremental numeric IDs (max existing id + 1).

### Deposit
- Parse the deposit input as a float.
- If value <= 0 or NaN, do nothing.
- Add value to jar's balance (balance cannot exceed target — cap at target).
- Clear the deposit input after success.

### Withdraw
- Parse the withdraw input as a float.
- If value <= 0 or NaN, do nothing.
- Subtract value from jar's balance (balance cannot go below 0 — floor at 0).
- Clear the withdraw input after success.

### Delete
- Remove the jar from the list immediately.

### Progress Bar
- Use a `<div>` with `data-testid="progress-bar-{id}"` as the outer container.
- Inner fill `<div>` with inline style `width: X%` where X = Math.min(100, Math.floor(balance/target*100)).

## Edge Cases
- Deposit exceeding remaining capacity: cap balance at target.
- Withdraw exceeding balance: floor balance at 0.
- Adding a jar with empty name or zero/negative target: no-op.
- A jar at 100% shows "Complete" badge and progress bar full.
