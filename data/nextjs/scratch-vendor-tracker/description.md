# Wedding Vendor Tracker

A single-page React app for tracking wedding vendors, their contact info, contract status, and payments.

## Seed Data

| id | name                 | category      | contact          | phone          | contractSigned | totalCost | amountPaid |
|----|----------------------|---------------|------------------|----------------|----------------|-----------|------------|
| 1  | Grand Ballroom Venue | Venue         | Jane Doe         | 555-1001       | true           | 8000      | 4000       |
| 2  | Gourmet Catering Co  | Catering      | Tom Chef         | 555-2002       | true           | 5000      | 2500       |
| 3  | Clicks Photography   | Photography   | Sara Lens        | 555-3003       | false          | 3000      | 0          |
| 4  | Beats DJ Services    | Entertainment | Mike Spin        | 555-4004       | true           | 1500      | 1500       |
| 5  | Bloom Florals        | Flowers       | Amy Bloom        | 555-5005       | false          | 2000      | 500        |

## Fields

Each vendor has:
- id (number)
- name (string)
- category (string)
- contact (string)
- phone (string)
- contractSigned (boolean)
- totalCost (number)
- amountPaid (number)

## UI Layout

- Page heading: "Vendor Tracker"
- Summary: "Total Budget: $X | Total Paid: $Y | Balance: $Z"
  where X = sum of all totalCost, Y = sum of all amountPaid, Z = X - Y
  Format as dollar amounts with no decimals (e.g. "$19500")
- Filter buttons: "All", "Contract Pending", "Contract Signed"
  data-testid: "filter-all", "filter-contract-pending", "filter-contract-signed"
- Summary bar data-testid="summary"
- Vendor cards (not a table), each with data-testid="vendor-card-{id}"
  - Shows: name (as heading), category, contact name, phone
  - Contract badge: "Signed" or "Pending", data-testid="contract-badge-{id}"
  - "Total: $X | Paid: $Y | Balance: $Z" per vendor, data-testid="vendor-balance-{id}"
  - "Edit" button data-testid="edit-btn-{id}"
  - "Delete" button data-testid="delete-btn-{id}"
- "Add Vendor" button data-testid="add-vendor-btn"
- Inline form with fields: Name, Category, Contact, Phone, Total Cost (number input), Amount Paid (number input), Contract Signed (checkbox)
- Form has "Save" and "Cancel" buttons
- data-testid="vendor-form"

## Behaviors

- Filter "Contract Pending" shows only vendors with contractSigned = false
- Filter "Contract Signed" shows only vendors with contractSigned = true
- "All" shows all vendors
- "Delete" removes vendor; summary updates immediately
- "Edit" opens form pre-filled with vendor data; save updates vendor
- "Add Vendor" opens empty form; save adds new vendor
- Name required to save
- Summary totals always reflect full list (not filtered view)
- amountPaid cannot exceed totalCost (clamp on save)

## Edge Cases

- New vendor id = max existing id + 1
- Balance per vendor = totalCost - amountPaid
- Cancel closes form without changes
- If amountPaid > totalCost on save, set amountPaid = totalCost
