# Invoice Log

A single-page React app for tracking issued invoices.

## Seed Data

The app starts with these invoices pre-loaded:

| Invoice # | Client         | Amount  | Issue Date | Due Date   | Status  |
|-----------|----------------|---------|------------|------------|---------|
| INV-001   | Acme Corp      | 2400.00 | 2024-01-01 | 2024-01-31 | paid    |
| INV-002   | Beta Studio    | 950.00  | 2024-01-10 | 2024-02-09 | pending |
| INV-003   | Gamma LLC      | 1600.00 | 2024-01-15 | 2024-02-14 | pending |
| INV-004   | Delta Partners | 3300.00 | 2024-01-20 | 2024-02-19 | overdue |

## Fields

Each invoice has:
- **invoiceNumber** (string, required, unique)
- **client** (string, required)
- **amount** (number, required, > 0)
- **issueDate** (string, YYYY-MM-DD)
- **dueDate** (string, YYYY-MM-DD)
- **status** (`pending` | `paid` | `overdue`)

## UI Layout

- Page heading: "Invoice Log"
- Summary bar: "Outstanding: $X.XX" — sum of amounts for pending + overdue invoices
- Status filter buttons: "All", "Pending", "Paid", "Overdue"
- Invoice list — each row shows: invoice number, client, amount (formatted as $X.XX), issue date, due date, status badge, Mark Paid button (only if status is not paid), Delete button
- Add Invoice form (always visible or toggled): Invoice # (text), Client (text), Amount (number), Issue Date (date), Due Date (date), Status (select), Add button

## Behaviors

1. **Add Invoice**: Clicking Add with valid invoice number, client, and amount > 0 appends the invoice.
2. **Mark Paid**: Clicking "Mark Paid" on a pending or overdue invoice changes its status to `paid`.
3. **Delete Invoice**: Removes the invoice immediately.
4. **Filter**: Shows only invoices matching the selected status. "All" shows all.
5. **Outstanding total**: Always reflects all invoices (not filtered), summing pending + overdue amounts.
6. **Form reset**: After adding, form fields clear.

## Edge Cases

- Duplicate invoice numbers: allowed (no uniqueness enforcement required).
- Submitting with empty invoice number, client, or amount <= 0 does nothing.
- If no invoices match filter, show "No invoices found."
