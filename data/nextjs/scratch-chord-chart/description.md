# Chord Chart Reference

Build a single-page React app that displays a chord chart reference library. Users can browse chords, filter by key, and mark favorites.

## Seed Data

Start with these chords pre-loaded:

```
id: 1, name: "C Major", key: "C", type: "Major", notes: "C E G", difficulty: "beginner"
id: 2, name: "G Major", key: "G", type: "Major", notes: "G B D", difficulty: "beginner"
id: 3, name: "Am", key: "A", type: "Minor", notes: "A C E", difficulty: "beginner"
id: 4, name: "F Major", key: "F", type: "Major", notes: "F A C", difficulty: "intermediate"
id: 5, name: "Dm", key: "D", type: "Minor", notes: "D F A", difficulty: "beginner"
id: 6, name: "Em", key: "E", type: "Minor", notes: "E G B", difficulty: "beginner"
id: 7, name: "B7", key: "B", type: "Dominant", notes: "B D# F# A", difficulty: "intermediate"
id: 8, name: "Cmaj7", key: "C", type: "Major7", notes: "C E G B", difficulty: "intermediate"
```

## Fields

Each chord has:
- `id` (number) — unique identifier
- `name` (string) — chord name
- `key` (string) — root key (A-G)
- `type` (string) — chord type
- `notes` (string) — notes in the chord
- `difficulty` (string) — "beginner" | "intermediate" | "advanced"
- `favorite` (boolean) — whether the user has favorited it (default false)

## Behaviors

### Chord List
- Display all chords in a grid/list. Each card shows: name, key, type, notes, difficulty.
- Each chord card has a data-testid of `chord-card-{id}`.

### Favorite Toggle
- Each chord card has a "Favorite" button (data-testid="favorite-btn-{id}").
- Clicking toggles the `favorite` field.
- Favorited chords display a visual indicator — the button text changes to "Unfavorite".

### Filter by Key
- A select dropdown (data-testid="filter-key") with options: "All", "A", "B", "C", "D", "E", "F", "G".
- When a key is selected, only chords with that root key are shown.

### Filter by Difficulty
- A select dropdown (data-testid="filter-difficulty") with options: "All", "beginner", "intermediate", "advanced".
- When selected, only chords with that difficulty are shown.

### Stats
- Display the count of visible chords with data-testid="visible-count".
- Display the count of favorited chords (all, not filtered) with data-testid="favorite-count".

### Add Chord
- A form with fields: name (text), key (text), type (text), notes (text), difficulty (select: beginner/intermediate/advanced).
- Submit button labeled "Add Chord".
- On submit: append the new chord (favorite defaults to false), clear the form.
- If name or key is empty, do not add.

## Edge Cases
- Combining key and difficulty filters: both must match.
- Favorites count is always total favorites regardless of active filters.
