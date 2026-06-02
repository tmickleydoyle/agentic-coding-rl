# Build a Brand Color Manager app

Build a complete single-page React application — a brand color management tool — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry (ignore blank name or blank hex).
- Each color entry shows a color swatch (a `div` with `aria-label` set to `"Swatch for <name>"` and `background-color` set to the hex value), the color name, and the hex code.
- Each color entry has a **Delete** button (e.g. `aria-label="Delete <name>"`) that removes it.
- At the bottom of the view, show the total count as `Total colors: N`.
- The list heading shows the live count: **`Colors (N)`**.

**Stats** — a read-only summary derived from the color list:
- `Total colors: N`
- `Unique hex codes: N` (count of distinct hex strings, case-insensitive)
- `Duplicates: N` (total entries minus unique count)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all colors** button that removes every color from the list.

Seed the app with these three initial colors so tests can rely on them:
- Name: `Primary`, Hex: `#0057FF`
- Name: `Secondary`, Hex: `#FF5733`
- Name: `Accent`, Hex: `#00C49A`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
