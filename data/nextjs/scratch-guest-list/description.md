# Wedding Guest List

A single-page React app for managing the wedding guest list with RSVP tracking and meal preferences.

## Seed Data

Pre-load the following guests:

| id | name             | email                      | rsvp       | meal       | plusOne |
|----|------------------|----------------------------|------------|------------|---------|
| 1  | Alice Johnson    | alice@example.com          | confirmed  | chicken    | true    |
| 2  | Bob Smith        | bob@example.com            | pending    | vegetarian | false   |
| 3  | Carol White      | carol@example.com          | confirmed  | fish       | true    |
| 4  | David Brown      | david@example.com          | declined   | chicken    | false   |
| 5  | Emma Davis       | emma@example.com           | pending    | vegetarian | false   |
| 6  | Frank Miller     | frank@example.com          | confirmed  | chicken    | true    |

## Fields

Each guest has:
- id (number)
- name (string)
- email (string)
- rsvp: "confirmed" | "pending" | "declined"
- meal: "chicken" | "fish" | "vegetarian"
- plusOne (boolean)

## UI Layout

- Page heading: "Guest List"
- Stats bar showing: "Total: N | Confirmed: N | Pending: N | Declined: N"
- Search input (placeholder "Search guests...") with aria-label "Search guests"
- Filter buttons: "All", "Confirmed", "Pending", "Declined"
- Guest table with columns: Name, Email, RSVP, Meal, Plus One, Actions
- Each row has data-testid="guest-row-{id}"
- RSVP cell has data-testid="rsvp-{id}" showing the rsvp value
- Meal cell has data-testid="meal-{id}"
- Plus One cell shows "Yes" or "No", data-testid="plusone-{id}"
- "Edit" button per row, data-testid="edit-btn-{id}"
- "Remove" button per row, data-testid="remove-btn-{id}"
- "Add Guest" button, data-testid="add-guest-btn"
- Inline add/edit form with fields: Name, Email, RSVP (select), Meal (select), Plus One (checkbox)
- Form has "Save" and "Cancel" buttons
- Stats bar has data-testid="stats"

## Behaviors

- Search filters guests by name (case-insensitive, partial match)
- RSVP filter buttons restrict to that status; "All" shows all
- Search and filter work together (both conditions must be met)
- "Remove" deletes the guest from the list
- "Edit" populates the form with guest data; saving updates the guest
- "Add Guest" opens an empty form; saving appends new guest
- Stats counts always reflect current list (not filtered view)
- Plus One count not in stats bar
- Total attendance = confirmed guests + confirmed guests with plusOne (each confirmed+plusOne adds 2)

## Edge Cases

- Search with no matches shows empty table (no rows)
- Removing a guest updates stats immediately
- New guest id = max existing id + 1
- Name is required to save; empty name does nothing
- Filter and search persist when editing/adding
