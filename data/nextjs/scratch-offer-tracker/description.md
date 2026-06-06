# Offer Tracker

A single-page app to track offers made on properties during home buying.

## Seed Data

Three pre-loaded offers:

| id | address | offerPrice | listPrice | date | status | contingencies |
|----|---------|-----------|-----------|------|--------|---------------|
| 1 | 123 Maple St | 460000 | 450000 | 2024-03-05 | Pending | Inspection, Financing |
| 2 | 456 Oak Ave | 315000 | 320000 | 2024-03-08 | Rejected | None |
| 3 | 789 Pine Rd | 680000 | 675000 | 2024-03-12 | Accepted | Inspection |

## Add Offer Form

Fields:
- **Address** (text input, required) — label "Address"
- **Offer Price** (number input, required) — label "Offer Price"
- **List Price** (number input, required) — label "List Price"
- **Date** (date input, required) — label "Date"
- **Status** (select, required) — label "Status", options: "Pending", "Accepted", "Rejected", "Countered"
- **Contingencies** (text input, optional) — label "Contingencies"
- Submit button "Add Offer"

On submit with all required fields: adds offer, clears form.
Missing required fields: show "Please fill in all required fields" (data-testid="form-error").

## Offer Cards

- Each offer has data-testid="offer-card-{id}".
- Displays: address, offer price ($XXX,XXX), list price ($XXX,XXX), date, status badge, contingencies.
- Status badge data-testid="status-badge-{id}".
- Price difference shown as "+$X,XXX over ask" or "-$X,XXX under ask" (data-testid="price-diff-{id}").
- Delete button data-testid="delete-offer-{id}".

## Filter by Status

- Filter buttons: "All", "Pending", "Accepted", "Rejected", "Countered" (data-testid="filter-{status}").
- "All" is active by default.
- Active filter button has data-testid="active-filter".

## Summary Stats

- data-testid="total-offers" — total number of offers.
- data-testid="accepted-count" — number accepted.
- data-testid="avg-offer" — average offer price formatted $XXX,XXX.

## Edge Cases

- Offer price equal to list price: show "$0 at ask" or just "$0".
- After filtering, stats reflect ALL offers (not filtered).
- Empty contingencies field displays "None".
