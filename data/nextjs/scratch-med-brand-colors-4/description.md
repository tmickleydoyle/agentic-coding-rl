# Build a Brand Color Manager app

Build a complete single-page React application — a brand color management tool — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list view where brand colors are managed.
- An input labeled **Color name** for the color's name (e.g. "Ocean Blue").
- An input labeled **Hex code** for the hex value (e.g. "#1A2B3C").
- An **Add color** button that adds the color to the list. Ignore submissions where either field is blank. The hex code is stored and displayed exactly as entered.
- Each color entry shows:
  - A color swatch: a small box rendered with `background-color` set to the hex value, with an `aria-label` of `Swatch for <name>`.
  - The color name.
  - The hex code displayed as a separate text element.
  - A **Delete** button labeled `Delete <name>` that removes it from the list.
- A count line at the top of the list reading `Total colors: N` where N is the current number of colors.
- If no colors have been added yet, show the text `No colors yet`.

**Stats** — a read-only derived summary view.
- Shows the heading **Stats**.
- Shows `Total colors: N` — the count of all colors.
- Shows `Unique hex codes: N` — the count of distinct hex values (case-insensitive, so `#FFF` and `#fff` count as one).
- Shows `Most recent: <name>` — the name of the most recently added color, or `Most recent: —` if no colors exist.

**Settings** — a simple preferences view.
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across views.
- Displays the current theme: `Current theme: light` or `Current theme: dark`.

Seed the app with **no** initial colors. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).