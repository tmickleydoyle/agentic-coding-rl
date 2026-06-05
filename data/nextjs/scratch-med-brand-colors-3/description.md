# Build a Brand Color Manager app

Build a complete single-page React application — a brand color management tool — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry (ignore if either field is blank; ignore if the hex code does not start with `#`).
- Each color entry shows:
  - A color swatch: a small `div` with `aria-label` set to `"Swatch for <name>"` and a background set to the hex value.
  - The color name as text.
  - The hex code as text (e.g. `#A3B2C1`).
  - A **Delete** button (labeled `Delete <name>`) that removes the entry.
- Below the list, display the total count as `Total colors: N`.

**Stats** — a read-only summary derived from the color list:
- `Total colors: N` — total number of colors added.
- `Unique hex codes: N` — count of distinct hex values (case-insensitive).
- `Most recent: <name>` — the name of the last-added color, or `Most recent: —` if the list is empty.

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on the root element, and it persists as the user navigates between views.

Seed NO initial data — the list starts empty. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. The default export of `app/page.tsx` is the root component.