# Charity Tracker

## Overview
A single-page React app to track donations made to multiple charities, with category filtering and totals.

## Seed Data
Start with these charity donation records pre-loaded:

| ID | Charity              | Category    | Amount  | Date       |
|----|----------------------|-------------|---------|------------|
| 1  | Red Cross            | Disaster    | 100.00  | 2024-01-15 |
| 2  | Local Food Bank      | Hunger      | 50.00   | 2024-02-01 |
| 3  | Animal Rescue League | Animals     | 75.00   | 2024-02-14 |
| 4  | Red Cross            | Disaster    | 200.00  | 2024-03-01 |
| 5  | UNICEF               | Children    | 150.00  | 2024-03-10 |

## Fields
- **Charity** (text input): name of the charity
- **Category** (select): one of "Disaster", "Hunger", "Animals", "Children", "Education", "Other"
- **Amount** (number input, min 0.01, step 0.01): donation amount in USD
- **Date** (date input): donation date

## Behaviors

### Add Donation
- Form with inputs for Charity, Category, Amount, Date.
- "Add Donation" button submits the form.
- Validate: all fields filled, amount > 0. If invalid, do nothing.
- Valid donation prepended to top of list.
- Clear form after successful submit.

### Display List
- Show all donations. Each entry shows charity name, category, amount (formatted as $X.XX), and date.
- Each entry has a "Remove" button to delete it.
- Show "No donations recorded." when list is empty.

### Filter by Category
- A select dropdown labeled "Filter by category" with options: "All", "Disaster", "Hunger", "Animals", "Children", "Education", "Other".
- Selecting a category filters the displayed list to matching entries.
- "All" shows everything.
- Filter does NOT affect the total donated summary.

### Summary
- Display total donated across ALL records (not filtered) labeled "Total Donated:".
- Display per-charity totals: for each unique charity, show name and total donated (formatted $X.XX).
- Summary updates live.

## Edge Cases
- Amount of 0 or negative: do not add.
- Removing all entries of a charity removes it from per-charity summary.
- Category filter resets to "All" is valid default.
- Amounts always shown with 2 decimal places.
