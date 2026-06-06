# Vote Record Manager

A single-page voter record manager that lets poll workers add voter entries, filter by precinct, and mark individual ballots as counted.

## Seed Data

Start with the following voter records pre-loaded:

| ID  | Name            | Precinct | Counted |
|-----|-----------------|----------|---------|
| 1   | James Okafor    | 4A       | false   |
| 2   | Priya Sharma    | 2B       | true    |
| 3   | Luis Delgado    | 4A       | false   |
| 4   | Sandra Kowalski | 3C       | true    |
| 5   | Tommy Nguyen    | 2B       | false   |

## UI Layout

- Page heading: "Vote Record Manager"
- A stats bar showing: total records, counted count, uncounted count
- A filter control: a text input labeled "Filter by Precinct" (filters as user types)
- The voter record list — each row shows:
  - Voter name
  - Precinct
  - A "Counted" checkbox (checked if counted = true)
  - A "Remove" button to delete the record
- An "Add Voter" form with:
  - Text input for Name (placeholder "Voter name")
  - Text input for Precinct (placeholder "Precinct (e.g. 4A)")
  - A submit button labeled "Add Voter"

## Behaviors

### Filtering
- The precinct filter is case-insensitive.
- Filtering updates the visible list in real time without removing records.
- The stats bar always reflects ALL records, not just filtered ones.

### Marking as Counted
- Toggling the checkbox on a row updates that voter's counted status.
- The stats bar updates immediately.

### Adding a Voter
- Both Name and Precinct are required; if either is blank, do nothing.
- On success: append the new voter with counted = false, auto-increment ID, clear both inputs.
- New records are visible immediately and subject to the current filter.

### Removing a Voter
- Clicking "Remove" deletes that record from the list and updates the stats bar.

## data-testid Attributes

- `"total-count"` — total records count
- `"counted-count"` — number of counted records
- `"uncounted-count"` — number of uncounted records
- `"precinct-filter"` — the filter text input
- `"voter-row"` — each voter row (rendered count depends on filter)
- `"voter-name"` — voter name inside a row
- `"voter-precinct"` — precinct inside a row
- `"counted-checkbox"` — the counted checkbox inside a row
- `"remove-btn"` — remove button inside a row
- `"name-input"` — the name text input in the Add form
- `"precinct-input"` — the precinct text input in the Add form
- `"add-voter-btn"` — the submit button

## Edge Cases

- Filter "4A" should show only James Okafor and Luis Delgado from seed data.
- Removing a record while a filter is active should not reset the filter.
- Stats bar always reflects total dataset, not the filtered view.
- Adding a voter with a precinct that matches the current filter makes it immediately visible.
