# Volunteer Log

## Overview
A single-page React app to log and track volunteer hours for individuals across multiple activities.

## Seed Data
Start with these volunteer entries pre-loaded:

| ID | Name         | Activity          | Hours | Date       |
|----|--------------|-------------------|-------|------------|
| 1  | Alice Johnson | Park Cleanup      | 3     | 2024-03-01 |
| 2  | Bob Smith     | Food Bank         | 5     | 2024-03-05 |
| 3  | Alice Johnson | Tutoring          | 2     | 2024-03-10 |
| 4  | Carol Davis   | Park Cleanup      | 4     | 2024-03-12 |
| 5  | Bob Smith     | Animal Shelter    | 6     | 2024-03-15 |

## Fields
- **Name** (text input): volunteer's full name
- **Activity** (text input): name of the volunteer activity
- **Hours** (number input, min 0.5, step 0.5): hours spent
- **Date** (date input): date of the volunteer work

## Behaviors

### Add Entry
- Form with inputs for Name, Activity, Hours, Date.
- "Add Entry" button submits the form.
- On submit: validate all fields are filled and hours > 0. If invalid, do nothing.
- Valid entry is prepended to the top of the list.
- Clear the form after successful submit.

### Display List
- Show all entries in a list. Each entry displays name, activity, hours, and date.
- Each entry has a "Delete" button. Clicking it removes that entry.
- Show a "No entries yet." message when the list is empty.

### Filter by Volunteer
- A text input labeled "Filter by name" filters the list to show only entries where the volunteer name contains the filter text (case-insensitive).
- Filtering does not affect the total hours summary.

### Summary
- Display total hours across ALL entries (not filtered) labeled "Total Hours:".
- Display a per-volunteer summary: for each unique volunteer name, show their name and total hours.
- Summary updates live as entries are added or deleted.

## Edge Cases
- If hours field is 0 or negative, do not add the entry.
- Deleting the last entry of a volunteer removes them from the per-volunteer summary.
- Filter by name with empty string shows all entries.
- Hours displayed with one decimal place (e.g., 3.0, 5.5).
