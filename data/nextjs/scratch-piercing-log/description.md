# Piercing Log

A single-page React app for logging piercings. Users can add piercings with location and date, update healing status, and delete entries.

## Seed Data

Start with these 4 piercings pre-loaded:

| id | location | date | healed | notes |
|----|----------|------|--------|-------|
| 1 | Left earlobe | 2023-03-15 | true | No issues |
| 2 | Nostril | 2023-08-22 | false | Still tender |
| 3 | Eyebrow | 2022-11-01 | true | Took 6 months |
| 4 | Navel | 2024-01-10 | false | Keep dry |

## Fields

- **location** (string): body location of the piercing (free text)
- **date** (string): date the piercing was done (YYYY-MM-DD format, date input)
- **healed** (boolean): whether healing is complete
- **notes** (string): optional care notes (free text)

## UI Behaviors

### Add Form
- Inputs for location, date, and notes (notes is optional).
- "Add Piercing" button adds a new entry with `healed: false`.
- After submission, clear all fields.
- If location or date is empty, do not submit.

### Healing Status Toggle
- Each piercing entry has a toggle (checkbox or button) to flip `healed`.
- When `healed` is true, display a badge/label with `data-testid="healed-badge"` on that card.

### Filter Tabs
- Two filter tabs: "All" and "Healing" (not yet healed).
- "All" shows every piercing.
- "Healing" shows only entries where `healed === false`.
- Active tab has `data-testid="active-tab"`.

### List
- Each piercing is a card with `data-testid="piercing-card"`.
- Show location, date, notes (if present), and healing badge if healed.
- Each card has a delete button that removes the entry.

### Summary
- Display total count and healed count: e.g. "3 healed / 4 total" with `data-testid="piercing-summary"`.

## Edge Cases

- Submitting with empty location or date is a no-op.
- Notes field is optional — empty notes should not display a notes section on the card.
- Deleting all entries leaves an empty list.
- Filtering to "Healing" when all are healed shows an empty list.
