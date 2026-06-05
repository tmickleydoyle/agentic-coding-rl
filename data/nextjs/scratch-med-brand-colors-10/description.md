# Build a Brand Color Manager app

Build a complete single-page React application — a brand color palette tool — with **three views** the user navigates between using a top navigation bar: **Palette**, **Stats**, and **Settings**. The app starts on the Palette view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Palette**, **Stats**, **Settings**) switches the active view.

**Palette** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry (ignore blank name or blank hex).
- Each color entry shows a color swatch (a `div` or `span` with a background color set to the hex value), the color name, and the hex code in the format `#RRGGBB`.
- Each entry has a **Delete** button (aria-label `Delete <name>`) that removes that color.
- A heading at the top of the list reads `Total colors: N` where N is the live count.
- If a hex code does not start with `#`, prepend `#` automatically before storing.

**Stats** — a read-only summary derived from the palette, shown as text:
- `Total colors: N` — total number of colors.
- `Unique hues: N` — count of entries whose hex codes are all distinct (case-insensitive). Two colors sharing the same hex count as one unique hue.
- `Most recent: <name>` — the name of the most recently added color, or `Most recent: —` when the list is empty.
- Seed the palette with two starting colors so the Stats view is non-trivial on first load: name **Midnight Blue** hex **#1B2A4A** and name **Coral Red** hex **#E8503A**.

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views. The button label reads `Toggle theme (current: light)` or `Toggle theme (current: dark)`.
- A **Clear all colors** button that removes every color from the palette at once.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
