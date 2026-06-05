# Build a Brand Color Manager app

Build a complete single-page React application — a brand color palette tool — with **three views** the user navigates between using a top navigation bar: **Palette**, **Stats**, and **Settings**. The app starts on the Palette view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Palette**, **Stats**, **Settings**) switches the active view.

**Palette** — the main list of brand colors.
- An input labeled **Color name** for the color's name (e.g. "Midnight Blue").
- An input labeled **Hex code** for the hex value (e.g. `#1a2b3c`).
- An **Add color** button that adds the color to the list. Ignore the entry if either field is blank. The hex value must start with `#`; ignore entries where the hex code does not start with `#`.
- Each color entry shows: a color swatch (a small `div` or `span` with `aria-label` set to `"Swatch for <name>"` and its background set to the hex value), the color's name, and its hex code.
- Each entry also has a **Remove** button labeled `Remove <name>` that deletes that color.
- A summary line at the bottom reads `Total colors: N` where N is the current count.
- A **Filter** input labeled **Filter colors** that filters the displayed list in real time by name (case-insensitive). The `Total colors: N` count always reflects ALL colors, not just filtered ones.

**Stats** — a read-only derived summary:
- Shows `Total colors: N` (all colors).
- Shows `Unique hues: N` — the count of colors whose hex codes are distinct (case-insensitive).
- Shows `Most recent: <name>` — the name of the last-added color, or `Most recent: —` when the palette is empty.
- This view updates automatically as colors are added or removed in Palette.

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- The button text is `Toggle theme (current: light)` or `Toggle theme (current: dark)` depending on the current theme.

Seed the palette with these three colors on first load:
- Name: `Primary`, Hex: `#0057ff`
- Name: `Secondary`, Hex: `#ff5700`
- Name: `Neutral`, Hex: `#f0f0f0`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
