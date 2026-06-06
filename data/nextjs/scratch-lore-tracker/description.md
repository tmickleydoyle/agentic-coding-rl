# Lore Tracker

A single-page React app for tracking worldbuilding lore entries. Users can add lore entries with types and descriptions, mark entries as favorites, and filter by type or favorites.

## Seed Data

Four pre-loaded lore entries:
1. id: 1, Name: "The Sunstone", Type: "Artifact", Description: "A gemstone that glows with the power of the sun", Favorite: true
2. id: 2, Name: "Elyndria", Type: "Location", Description: "A mystical forest realm inhabited by ancient elves", Favorite: false
3. id: 3, Name: "Voryn the Betrayer", Type: "Character", Description: "A fallen paladin who turned to dark magic", Favorite: true
4. id: 4, Name: "The Sundering", Type: "Event", Description: "The cataclysm that split the world into four continents", Favorite: false

## Fields per Entry
- `id`: unique number
- `name`: string
- `type`: "Artifact" | "Location" | "Character" | "Event"
- `description`: string
- `favorite`: boolean

## UI Layout

### Header
- `<h1>` with text "Lore Tracker"
- Stats: total entries (`data-testid="total-entries"`), favorites count (`data-testid="favorites-count"`)

### Filters
- Type filter dropdown (`data-testid="type-filter"`), options: "All", "Artifact", "Location", "Character", "Event"; default "All"
- Favorites toggle button: "Show Favorites Only" / "Show All" (`data-testid="favorites-filter-btn"`)
- Both filters apply together (AND logic): when favorites-only is on AND type is "Artifact", show only favorite artifacts

### Add Entry Form
- Text input for name (`data-testid="entry-name-input"`)
- Select for type (`data-testid="entry-type-input"`), options: Artifact, Location, Character, Event; default "Artifact"
- Textarea for description (`data-testid="entry-description-input"`)
- Submit button "Add Entry" (`data-testid="add-entry-btn"`)
- Validation: name and description both required (non-empty after trim)
- All fields clear after successful submission

### Entry List
- Shows entries matching active filters
- Each entry: `data-testid="entry-card-{id}"`
- Name: `data-testid="entry-name-{id}"`
- Type badge: `data-testid="entry-type-{id}"`
- Description: `data-testid="entry-description-{id}"`
- Favorite status: `data-testid="entry-favorite-{id}"` shows "Favorite" or "Not Favorite"
- Favorite toggle button: "Remove Favorite" if favorite, "Add Favorite" if not (`data-testid="favorite-toggle-{id}"`)
- Delete button: `data-testid="delete-entry-{id}"`

## Behaviors

- Stats (total entries, favorites count) always reflect ALL entries regardless of filters
- Type filter limits displayed entries to matching type; "All" shows all types
- Favorites-only filter shows only entries where favorite is true; when off, shows all
- Both filters applied together with AND logic
- Toggling favorite flips the boolean; button text, status text, and favorites-count update
- Deleting removes the entry; total-entries and possibly favorites-count update
- New entries added as non-favorites

## Edge Cases
- Name with only whitespace is invalid
- Description with only whitespace is invalid
- An entry can be a favorite AND match a type filter simultaneously
- Deleting a favorite decrements favorites-count
- If no entries match filters, list is empty (no error shown)
