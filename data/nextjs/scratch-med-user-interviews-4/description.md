# Build a User Interview Tracker

Build a complete single-page React application — a lightweight internal tool for a UX research team — with **three views** the user navigates between using a top navigation bar: **Interviews**, **Stats**, and **Settings**. The app starts on the **Interviews** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Interviews**, **Stats**, **Settings**) switches the active view.

**Interviews** — the main list of user interview records.
- An input labeled **Participant** for the participant's name.
- An input labeled **Segment** for the customer segment (e.g. "Enterprise", "SMB", "Consumer").
- A textarea labeled **Key takeaway** for the main insight.
- An **Add interview** button that adds the record (ignore the submission if any field is blank).
- Each interview record displays the participant name, segment, and key takeaway, plus a **Delete** button (labeled `Delete <participant>`) that removes it.
- A **Filter by segment** input that filters the visible list to only show records whose segment matches (case-insensitive, partial match). When the filter is empty, all records are shown.
- The count of currently visible interviews is shown as `Showing: N interview(s)` just above the list.
- All interview records are seeded with the following data on load:
  - Participant: `Alice`, Segment: `Enterprise`, Key takeaway: `Needs SSO integration`
  - Participant: `Bob`, Segment: `SMB`, Key takeaway: `Wants better onboarding`
  - Participant: `Carol`, Segment: `Enterprise`, Key takeaway: `Concerned about pricing`

**Stats** — a read-only summary derived from all interviews (ignoring the active filter).
- Shows `Total interviews: N`.
- For each unique segment (in the order they first appeared), shows a line like `Enterprise: N` (the count of interviews in that segment).
- Shows `Top segment: <name>` — the segment with the most interviews (if there is a tie, show the one that appears first). When there are no interviews, show `Top segment: —`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
