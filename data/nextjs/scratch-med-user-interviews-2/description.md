# Build a User Interview Tracker app

Build a complete single-page React application — a lightweight internal tool for a UX research team — with **three views** the user navigates between using a top navigation bar: **Interviews**, **Stats**, and **Settings**. The app starts on the **Interviews** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Interviews**, **Stats**, **Settings**) switches the active view.

**Interviews** — the main list of user interview records.
- A form with three inputs:
  - **Participant** (text)
  - **Segment** (text)
  - **Key Takeaway** (text)
- An **Add Interview** button adds a new record (ignore the submission if any field is blank).
- Each interview entry displays the participant name, segment, and key takeaway.
- A **Delete** button on each entry removes that interview.
- A **Filter by segment** input (labeled **Filter by segment**) filters the displayed list to only show entries whose segment matches the filter text (case-insensitive, partial match). When the filter is empty, all interviews are shown.
- The heading above the list reads `Interviews (N)` where N is the number of currently displayed (filtered) interviews.

**Stats** — a read-only derived summary:
- Shows `Total interviews: N` where N is the total count of all interviews (unfiltered).
- Lists each unique segment with its count in the format `Segment: N` on its own line (e.g. `Enterprise: 3`, `SMB: 2`). Segments are listed in the order they first appear.
- Shows `Segments tracked: N` where N is the number of distinct segment values across all interviews.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with the following three interviews already present on first load:
1. Participant: **Alice**, Segment: **Enterprise**, Key Takeaway: **Needs SSO support**
2. Participant: **Bob**, Segment: **SMB**, Key Takeaway: **Wants cheaper pricing**
3. Participant: **Carol**, Segment: **Enterprise**, Key Takeaway: **Loves the dashboard**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
