# Build an Asset Library app

Build a complete single-page React application — a small internal asset library tool — with **three views** the user navigates between using a top navigation bar: **Library**, **Stats**, and **Settings**. The app starts on the Library view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Library**, **Stats**, **Settings**) switches the active view.

**Library** — the main asset list.
- An input labeled **Asset name** and a dropdown labeled **Asset type** (options: `logo`, `icon`, `photo`) and an input labeled **Tags** (comma-separated) plus an **Add asset** button adds a new asset (ignore a blank name).
- Each asset row shows its name, type badge, and tags. Each row also has a **Delete** button (labeled `Delete <name>`) that removes that asset.
- A filter control labeled **Filter by type** (a `<select>` with options: `All`, `logo`, `icon`, `photo`) filters the visible list. When a filter is active, only matching assets appear.
- Below the filter, show a count line in the format `Showing: N assets` (N = number currently visible after filtering).
- The full asset list (unfiltered) persists when navigating away and back.

**Stats** — a read-only summary derived from all assets (ignoring the active filter).
- Show the following text lines:
  - `Total assets: N`
  - `Logos: N`
  - `Icons: N`
  - `Photos: N`
- Also show the most common type as `Top type: <type>` (if there are no assets, show `Top type: none`; if there is a tie, prefer the type that comes first in the order logo → icon → photo).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Clear all assets** button removes every asset from the library. After clicking, navigating to Library shows an empty list.

Seed the library with these three assets on first render (do not re-add on re-render):
1. Name: `Acme Logo`, Type: `logo`, Tags: `brand, primary`
2. Name: `Home Icon`, Type: `icon`, Tags: `nav, ui`
3. Name: `Hero Photo`, Type: `photo`, Tags: `landing, marketing`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
