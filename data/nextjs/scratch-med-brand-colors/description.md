# Build a Brand Color Manager app

Build a complete single-page React application — a brand color list tool — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry. Ignore the entry if either field is blank.
- Each color entry shows a color swatch (a `div` or `span` with its background set to the hex value), the color name, and the hex code formatted as entered.
- Each color entry has a **Delete** button (labeled `Delete <name>`, e.g. `Delete Cobalt Blue`) that removes it.
- A line at the top of the list reads `Total colors: N` where N is the current count.

**Stats** — a read-only summary view.
- Shows the heading **Stats**.
- Shows `Total colors: N` (same count as Colors view).
- Shows `Most recent: <name>` — the name of the last color added, or `Most recent: —` if no colors exist.
- For every color in the list, shows a row with the name and hex code so the user can audit the full palette here too.

**Settings** — a simple preferences view.
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- The button label reads `Toggle theme (current: light)` or `Toggle theme (current: dark)` to reflect the active theme.

Seed the app with these two colors already in the list when it first loads:
- Name: `Cobalt Blue`, Hex: `#0047AB`
- Name: `Emerald`, Hex: `#50C878`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
