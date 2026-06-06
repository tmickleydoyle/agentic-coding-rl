# Setlist Builder

Build a single-page React app for building and managing a music setlist for a performance. Users can add songs, reorder them, and view total duration.

## Seed Data

Start with these songs pre-loaded:

```
id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: 354, key: "Bb"
id: 2, title: "Hotel California", artist: "Eagles", duration: 391, key: "Bm"
id: 3, title: "Stairway to Heaven", artist: "Led Zeppelin", duration: 482, key: "Am"
id: 4, title: "Sweet Child O' Mine", artist: "Guns N' Roses", duration: 356, key: "D"
id: 5, title: "Smells Like Teen Spirit", artist: "Nirvana", duration: 301, key: "Fm"
```

## Fields

Each song has:
- `id` (number) — unique identifier
- `title` (string) — song title
- `artist` (string) — performing artist
- `duration` (number) — duration in seconds
- `key` (string) — musical key

## Behaviors

### Song List
- Display songs in order (their position in the setlist). Each item shows: position number (1-based), title, artist, key, and formatted duration (M:SS format).
- Each item has data-testid="song-item-{id}".

### Duration Formatting
- Convert seconds to M:SS format. e.g. 354 seconds = "5:54", 301 = "5:01".

### Add Song
- A form with fields: title (text), artist (text), duration in seconds (number), key (text).
- Submit button labeled "Add Song".
- On submit: append the song to the end of the setlist with a new id, clear the form.
- If title or duration is empty/zero, do not add.

### Remove Song
- Each song item has a "Remove" button (data-testid="remove-btn-{id}") that removes it from the setlist.

### Reorder — Move Up / Move Down
- Each song item has a "Move Up" button (data-testid="move-up-{id}") that swaps it with the song above.
- Each song item has a "Move Down" button (data-testid="move-down-{id}") that swaps it with the song below.
- The first song's "Move Up" button is disabled. The last song's "Move Down" button is disabled.

### Total Duration
- Display the total setlist duration formatted as "Xm Ys" (e.g. "31m 24s") with data-testid="total-duration".
- Display the song count with data-testid="song-count".

## Edge Cases
- After removing a song, positions renumber correctly.
- Moving the only song has both buttons disabled.
- Empty setlist: total duration shows "0m 0s", song count shows 0.
