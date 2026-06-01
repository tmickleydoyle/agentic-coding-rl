> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Blog Portfolio app

Build a small multi-route portfolio app combining projects and writing posts. Routing is
**in-app** (React state — no `next` imports anywhere). The app has four routes, a shared
Context holding all cross-route state, and an API route handler backed by a separate
in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Project = { id: string; title: string; tags: string[]; featured: boolean }`
- `Post = { id: string; title: string; tag: string }`
- `Route = 'home' | 'projects' | 'writing' | 'project-detail'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `projects: Project[]`, `posts: Post[]`, `theme: Theme`, `route: Route`
- `currentProjectId: string | null` — selected project for detail
- `tagFilter: string` — `'all'` or a tag, applied on the projects page
- `addProject({ title, tags })` — appends a new `Project` (`featured: false`, fresh string
  id like `j4`, `j5`, …; `tags` is the given array)
- `toggleFeatured(id)` — flips `featured`
- `selectProject(id)` — sets `currentProjectId`
- `setTagFilter(tag)`, `setTheme`, `navigate(route)`

Seed data (3 projects, 3 posts):

| project | id | tags | featured |
|---|---|---|---|
| Portfolio site | `j1` | `web`, `ts`   | true  |
| Data pipeline  | `j2` | `python`      | false |
| Game engine    | `j3` | `cpp`, `web`  | false |

| post | id | tag |
|---|---|---|
| Why I left Vim | `w1` | `web`    |
| Typing tricks  | `w2` | `ts`     |
| On profiling   | `w3` | `python` |

The first added project gets id `j4`.

## Optional helper — `hooks/usePortfolio.ts`
Derived selectors over shared state. `featuredProjects` returns only featured projects.
`allTags` returns the sorted unique set of every tag across projects. `visibleProjects`
returns projects filtered by the current `tagFilter` (`all` => all; otherwise projects
whose `tags` include the filter). Pure helpers `collectTags` and `filterByTag` are
convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`home`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-home" | "nav-projects" | "nav-writing" | "nav-project-detail"` (labels
Home / Projects / Writing / Detail). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/home/page.tsx` — `data-testid="page-home"`
Summary. Render `<p data-testid="project-total">` (count of projects),
`<p data-testid="post-total">` (count of posts), and a
`<ul data-testid="featured-list">` of the featured projects, each
`<li data-testid="featured-<id>">` showing the project title.

### `app/projects/page.tsx` — `data-testid="page-projects"`
A `<select data-testid="tag-filter">` with an `all` → "All tags" option plus one per tag
(value = tag, from `allTags`). Then the filtered projects as a
`<ul data-testid="project-list">`; each project renders via `ProjectCard` as
`<li data-testid="project-<id>" data-featured="true|false">` with the title, the tags
joined by `, ` in `project-<id>-tags`, a `feature-<id>` button (label "Unfeature" /
"Feature") calling `toggleFeatured(id)`, and an `open-<id>` button that calls
`selectProject(id)` then `navigate('project-detail')`. When nothing matches the filter,
render `<p data-testid="empty-state">` and **no** `project-list`.

### `app/writing/page.tsx` — `data-testid="page-writing"`
A `<ul data-testid="post-list">` of all posts; each `<li data-testid="post-<id>">` shows
the post title and its tag in `post-<id>-tag`.

### `app/project-detail/page.tsx` — `data-testid="page-project-detail"`
If no project is selected, render `<p data-testid="no-project">`. Otherwise show the
selected project's title in `<h1 data-testid="detail-title">`, its tags joined by `, ` in
`<p data-testid="detail-tags">`, a `<p data-testid="detail-featured">` reading `Featured`
or `Not featured`, and a `detail-feature-toggle` button calling `toggleFeatured` on the
current project.

## Presentational components
- `components/NavBar.tsx`, `components/ProjectCard.tsx` (see Projects page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/projects/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ projects: Project[], posts: Post[] }`. Optional `?featured=true` restricts
  `projects` to featured ones; optional `?tag=<t>` restricts `projects` to those whose tags
  include `<t>` (combine with AND). `posts` is always the full list.
- **POST** — body `{ title, tags? }`. 201 with the created project (`featured: false`,
  `tags` defaults to `[]`). If `title` is missing/blank → 400 `{ error: "title required" }`.
  New ids continue `j4`, `j5`, …
- **PUT** — `?id=<id>`. With body `{ featured: boolean }` set it; with no `featured` key,
  toggle. Returns the updated project. Unknown id → 404 `{ error: "not found" }`.
