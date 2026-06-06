# Pet Care Log

A single-page app for tracking pet care activities.

## Seed Data

One pet: "Buddy" (a Dog).

Five pre-existing care log entries for Buddy:
- 2024-04-01 | Type: Feeding | Note: "Morning kibble"
- 2024-04-01 | Type: Walk | Note: "30 min park walk"
- 2024-04-02 | Type: Feeding | Note: "Evening kibble"
- 2024-04-02 | Type: Vet Visit | Note: "Annual checkup"
- 2024-04-03 | Type: Feeding | Note: "Morning kibble"

## Activity Types
Feeding, Walk, Grooming, Vet Visit, Play, Other

## UI Elements

- Page heading: "Pet Care Log"
- Pet name display (data-testid="pet-name"): "Buddy (Dog)"
- Activity type filter select (aria-label="Filter by type") with options: All, Feeding, Walk, Grooming, Vet Visit, Play, Other
- List of log entries (filtered). Each <li> has data-testid="care-entry" showing:
  date, type, and note. Format: "2024-04-01 | Feeding | Morning kibble"
- Entry count (data-testid="entry-count"): e.g. "5 entries" (reflects filtered count)
- Summary (data-testid="feeding-count"): total feeding entries across ALL entries (unfiltered).
  Format: "Feedings today: {n}" — actually "Total feedings: {n}"
- Form fields:
  - Label "Date" → date input (type="date")
  - Label "Activity Type" → select with all activity type options
  - Label "Note" → text input (optional)
  - Button "Log Activity"
- Button "Delete" (data-testid="delete-entry") on each entry

## Behaviors

### Log Activity
- Date required. If empty, does nothing.
- Appends entry; updates count and feeding summary; clears form (date and note reset to empty; type resets to "Feeding").

### Delete Entry
- Removes the entry; updates count and feeding summary.

### Filter
- Filters displayed entries by type. "All" shows all.
- entry-count reflects filtered count.
- feeding-count always shows total feedings from ALL entries.

### feeding-count
- Count of all entries where type === "Feeding" (unfiltered).
- Seed: 3 feeding entries.

## Edge Cases
- Adding a non-feeding activity does not change feeding-count.
- Deleting a feeding entry decreases feeding-count.
