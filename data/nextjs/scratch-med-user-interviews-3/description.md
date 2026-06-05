# Build a User Interview Tracker app

Build a complete single-page React application — a lightweight internal tool for tracking user research interviews — with **three views** the user navigates between using a top navigation bar: **Interviews**, **Stats**, and **Settings**. The app starts on the Interviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Interviews**, **Stats**, **Settings**) switches the active view.

**Interviews** — the main list of interview records.
- A form with three inputs:
  - **Participant** (text input)
  - **Segment** (text input — e.g. "Enterprise", "SMB", "Consumer")
  - **Key Takeaway** (text input)
- An **Add Interview** button that adds a new record (ignore if any field is blank).
- A **Filter by segment** input that filters the displayed list to only entries whose segment matches the typed value (case-insensitive). When the filter is empty, all interviews are shown.
- The list shows each interview as a row with the participant name, segment (in parentheses), and key takeaway, formatted as: `Alice (Enterprise): Needs better reporting`
- Below the list (or when empty), show the count of currently displayed interviews as `Showing: N`.

**Stats** — a read-only summary derived from **all** interviews (not filtered).
- Shows `Total interviews: N`.
- Lists each unique segment with its count, formatted as `Enterprise: N` (one line per segment, in the order segments were first seen).
- Shows the segment with the most interviews as `Top segment: Enterprise` (if there are no interviews, show `Top segment: —`).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A **Clear all interviews** button that removes every interview record from the list.

Seed the app with the following initial interviews so the Stats view is meaningful on first load:
- Participant: `Alice`, Segment: `Enterprise`, Key Takeaway: `Needs better reporting`
- Participant: `Bob`, Segment: `SMB`, Key Takeaway: `Onboarding is confusing`
- Participant: `Carol`, Segment: `Enterprise`, Key Takeaway: `Wants API access`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).