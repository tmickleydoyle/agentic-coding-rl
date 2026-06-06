# Note Taker

A multi-route note-taking application.

## Routes
- `/home` — Shows total note count (active only), recent 3 notes by updatedAt
- `/notes` — List all active notes; add new note; delete note; edit note title/body
- `/tags` — List all unique tags across notes; click tag to filter notes by tag
- `/archive` — List archived notes; archive/unarchive a note

## Data Model

### Note
```ts
{ id: string; title: string; body: string; tags: string[]; archived: boolean; createdAt: string; updatedAt: string }
```

## Seed Data
```
{id:"n1", title:"Meeting notes", body:"Discuss Q3 goals", tags:["work","meeting"], archived:false, createdAt:"2026-06-01T09:00:00Z", updatedAt:"2026-06-01T09:00:00Z"}
{id:"n2", title:"Recipe ideas", body:"Try carbonara", tags:["personal","food"], archived:false, createdAt:"2026-06-02T10:00:00Z", updatedAt:"2026-06-02T10:00:00Z"}
{id:"n3", title:"Old diary", body:"2025 recap", tags:["personal"], archived:true, createdAt:"2026-06-03T11:00:00Z", updatedAt:"2026-06-03T11:00:00Z"}
{id:"n4", title:"Project plan", body:"Phase 1 tasks", tags:["work"], archived:false, createdAt:"2026-06-04T12:00:00Z", updatedAt:"2026-06-04T12:00:00Z"}
```

## Behaviors
- Add note: title (required), body (optional), tags (comma-separated, parsed into array)
- Delete note: removes immediately
- Archive note: sets archived=true; removed from /notes, appears in /archive
- Unarchive note: sets archived=false; appears in /notes
- Tags page: lists all unique tags sorted alphabetically; clicking a tag filters /notes to that tag
- Home: active count = notes where archived===false; recent = last 3 by updatedAt desc

## Edge Cases
- Cannot add note with empty title
- Archived notes don't appear in /notes active list
- Tags are case-sensitive (kept as entered)
- If no archived notes, archive page shows empty message

## UI Requirements
- NavBar: `data-testid="nav-home"`, `data-testid="nav-notes"`, `data-testid="nav-tags"`, `data-testid="nav-archive"`
- Note rows: `data-testid="note-row-{id}"`
- Delete: `data-testid="delete-note-{id}"`
- Archive toggle (from notes): `data-testid="archive-note-{id}"`
- Unarchive (from archive): `data-testid="unarchive-note-{id}"`
- Add note form: `data-testid="note-title"`, `data-testid="note-body"`, `data-testid="note-tags"`, `data-testid="add-note-btn"`
- Note error: `data-testid="note-error"`
- Home active count: `data-testid="active-count"`
- Home recent: `data-testid="recent-notes"`
- Tag items: `data-testid="tag-item-{tag}"`
- Archive list: `data-testid="archive-list"` wrapping archived note rows
- Empty archive: `data-testid="no-archived"`
