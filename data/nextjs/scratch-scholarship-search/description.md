# Scholarship Search

A single-page React app to browse, search, and track scholarship opportunities.

## Seed Data

Start with these 5 scholarships pre-loaded:

| Name | Amount | Deadline | Category | Applied |
|------|--------|----------|----------|---------|
| Gates Millennium | 10000 | 2024-01-15 | STEM | false |
| Coca-Cola Scholars | 20000 | 2024-02-01 | General | false |
| NSF Graduate Fellowship | 34000 | 2024-10-15 | STEM | true |
| Hispanic Scholarship Fund | 5000 | 2024-03-01 | Diversity | false |
| Rhodes Scholarship | 50000 | 2024-09-30 | General | true |

## Fields

Each scholarship has:
- **name** (string): Scholarship name
- **amount** (number): Award amount in dollars
- **deadline** (string): Date (YYYY-MM-DD)
- **category** (string): One of "STEM", "General", "Diversity", "Arts", "Athletics"
- **applied** (boolean): Whether the user has applied

## Layout

- Page heading: "Scholarship Search"
- Search input and category filter
- Summary counts
- Scholarship list

## Search & Filter

- Text input labeled "Search" (data-testid="input-search"): filters scholarships by name (case-insensitive substring match) as the user types
- Select labeled "Category" (data-testid="select-category"): filters by category. Default option is "All Categories" with value ""

Both filters apply simultaneously.

## Add Form

- Text input labeled "Name" (data-testid="input-name")
- Number input labeled "Amount" (data-testid="input-amount")
- Date input labeled "Deadline" (data-testid="input-deadline")
- Select labeled "Category" for the new scholarship (data-testid="select-new-category") with options: STEM, General, Diversity, Arts, Athletics
- Submit button "Add Scholarship" (data-testid="btn-add")

Validation: name is required and amount must be > 0. Show error with data-testid="error-message" if invalid. Clear form on success.

## Scholarship List

Each scholarship rendered with:
- data-testid="scholarship-item" on the container
- data-testid="scholarship-name" showing name
- data-testid="scholarship-amount" showing dollar amount
- data-testid="scholarship-deadline" showing deadline
- data-testid="scholarship-category" showing category
- A toggle button with data-testid="btn-toggle-applied" — shows "Mark Applied" if not applied, "Unmark" if applied
- A "Delete" button with data-testid="btn-delete"

## Summary

- data-testid="count-total": total scholarships (not filtered)
- data-testid="count-applied": number marked as applied
- data-testid="total-potential": sum of amounts for non-applied scholarships, formatted with $ sign (e.g. "$35000")

## Edge Cases

- Search filters in real time
- Category filter + search work together
- Toggle applied updates count-applied and total-potential
- Delete removes scholarship and updates counts
