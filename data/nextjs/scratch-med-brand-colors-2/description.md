# Build a Brand Color Manager app

Build a complete single-page React application — a brand color management tool — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry (ignore blank name or blank hex code).
- Each color entry shows a swatch (a `div` with the `background-color` set to the hex value), the color name, and the hex code.
- Each color entry has a **Delete** button that removes it from the list.
- A heading shows the total count: `Total colors: N`.
- Colors are listed in the order they were added.

**Stats** — a read-only derived summary:
- Shows `Total colors: N`.
- Shows `Unique hex codes: N` (counts distinct hex values, case-insensitive).
- Shows `Most recent: NAME` where NAME is the name of the last-added color, or `Most recent: —` if the list is empty.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- The button label reads `Toggle theme (current: light)` or `Toggle theme (current: dark)` reflecting the current theme.

Seed the app with these two initial colors already present when it loads:
1. Name: `Primary Blue`, Hex: `#0057FF`
2. Name: `Accent Green`, Hex: `#00C48C`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
