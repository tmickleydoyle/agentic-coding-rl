# Build a Brand Color Manager app

Build a complete single-page React application — a brand color manager — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list of brand colors.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry (ignore blank name or blank hex; also ignore if the hex code does not start with `#`).
- Each color entry shows:
  - A color swatch: a small box rendered with `background-color` set to the hex value, with `aria-label` of `Swatch for <name>`.
  - The color name as text.
  - The hex code as text, e.g. `#A3B4C5`.
  - A **Delete** button (aria-label `Delete <name>`) that removes that color from the list.
- A summary line at the bottom of the list reading `Total colors: N` where N is the current count.
- The list heading reads **Brand Colors**.

**Stats** — a read-only derived summary:
- Heading **Color Stats**.
- A line reading `Total colors: N`.
- A line reading `With light hue (starts #A–#F): N` — count of hex codes whose first character after `#` is a letter A–F (case-insensitive) in the range A–F (i.e. hex digit ≥ A, meaning A, B, C, D, E, or F).
- A line reading `With dark hue (starts #0–#9): N` — count of hex codes whose first character after `#` is a digit 0–9.
- A line reading `Most recent: <name>` showing the name of the last-added color, or `Most recent: —` when the list is empty.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is reflected as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.
- A **Clear all colors** button that removes every color from the list.

Seed the app with these two initial colors already in the list:
- Name: `Midnight Blue`, Hex: `#003366`
- Name: `Coral`, Hex: `#FF6B6B`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
