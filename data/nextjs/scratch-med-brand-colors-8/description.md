# Build a Brand Color Manager

Build a complete single-page React application for managing a brand's color palette, with **three views** the user navigates between using a top navigation bar: **Colors**, **Stats**, and **Settings**. The app starts on the Colors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Colors**, **Stats**, **Settings**) switches the active view.

**Colors** — the main palette manager.
- An input labeled **Color name** and an input labeled **Hex code** plus an **Add color** button adds a new color entry. Ignore the entry if either field is blank. The hex code is stored exactly as entered (no normalization needed).
- The running total is shown as `Total colors: N` where N is the current count.
- Each color entry shows: a swatch `<div>` with its background set to the hex value, the color name, and the hex code as visible text.
- Each color entry has a **Delete** button (accessible as `Delete <name>`) that removes it.
- Duplicate names are allowed.

**Stats** — a read-only summary derived from the palette:
- `Total colors: N` — total number of colors.
- `Unique hex codes: N` — number of distinct hex strings (case-sensitive).
- If there are no colors, show `No colors added yet.` instead of the counts.
- This view updates live whenever colors are added or deleted on the Colors view.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Filter short hex** checkbox; when checked, the Colors view hides any entry whose hex code is 4 characters or fewer (e.g. `#fff`). Hidden entries still count in Stats.

Seed the app with these three initial colors so tests can rely on them:
- Name: `Midnight Blue`, Hex: `#003153`
- Name: `Coral`, Hex: `#FF6B6B`
- Name: `Mint`, Hex: `#98FF98`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
