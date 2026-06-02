# Build a Brand Color Manager app

Build a complete single-page React application — a brand color palette tool — with **three views** the user navigates between using a top navigation bar: **Palette**, **Stats**, and **Settings**. The app starts on the Palette view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Palette**, **Stats**, **Settings**) switches the active view.

**Palette** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry (ignore if either field is blank; hex codes are stored as entered).
- Each color entry shows a color swatch (a small `div` or `span` with a `style` background set to the hex value), the color name, and the hex code displayed exactly as `#RRGGBB` (whatever the user typed).
- Each entry has a **Delete** button (aria-label `Delete <name>`) that removes it from the list.
- Below the list show the total count of colors as `Total colors: N`.
- The list preserves insertion order.

**Stats** — a read-only summary derived from the palette:
- Shows `Total colors: N` (same count).
- Shows `Unique hex codes: N` (count of distinct hex strings, case-insensitive comparison).
- Shows the label `Most recent: <name>` where `<name>` is the name of the last-added color, or `Most recent: —` when the palette is empty.
- This view is always computed live from the current palette state.

**Settings**
- A **Toggle theme** button switches the UI between light and dark mode. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.
- A **Clear all colors** button removes every color from the palette at once.

Seed the palette with these three initial colors so tests have data to work with:
1. Name `Midnight Blue`, hex `#003153`
2. Name `Crimson`, hex `#DC143C`
3. Name `Forest Green`, hex `#228B22`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
