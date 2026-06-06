# Tasting Notes Journal

A single-page React app for writing, editing, deleting, and searching personal tasting notes for any beverage.

## Seed Data

The app starts with these tasting notes pre-loaded:

| Beverage | Producer | Vintage | Score | Notes |
|----------|----------|---------|-------|-------|
| Barolo | Giacomo Conterno | 2016 | 96 | Tar and roses, iron minerality, incredible length on the finish |
| Burgundy Pinot Noir | Domaine Leroy | 2017 | 98 | Ethereal, pure red fruit, silky tannins, haunting finish |
| Islay Scotch | Ardbeg Uigeadail | N/A | 90 | Peat smoke, dark chocolate, espresso, dried fruit |

(Vintage "N/A" is stored as the string "N/A".)

## Fields

Each note has:
- **id** (number): unique identifier
- **beverage** (string): the drink name
- **producer** (string): winery, distillery, or brewery
- **vintage** (string): year or "N/A"
- **score** (number): 0–100
- **notes** (string): free-form tasting text

## UI Layout

- Page heading: "Tasting Notes"
- Search bar: text input labeled "Search notes" — filters entries by keyword (case-insensitive match against beverage, producer, or notes text)
- Add note form with inputs: Beverage, Producer, Vintage, Score (number 0–100), Notes (textarea)
- Submit button "Add Note"
- Notes list: each entry as a card with all fields shown plus Edit and Delete buttons
- Edit mode: clicking Edit on a card replaces the card with an inline edit form pre-filled with that entry's values; Save and Cancel buttons

## Behaviors

1. **Search**: Typing in search filters visible cards in real time. Matches against beverage, producer, and notes fields (case-insensitive).
2. **Add Note**: Submitting the form appends a new note with a unique incrementing id. Form resets after save.
3. **Delete**: Clicking Delete removes the note permanently.
4. **Edit**: Clicking Edit shows an inline form pre-populated. Clicking Save updates that note. Clicking Cancel discards changes.
5. **Empty guard**: Clicking "Add Note" with empty Beverage or Notes fields does nothing.
6. **Score display**: Shown as "{score}/100" in the card.

## Data-testids

- `notes-list` — container for all note cards
- `note-card` — each note card
- `note-beverage` — beverage name in card
- `note-producer` — producer in card
- `note-vintage` — vintage in card
- `note-score` — score in card (formatted as "{n}/100")
- `note-notes` — notes text in card
- `edit-note` — Edit button on each card
- `delete-note` — Delete button on each card
- `save-edit` — Save button in inline edit form
- `cancel-edit` — Cancel button in inline edit form
- `search-input` — search bar input
- `input-beverage` — Beverage input in add form
- `input-producer` — Producer input
- `input-vintage` — Vintage input
- `input-score` — Score input
- `input-notes` — Notes textarea
- `submit-note` — Add Note button

## Edge Cases

- Search with no matches shows an empty list (no cards).
- Editing does not affect other cards.
- Deleting while a search is active removes the note from filtered results.
- Score of 100 displays "100/100".
