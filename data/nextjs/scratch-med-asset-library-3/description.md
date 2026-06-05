# Build a Digital Asset Library app

Build a complete single-page React application — a small digital asset management tool — with **three views** the user navigates between using a top navigation bar: **Library**, **Stats**, and **Settings**. The app starts on the Library view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Library**, **Stats**, **Settings**) switches the active view.

**Library** — a list of digital assets.
- An input labeled **Asset name** and a dropdown labeled **Asset type** (options: `logo`, `icon`, `photo`) let the user fill in details.
- An input labeled **Tags** accepts a comma-separated list of tags.
- An **Add asset** button adds the asset (ignore if Asset name is blank).
- Each asset in the list shows its name, its type, and its tags (comma-separated, blank if none).
- A dropdown labeled **Filter by type** has options: `All`, `logo`, `icon`, `photo`. When a non-All option is selected, only assets of that type are shown in the list.
- Each asset has a **Delete** button (labeled `Delete <name>`) that removes it.
- The list heading shows the count of currently visible assets, like `Assets (3)`.

**Stats** — a read-only summary derived from ALL assets (unaffected by the filter):
- `Total assets: N`
- `Logos: N`
- `Icons: N`
- `Photos: N`
- `Tagged: N` — count of assets that have at least one tag.

**Settings**
- A **Toggle theme** button switches the app theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three assets already present on first load:
- Name: `Brand Logo`, Type: `logo`, Tags: `brand,primary`
- Name: `Home Icon`, Type: `icon`, Tags: `ui,nav`
- Name: `Hero Photo`, Type: `photo`, Tags: (empty)

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
