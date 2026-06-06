# Open House Log

A single-page app for logging open house visits while house hunting.

## Seed Data

Three pre-loaded visits:

| id | address | date | agent | rating | notes |
|----|---------|------|-------|--------|-------|
| 1 | 123 Maple St | 2024-03-02 | Sarah Johnson | 4 | Great natural light, small backyard |
| 2 | 456 Oak Ave | 2024-03-09 | Mike Chen | 3 | Nice kitchen but noisy street |
| 3 | 789 Pine Rd | 2024-03-16 | Lisa Park | 5 | Perfect layout, large yard, quiet neighborhood |

## Add Visit Form

Fields:
- **Address** (text input, required) — label "Address"
- **Date** (date input, required) — label "Date"
- **Agent Name** (text input, required) — label "Agent Name"
- **Rating** (number input, 1–5, required) — label "Rating (1-5)"
- **Notes** (textarea, optional) — label "Notes"
- Submit button labeled "Add Visit"

On submit with all required fields filled: adds new entry, clears form.
If any required field is empty, show "Please fill in all required fields" (data-testid="form-error"), do not add.

## Visit Cards

- Each visit rendered as a card, data-testid="visit-card".
- Shows address, date (YYYY-MM-DD), agent name, star rating (display as "★★★★☆" etc.), and notes.
- data-testid="visit-rating-{id}" for the star display.
- Delete button per card (data-testid="delete-visit-{id}") removes that visit.

## Sorting

- Sort dropdown (data-testid="sort-select") with options: "Date (Newest)", "Date (Oldest)", "Rating (High)", "Rating (Low)".
- Default: "Date (Newest)".
- Sorting is applied to displayed list immediately on change.

## Edge Cases

- Rating outside 1–5 (e.g. 0 or 6) is considered invalid — treat as empty required field.
- After deleting all visits, show "No visits logged yet" (data-testid="empty-state").
- Notes field is optional; if empty, no notes section rendered.
