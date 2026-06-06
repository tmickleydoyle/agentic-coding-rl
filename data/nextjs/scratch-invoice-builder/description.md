# Invoice Builder

Build a single-page invoice builder app where users can compose a client invoice with line items and see a live total.

## Seed Data

Start with these line items pre-loaded:

| Description      | Qty | Unit Price |
|------------------|-----|------------|
| Web Design       |  2  |   500.00   |
| Logo Design      |  1  |   250.00   |

Client name defaults to "Acme Corp". Invoice number defaults to "INV-001".

## Fields

- **Client Name** (text input, aria-label="Client Name")
- **Invoice Number** (text input, aria-label="Invoice Number")
- **Line items table** with columns: Description, Qty, Unit Price, Line Total, Remove
  - Each row: text input for description (aria-label="Description {i}"), number input for qty (aria-label="Qty {i}"), number input for unit price (aria-label="Unit Price {i}")
  - Line Total = Qty * Unit Price, displayed as `$X.XX`
  - Remove button per row (aria-label="Remove {i}")
- **Add Item** button: appends a blank line item (description="", qty=1, price=0)
- **Subtotal** display: sum of all line totals, shown as `$X.XX` (data-testid="subtotal")
- **Tax Rate** number input (aria-label="Tax Rate", default 10, represents percent)
- **Tax Amount** display: subtotal * taxRate / 100, shown as `$X.XX` (data-testid="tax-amount")
- **Total** display: subtotal + tax, shown as `$X.XX` (data-testid="invoice-total")

## Behaviors

- Changing qty or unit price of any row immediately updates that row's line total and all summary values.
- Removing a row recalculates all totals.
- Adding a new row starts with qty=1, price=0, contributing $0.00 to totals until edited.
- Changing tax rate immediately updates tax amount and total.
- All currency values display exactly two decimal places.
- Line items are displayed in a list; each item has data-testid="line-item".
- Each row index i is 1-based for aria-labels.

## Edge Cases

- If all items are removed, subtotal = $0.00, tax = $0.00, total = $0.00.
- Fractional quantities are allowed (e.g. 1.5 hours).
- Tax rate of 0 means no tax added.
