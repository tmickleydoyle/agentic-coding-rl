# Utility Bills Tracker

A single-page app for tracking and managing household utility bills.

## Seed Data

Pre-load these 5 bills on mount:

| Date       | Utility     | Amount ($) | Status  |
|------------|-------------|------------|---------|
| 2024-05-15 | Electric    | 87.50      | Paid    |
| 2024-05-18 | Water       | 34.20      | Paid    |
| 2024-06-01 | Electric    | 92.00      | Unpaid  |
| 2024-06-05 | Internet    | 59.99      | Unpaid  |
| 2024-06-10 | Gas         | 45.00      | Unpaid  |

## Fields

- **Date** (date input, required)
- **Utility** (select: "Electric" | "Water" | "Gas" | "Internet" | "Trash", required)
- **Amount** (number input, required, min 0.01)
- **Status** (select: "Unpaid" | "Paid", default "Unpaid")

## Behaviors

### Add Bill
- Form with Date, Utility, Amount, Status and "Add Bill" button.
- On submit: validate Date and Amount are filled; if missing show "Date and amount are required".
- Amount must be > 0; if 0 or negative show "Amount must be greater than zero".
- On valid submit: add bill to list, clear form (Utility resets to "Electric", Status to "Unpaid").

### Bill List
- Display bills sorted by date descending.
- Each row shows: date, utility, amount formatted as "$XX.XX", status badge.
- Each bill has a "Mark Paid" button (disabled / not shown if already Paid) and a "Delete" button.
- Clicking "Mark Paid" sets that bill's status to "Paid".

### Summary Panel
- Total amount of all bills formatted as "$X.XX".
- Total amount of unpaid bills formatted as "$X.XX".
- Count of unpaid bills.

### Status Filter
- Radio buttons or select for "All" | "Paid" | "Unpaid" to filter displayed bills.
- Stats always reflect all bills regardless of filter.

## Edge Cases
- Marking all bills as paid shows 0 unpaid count and "$0.00" unpaid total.
- Deleting a paid bill still updates summary correctly.
- Adding a bill with Paid status immediately reflects in stats.
