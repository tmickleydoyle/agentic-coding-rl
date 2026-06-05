# Build a Brand Color Manager app

Build a complete single-page React application — a brand color management tool — with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main list of brand colors.
- An input labeled **Color name** for the color's name, and an input labeled **Hex code** for the hex value (e.g. `#FF5733`).
- An **Add color** button adds the color to the list (ignore if either field is blank).
- The total number of colors is shown as `Total colors: N` on this view.
- Each color entry displays:
  - A color swatch (a small `div` or `span` with its background set to the hex value and an `aria-label` of `Swatch for <name>`).
  - The color's name.
  - The hex code displayed as-is (e.g. `#FF5733`).
  - A **Remove** button labeled `Remove <name>` that deletes the color.
- Seed the app with two initial colors: name `Midnight Blue` hex `#003366`, and name `Coral` hex `#FF6B6B`.

**Stats** — a read-only derived summary view.
- Shows `Total colors: N` where N is the total number of colors.
- Shows `Unique hues: N` where N is the count of colors whose hex values are all distinct (i.e., the count of distinct hex strings, case-insensitive).
- Shows `Most recent: <name>` with the name of the last color added, or `Most recent: —` if the list is empty.
- Shows `Palette complete: Yes` if there are 5 or more colors, otherwise `Palette complete: No`.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Clear all colors** button removes every color from the list.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
