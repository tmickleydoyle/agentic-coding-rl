# Warranty Tracker

A single-page React app to track product warranties and their expiry status.

## Seed Data

Start with these warranties pre-loaded:

| Product | Brand | Purchase Date | Warranty Years | Expiry Date | Notes |
|---------|-------|---------------|----------------|-------------|-------|
| 4K TV | Sony | 2022-06-01 | 2 | 2024-06-01 | Extended plan purchased |
| Washing Machine | Bosch | 2023-01-15 | 3 | 2026-01-15 | |
| Laptop | Dell | 2021-09-10 | 1 | 2022-09-10 | |
| Air Conditioner | Daikin | 2023-05-20 | 5 | 2028-05-20 | Parts only after year 2 |
| Microwave | Panasonic | 2020-11-03 | 2 | 2022-11-03 | |

## Fields

Each warranty entry has:
- **Product** (text, required)
- **Brand** (text, required)
- **Purchase Date** (date input)
- **Warranty Years** (number, min 1)
- **Expiry Date** (date input — user can set manually or it can be computed from purchase date + warranty years)
- **Notes** (text, optional)

## Behaviors

### Add Warranty
- A form with inputs for all fields
- "Add" button submits the form
- New warranty appears in the list
- Form clears after successful submission
- Product and Brand are required; do not add if either is empty

### Display
- Show all warranties in a table
- Columns: Product, Brand, Purchase Date, Expiry Date, Status, Notes
- Status is computed: if Expiry Date is in the past (before today) show "Expired", otherwise "Active"
- Display "Expired" and "Active" text in the status cell

### Delete
- Each row has a "Delete" button to remove the warranty

### Filter
- A toggle or dropdown to filter by Status: All, Active, Expired
- Filters the displayed rows

### Summary
- Show count of total warranties
- Show count of expired warranties

## Edge Cases
- Status is computed based on expiry date vs current date
- Deleting removes the item immediately
- Filter does not affect the summary totals
- Notes field can be left blank
- Product and Brand are trimmed before validation
