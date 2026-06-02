# Build an Asset Library app

Build a complete single-page React application — a small internal asset library tool — with **three views** the user navigates between using a top navigation bar: **Library**, **Stats**, and **Settings**. The app starts on the Library view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Library**, **Stats**, **Settings**) switches the active view.

**Library** — a searchable, filterable list of digital assets.
- An input labeled **Asset name** and a dropdown labeled **Asset type** (options: `logo`, `icon`, `photo`) and an input labeled **Tags** (comma-separated) plus an **Add asset** button adds an asset. Ignore a blank name.
- A filter toolbar shows four buttons: **All**, **logo**, **icon**, **photo**. Clicking a filter button shows only assets of that type (or all). The active filter is visually indicated via `aria-pressed="true"`.
- Each asset row shows its name, its type in parentheses, and its tags (comma-separated). For example: `Banner (logo)` and `landscape, summer` on the same row.
- Each asset row has a **Delete** button (labeled `Delete <name>`) that removes it.
- Below the list, show a live count line: `Showing: N assets` reflecting the currently filtered count.

**Stats** — a read-only summary computed from all assets (not filtered):
- `Total assets: N`
- `Logos: N`
- `Icons: N`
- `Photos: N`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three starter assets so tests have initial data:
1. Name: `Acme Logo`, Type: `logo`, Tags: `brand, primary`
2. Name: `Home Icon`, Type: `icon`, Tags: `nav, ui`
3. Name: `Hero Photo`, Type: `photo`, Tags: `landing, hero`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
