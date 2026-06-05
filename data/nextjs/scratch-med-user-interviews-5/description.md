# Build a User Interviews Tracker

Build a complete single-page React application — a lightweight internal tool for tracking user research interviews — with **three views** the user navigates between using a top navigation bar: **Interviews**, **Stats**, and **Settings**. The app starts on the **Interviews** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Interviews**, **Stats**, **Settings**) switches the active view.

**Interviews** — the main list view.
- A form with three inputs:
  - **Participant** (text input, labeled `Participant`)
  - **Segment** (text input, labeled `Segment`)
  - **Key Takeaway** (text input, labeled `Key Takeaway`)
- An **Add Interview** button that adds the entry to the list (ignore the entry if any field is blank).
- A **Filter by segment** input that filters the displayed list to only show interviews whose segment matches (case-insensitive, partial match). When the filter is empty all interviews are shown.
- The filtered list shows each interview as a row with the participant name, segment in parentheses, and key takeaway — formatted exactly as `Alice (Enterprise): Needs SSO support`.
- A live count below the filter showing how many interviews match: `Showing: N of M` where N is the filtered count and M is the total count.
- A **Delete** button on each row removes that interview.

**Stats** — a read-only summary derived from all interviews (ignores the current filter).
- Heading: `Stats`
- Shows `Total interviews: N`.
- For each unique segment, shows a line formatted exactly as `Segment: Enterprise — 3` (segment name, em dash, count).
- Shows `Segments tracked: N` (count of unique segments).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- The button label shows the current theme: `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

Seed the app with these three interviews already present on load:
1. Participant: `Alice`, Segment: `Enterprise`, Key Takeaway: `Needs SSO support`
2. Participant: `Bob`, Segment: `SMB`, Key Takeaway: `Wants cheaper pricing`
3. Participant: `Carol`, Segment: `Enterprise`, Key Takeaway: `Requests API access`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
