# Notebook app

Build a small multi-route note-taking app where notes live inside notebooks. Routing is
**in-app** (React state — no `next` imports anywhere). The app has four routes, a shared
Context holding all cross-route state, and an API route handler backed by a separate
in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Notebook = { id: string; name: string }`
- `Note = { id: string; notebookId: string; title: string; body: string; tags: string[]; pinned: boolean }`
- `Route = 'notebooks' | 'notes' | 'editor' | 'search'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `notebooks: Notebook[]`, `notes: Note[]`, `theme: Theme`, `route: Route`
- `selectedNotebookId: string | null` — which notebook the notes list shows
- `editingNoteId: string | null` — which note the editor edits (`null` = new note)
- `tagFilter: string | null` — active tag filter on the notes list
- `searchQuery: string`
- `addNote({ notebookId, title, body?, tags? })` — appends a new `Note` (`pinned: false`,
  fresh string id like `n4`, `n5`, …) and returns it
- `updateNote(id, { title?, body?, tags? })` — patches a note
- `removeNote(id)` — drops the note
- `togglePin(id)` — flips `pinned`
- `selectNotebook(id)` — sets `selectedNotebookId` and navigates to `notes`
- `startNewNote(notebookId)` — sets `editingNoteId = null` + navigates to `editor`
- `startEditNote(id)` — sets `editingNoteId` + navigates to `editor`
- `setTagFilter`, `setSearchQuery`, `setTheme`, `navigate(route)`

Seed data (2 notebooks, 3 notes):

| notebook | id |
|---|---|
| Personal | `nb1` |
| Work     | `nb2` |

| note | id | notebook | tags | pinned |
|---|---|---|---|---|
| Grocery list | `n1` | `nb1` | `['errand']`        | false |
| Sprint goals | `n2` | `nb2` | `['planning']`      | true  |
| Book ideas   | `n3` | `nb1` | `['writing','fun']` | false |

The first added note gets id `n4`.

## Derived helpers — `hooks/useNotes.ts`
Pure helpers (convenient but not required by name) plus a `useNotes()` hook returning:
- `notesInNotebook` — notes whose `notebookId === selectedNotebookId`, **pinned first**
  (stable within each group), then filtered by `tagFilter` (if set, keep notes whose
  `tags` include it).
- `tagsInNotebook` — sorted unique tags across the selected notebook's notes.
- `searchResults` — across ALL notes, those whose title or body contains `searchQuery`
  (case-insensitive); empty array when the query is blank.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`notebooks`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-notebooks" | "nav-notes" | "nav-editor" | "nav-search"` (labels
Notebooks / Notes / Editor / Search). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/notebooks/page.tsx` — `data-testid="page-notebooks"`
A `<ul data-testid="notebook-list">` of notebooks. Each notebook renders
`<li data-testid="notebook-<id>">` with `notebook-<id>-name`, a `notebook-<id>-count`
showing how many notes belong to it, and an `open-<id>` button that calls
`selectNotebook(id)`.

### `app/notes/page.tsx` — `data-testid="page-notes"`
Shows notes for `selectedNotebookId`. If none selected, render
`<p data-testid="no-notebook">`. Otherwise: a `tag-filter` `<select>` (option `all` =
"All tags" plus one per tag in `tagsInNotebook`), a `new-note` button calling
`startNewNote(selectedNotebookId)`, then the list. Each note row is
`<li data-testid="note-<id>" data-pinned="true|false">` with `note-<id>-title`, an
`edit-<id>` button (calls `startEditNote`), a `pin-<id>` button (calls `togglePin`), and a
`delete-<id>` button (calls `removeNote`). When no note matches, render
`<p data-testid="notes-empty">` and **no** `note-list`; otherwise wrap rows in
`<ul data-testid="note-list">`.

### `app/editor/page.tsx` — `data-testid="page-editor"`
`<form data-testid="note-form">` with `title-input`, `body-input` (textarea),
`tags-input` (comma-separated), and `save-note`. When `editingNoteId` is set, prefill from
that note; otherwise blank. On submit: if the title is empty/whitespace, render
`<p data-testid="form-error">` and stay. Otherwise tags are parsed from the comma-separated
input (trimmed, blanks dropped); if editing, `updateNote`; if new, `addNote` into the
`selectedNotebookId` (fallback to the first notebook). Then `navigate('notes')`.

### `app/search/page.tsx` — `data-testid="page-search"`
A `search-input` bound to `searchQuery`. Results render as
`<ul data-testid="search-results">` of `<li data-testid="result-<id>">` (with
`result-<id>-title`). When the query is blank, render `<p data-testid="search-empty">` and
no results list.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/notes/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ notes: Note[] }`. Optional `?notebookId=<id>`, `?tag=<tag>`, and
  `?q=<text>` (case-insensitive title/body match) filters (combine with AND).
- **POST** — body `{ notebookId, title, body?, tags? }`. 201 with the created note. If
  `title` is missing/blank → 400 `{ error: "title required" }`. New ids continue
  `n4`, `n5`, …
- **PUT** — `?id=<id>`. With body `{ title?, body?, tags?, pinned? }` apply the patch; if
  body has no keys, toggle `pinned`. Returns the updated note. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
