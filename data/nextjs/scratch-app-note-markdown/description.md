> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Markdown Notes app

Build a small multi-route markdown note-taking app with a live preview. Routing is
**in-app** (React state — no `next` imports anywhere). The app has four routes, a shared
Context holding all cross-route state, an API route handler backed by a separate in-memory
store, and a tiny markdown→HTML renderer in `lib/`.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Note = { id: string; title: string; body: string; tags: string[] }`
- `Route = 'list' | 'editor' | 'tags' | 'settings'`
- `Theme = 'light' | 'dark'`

## Markdown renderer — `lib/markdown.ts`
A small, deterministic line-based renderer. Export:
- `renderMarkdown(src: string): string` — converts markdown to an HTML string. Support:
  - `# H1` → `<h1>…</h1>`, `## H2` → `<h2>…</h2>`, `### H3` → `<h3>…</h3>`
  - lines starting `- ` become `<li>…</li>` wrapped in a single `<ul>…</ul>` per
    consecutive run of bullet lines
  - blank lines separate paragraphs; consecutive non-special, non-blank lines join into a
    single `<p>…</p>` (joined by a space)
  - inline: `**bold**` → `<strong>bold</strong>`, `` `code` `` → `<code>code</code>`
    (bold processed before code is fine; both must work in the same line)
- `wordCount(src: string): number` — number of whitespace-separated word tokens (0 for
  empty/whitespace-only).

(You may add internal helpers; only `renderMarkdown` and `wordCount` are required by name.)

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `notes: Note[]`, `theme: Theme`, `route: Route`
- `editingNoteId: string | null` (`null` = composing a new note)
- `tagFilter: string | null` — active tag filter for the list
- `addNote({ title, body?, tags? })` — appends a `Note` (fresh id `m4`, `m5`, …), returns it
- `updateNote(id, { title?, body?, tags? })` — patches a note
- `removeNote(id)` — drops a note
- `startNewNote()` — `editingNoteId = null` + navigate to `editor`
- `startEditNote(id)` — set `editingNoteId` + navigate to `editor`
- `setTagFilter`, `setTheme`, `navigate(route)`

Seed data (3 notes):

| note | id | tags | body (markdown) |
|---|---|---|---|
| Welcome   | `m1` | `['intro']`        | `# Hello\n\nThis is **bold**.` |
| Todo      | `m2` | `['task','daily']` | `- one\n- two` |
| Reference | `m3` | `['intro','docs']` | `Use \`code\` here` |

The first added note gets id `m4`.

## Derived helpers — `hooks/useNotesView.ts`
A `useNotesView()` hook returning:
- `visibleNotes` — `notes` filtered by `tagFilter` (keep notes whose tags include it) when
  set, else all notes.
- `allTags` — sorted unique tags across ALL notes, each with a count, as
  `{ tag: string; count: number }[]`.
- `totalWords` — sum of `wordCount(note.body)` across ALL notes.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`list`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-list" | "nav-editor" | "nav-tags" | "nav-settings"` (labels
List / Editor / Tags / Settings). The current route's button has `aria-current="page"`; the
others must **not**.

## Pages
### `app/list/page.tsx` — `data-testid="page-list"`
A `new-note` button (calls `startNewNote`), the active filter shown in
`<p data-testid="active-filter">` (text is the tag, or `none` when no filter), and the list.
Each note is `<li data-testid="note-<id>">` with `note-<id>-title`, a `note-<id>-words`
showing `wordCount(body)`, an `edit-<id>` button (calls `startEditNote`), and a
`delete-<id>` button (calls `removeNote`). When `visibleNotes` is empty render
`<p data-testid="list-empty">` and **no** `note-list`; otherwise wrap rows in
`<ul data-testid="note-list">`.

### `app/editor/page.tsx` — `data-testid="page-editor"`
`<form data-testid="note-form">` with `title-input`, `body-input` (textarea),
`tags-input` (comma-separated), and `save-note`. Prefill from `editingNoteId` when set.
Live preview: a `<div data-testid="preview" dangerouslySetInnerHTML>` showing
`renderMarkdown(body)` as you type, plus `<span data-testid="live-words">` with the live
`wordCount(body)`. On submit: blank title → `<p data-testid="form-error">` and stay;
otherwise add/update (tags parsed from the comma-separated field, trimmed, blanks dropped)
and `navigate('list')`.

### `app/tags/page.tsx` — `data-testid="page-tags"`
A `<ul data-testid="tag-list">` of `allTags`. Each is `<li data-testid="tag-<tag>">` with
`tag-<tag>-count` and a `filter-<tag>` button that sets `tagFilter` and navigates to
`list`. Also a `clear-filter` button that sets `tagFilter` to null.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` shows the theme; `theme-toggle` flips light/dark in
context (persists across navigation, reflected on `app-root`'s `data-theme`). Also
`<p data-testid="total-words">` showing `totalWords`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/notes/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ notes: Note[] }`. Optional `?tag=<tag>` and `?q=<text>` (case-insensitive
  title/body) filters (AND). Optional `?render=html` adds a `html` field (rendered body) to
  each returned note.
- **POST** — body `{ title, body?, tags? }`. 201 with the created note. Blank title → 400
  `{ error: "title required" }`. New ids continue `m4`, `m5`, …
- **PUT** — `?id=<id>`. Body `{ title?, body?, tags? }` patch. Returns the updated note.
  Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
