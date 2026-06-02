# Build an Asset Library app

Build a complete single-page React application — an internal digital asset library tool — with **three views** the user navigates between using a top navigation bar: **Library**, **Stats**, and **Settings**. The app starts on the Library view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Library**, **Stats**, **Settings**) switches the active view.

**Library** — a filterable list of digital assets.
- An input labeled **Asset name** for the asset's name.
- A select (dropdown) labeled **Type** with options: **logo**, **icon**, **photo**.
- An input labeled **Tags** for a comma-separated list of tags (e.g. `brand, hero`).
- An **Add asset** button that adds the asset (ignore if name is blank).
- Each asset row shows the asset's **name**, **type**, and **tags** (comma-separated, or empty string if none).
- A filter select labeled **Filter by type** with options: **All**, **logo**, **icon**, **photo**. Selecting a type shows only assets of that type; selecting **All** shows every asset.
- A live count line that reads `Showing: N assets` reflecting the currently visible (filtered) count.
- Each asset row has a **Delete** button (labeled `Delete <name>`) that removes it permanently.

Seed the library with these three assets on startup:
- Name: **Company Logo**, Type: **logo**, Tags: `brand, primary`
- Name: **Menu Icon**, Type: **icon**, Tags: `nav, ui`
- Name: **Hero Photo**, Type: **photo**, Tags: `landing, hero`

**Stats** — a read-only summary of all assets (ignores the active filter), shown as text lines:
`Total assets: N`, `Logos: N`, `Icons: N`, `Photos: N`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).