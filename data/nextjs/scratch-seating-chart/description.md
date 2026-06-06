# Wedding Seating Chart

A single-page React app for managing wedding table seating assignments.

## Seed Data

Tables:
| id | name          | capacity |
|----|---------------|----------|
| 1  | Head Table    | 6        |
| 2  | Family Table  | 8        |
| 3  | Friends Table | 8        |
| 4  | Coworkers     | 6        |

Guests (confirmed guests from the guest list):
| id | name           | tableId |
|----|----------------|---------|
| 1  | Alice Johnson  | 1       |
| 2  | Bob Smith      | null    |
| 3  | Carol White    | 1       |
| 4  | David Brown    | 2       |
| 5  | Emma Davis     | null    |
| 6  | Frank Miller   | 2       |
| 7  | Grace Lee      | 3       |
| 8  | Henry Wilson   | null    |

## Fields

Table:
- id (number)
- name (string)
- capacity (number)

Guest:
- id (number)
- name (string)
- tableId (number | null) — null means unassigned

## UI Layout

- Page heading: "Seating Chart"
- "Unassigned Guests" section listing guests with tableId === null
  - Section heading "Unassigned Guests", data-testid="unassigned-section"
  - Each guest shown as a row: name + assign dropdown (select of table names) + "Assign" button
  - Guest row: data-testid="unassigned-guest-{id}"
  - Assign button: data-testid="assign-btn-{id}"
  - Table select: data-testid="assign-select-{id}"
- Tables section: each table has data-testid="table-card-{id}"
  - Table heading showing name and "(X/Y)" where X = assigned guests count, Y = capacity
  - data-testid="table-heading-{id}" with text "{name} (X/Y)"
  - List of assigned guests, each data-testid="table-guest-{tableId}-{guestId}"
  - "Remove" button next to each assigned guest, data-testid="remove-btn-{guestId}"
- "Add Table" button, data-testid="add-table-btn"
- Inline form with: Table Name (text), Capacity (number), data-testid="table-form"
  - "Save" and "Cancel" buttons
- Summary bar: "Total Seats: X | Assigned: Y | Unassigned: Z", data-testid="seating-summary"

## Behaviors

- Selecting a table from the assign dropdown and clicking "Assign" moves a guest to that table
- Assigning a guest when table is at capacity does nothing (no assignment)
- "Remove" unassigns a guest (sets tableId to null), moving them back to the unassigned list
- Summary counts update reactively
- "Add Table" opens form; saving adds a new table (empty, no guests)
- Table Name required; capacity must be > 0
- Tables are always shown even if empty

## Edge Cases

- New table id = max existing id + 1
- After assigning, guest disappears from unassigned section
- After removing, guest reappears in unassigned section
- Cannot assign to a full table (current assigned === capacity)
- Cancel closes form without adding table
