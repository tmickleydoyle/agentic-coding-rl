# Donation Log

## Overview
A single-page React app to log individual donations with donor information, amounts, and date-based filtering.

## Seed Data
Start with these donation entries pre-loaded:

| ID | Donor Name    | Email                  | Amount | Cause       | Date       |
|----|---------------|------------------------|--------|-------------|------------|
| 1  | Alice Johnson | alice@example.com      | 50.00  | Education   | 2024-01-10 |
| 2  | Bob Smith     | bob@example.com        | 120.00 | Health      | 2024-02-05 |
| 3  | Carol Davis   | carol@example.com      | 75.00  | Education   | 2024-02-20 |
| 4  | Alice Johnson | alice@example.com      | 200.00 | Environment | 2024-03-01 |
| 5  | Dave Wilson   | dave@example.com       | 30.00  | Health      | 2024-03-15 |

## Fields
- **Donor Name** (text input)
- **Email** (email input): basic format required
- **Amount** (number input, min 0.01, step 0.01)
- **Cause** (select): one of "Education", "Health", "Environment", "Arts", "Other"
- **Date** (date input)

## Behaviors

### Add Donation
- Form with all fields above.
- "Log Donation" button submits.
- Validate: all fields filled, amount > 0, email contains "@". If invalid, do nothing.
- Prepend valid entry to top of list.
- Clear form after successful submit.

### Display List
- Show each donation: donor name, email, amount ($X.XX), cause, date.
- Each entry has a "Delete" button.
- Show "No donations logged." when empty.

### Date Filter
- Two date inputs labeled "From:" and "To:" to filter entries by date range.
- Only entries with date >= From AND date <= To are shown (inclusive).
- If From is empty, no lower bound. If To is empty, no upper bound.
- Filters affect only the displayed list, not the summary totals.

### Cause Filter
- A select labeled "Filter by cause" with "All" plus each cause option.
- Filters displayed list to matching cause. "All" shows everything.
- Can be combined with date filter (both apply simultaneously).

### Summary
- "Total Donations:" — count of ALL entries (unfiltered).
- "Total Amount:" — sum of ALL entries formatted $X.XX (unfiltered).
- "Unique Donors:" — count of distinct donor names across ALL entries.
- Summary updates live as entries are added/deleted.

## Edge Cases
- Amount 0 or negative: do not add.
- Email without "@": do not add.
- Both date filter and cause filter apply simultaneously.
- Deleting reduces all three summary counters appropriately.
- Unique donors count decreases only if the deleted entry was the only entry for that donor.
