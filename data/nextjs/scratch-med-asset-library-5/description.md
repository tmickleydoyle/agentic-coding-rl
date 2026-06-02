# Build an Asset Library app

Build a complete single-page React application — an internal asset library tool — with **three views** the user navigates between using a top navigation bar: **Library**, **Stats**, and **Settings**. The app starts on the Library view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Library**, **Stats**, **Settings**) switches the active view.

**Library** — the main asset list.
- An input labeled **Asset name** and a dropdown labeled **Asset type** (with options **logo**, **icon**, **photo**) and an input labeled **Tags** (comma-separated) plus an **Add asset** button add a new asset. Ignore a blank name.
- The list shows every asset with its name, type, and tags (displayed as a comma-separated string).
- A set of filter buttons labeled **All**, **logo**, **icon**, **photo** filter the visible list by type. The active filter starts at **All**. Each filter button shows its label followed by a count in parentheses: **All (N)**, **logo (N)**, **icon (N)**, **photo (N)** where N reflects the current totals across all assets (not just visible ones).
- Each asset row has a **Delete** button (labeled `Delete <asset name>`) that removes the asset.

**Stats** — a read-only summary derived from the full asset list (unaffected by the active filter):
- `Total assets: N`
- `Logos: N`
- `Icons: N`
- `Photos: N`
- `Most common type: T` where T is the type with the highest count (show `None` when the library is empty). Break ties by the order logo → icon → photo.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the library with three initial assets so the app is not empty on first load:
- name: `Wordmark`, type: `logo`, tags: `brand, primary`
- name: `Favicon`, type: `icon`, tags: `brand, small`
- name: `Hero Shot`, type: `photo`, tags: `homepage`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
