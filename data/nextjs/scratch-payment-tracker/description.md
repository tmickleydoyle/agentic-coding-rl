# Payment Tracker

A single-page React app for logging received payments and tracking outstanding balances per client.

## Seed Data

### Clients with expected amounts:

| Client         | Expected ($) |
|----------------|-------------|
| Acme Corp      | 5000        |
| Beta Studio    | 2400        |
| Gamma LLC      | 3200        |

### Payments received (pre-loaded):

| Client         | Amount  | Date       | Reference       |
|----------------|---------|------------|-----------------|
| Acme Corp      | 2500.00 | 2024-01-10 | ACH-20240110     |
| Beta Studio    | 2400.00 | 2024-01-12 | WIRE-20240112    |
| Acme Corp      | 1500.00 | 2024-01-20 | ACH-20240120     |
| Gamma LLC      | 1000.00 | 2024-01-22 | CHECK-001        |

## Fields

Each payment record:
- **client** (string, required — must match a client in the list)
- **amount** (number, required, > 0)
- **date** (string, YYYY-MM-DD)
- **reference** (string, optional)

## UI Layout

- Page heading: "Payment Tracker"
- Total received: "Total Received: $X.XX" — sum of all payment amounts
- Client balances table: shows each client, their expected amount, total paid, and balance due (expected - paid). Balance shown in red if > 0, green if 0.
- Payment log form: Client (select from client list), Amount (number), Date (date), Reference (text), Log Payment button
- Payments list — each entry shows: client, amount, date, reference, Delete button
- Payments sorted newest first by date

## Behaviors

1. **Log Payment**: Selecting a client and entering amount > 0 then clicking Log Payment adds the payment.
2. **Delete Payment**: Removes the payment and recalculates client balances.
3. **Client balances**: Recalculate in real time as payments are added/removed.
4. **Total Received**: Sum of all payment amounts, updates in real time.
5. **Sort**: Payments list always shows newest date first.

## Edge Cases

- Amount <= 0: Log Payment does nothing.
- Overpayment: balance can go negative (shown in green as $0.00 or negative).
- Reference is optional; show empty string if not provided.
