# Build a User Interview Tracker app

Build a complete single-page React application — a lightweight internal tool for UX researchers to log and review user interviews — with **three views** the user navigates between using a top navigation bar: **Interviews**, **Stats**, and **Settings**. The app starts on the Interviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Interviews**, **Stats**, **Settings**) switches the active view.

**Interviews** — the main list view.
- A form with three inputs:
  - **Participant** (text input, labeled "Participant")
  - **Segment** (text input, labeled "Segment")
  - **Key Takeaway** (text input, labeled "Key Takeaway")
  - An **Add Interview** button that adds the entry to the list. Ignore submissions where any field is blank.
- A **Filter by segment** input (labeled "Filter by segment") that filters the displayed list to only entries whose segment matches the filter value (case-insensitive, partial match). When blank, all entries are shown.
- Each interview is shown as a list item displaying the participant name, segment (in parentheses), and key takeaway — formatted as `{participant} ({segment}): {takeaway}`. Each entry also has a **Delete** button (aria-label `Delete {participant}`) that removes it.
- A summary line below the list showing the count of currently displayed interviews: `Showing: N interviews`.

**Stats** — a read-only derived summary.
- Shows `Total interviews: N` (count of all interviews, ignoring any filter).
- Shows a per-segment breakdown. For each unique segment (in the order they were first added), show a line formatted as `{segment}: N` where N is the count of interviews in that segment.
- If there are no interviews, show `No interviews yet.`

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists as the user navigates between views.
- The button label shows the current theme: `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

Seed the app with **no** pre-existing interviews (empty list on load).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
