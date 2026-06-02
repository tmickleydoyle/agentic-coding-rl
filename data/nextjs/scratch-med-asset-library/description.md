# Build an Asset Library app

Build a complete single-page React application — an internal asset library tool — with **three views** the user navigates between using a top navigation bar: **Library**, **Stats**, and **Settings**. The app starts on the **Library** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Library**, **Stats**, **Settings**) switches the active view.

**Library** — a searchable, filterable list of digital assets.
- An input labeled **Asset name** and a dropdown labeled **Asset type** (options: `logo`, `icon`, `photo`) and an input labeled **Tags** (comma-separated) plus an **Add asset** button adds an asset (ignore a blank name).
- A dropdown labeled **Filter by type** with options `All`, `logo`, `icon`, `photo` filters the visible list. When a filter is active, only assets of that type are shown.
- Each asset in the list shows its **name**, its **type** in parentheses, and its tags (comma-separated, or nothing if no tags).
- Each asset has a **Delete** button (accessible label `Delete <name>`) that removes it from the library entirely.
- A live count line below the filter reads `Showing: N of M` where N is the filtered count and M is the total count.

**Stats** — a read-only summary computed from the full library (not filtered), shown as text lines:
- `Total assets: N`
- `Logos: N`
- `Icons: N`
- `Photos: N`

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the library with these three assets on startup (so tests can rely on initial data):
1. name: `Acme Logo`, type: `logo`, tags: `brand, official`
2. name: `Home Icon`, type: `icon`, tags: `nav, ui`
3. name: `Hero Photo`, type: `photo`, tags: `landing`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
