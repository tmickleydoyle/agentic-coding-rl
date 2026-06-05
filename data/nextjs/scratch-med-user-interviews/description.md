# Build a User Interviews Tracker

Build a complete single-page React application — a lightweight internal tool for tracking user research interviews — with **three views** the user navigates between using a top navigation bar: **Interviews**, **Stats**, and **Settings**. The app starts on the Interviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Interviews**, **Stats**, **Settings**) switches the active view.

**Interviews** — the main list of user research sessions.
- A form with three inputs:
  - **Participant** (text) — the interviewee's name.
  - **Segment** (text) — the customer segment they belong to (e.g. "SMB", "Enterprise").
  - **Key Takeaway** (text) — one-line insight captured during the interview.
- An **Add Interview** button adds the entry (ignore submissions where any field is blank).
- Each entry is shown as a row with the participant name, segment, and key takeaway visible.
- A **Segment filter** labeled **Filter by segment** (a text input) narrows the list to rows whose segment matches the filter value (case-insensitive, partial match). When the filter is empty, all rows are shown.
- A count line above the list always reflects the current filter: `Showing: N interview(s)`.
- Each row has a **Delete** button that removes that interview permanently.

**Stats** — a read-only derived summary.
- Shows `Total interviews: N` where N is the total number of interviews (unfiltered).
- Lists each unique segment alphabetically with its count in the format `Segment: <name> — N interview(s)`. If there are no interviews, show the text `No interviews yet`.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is shown on the button label as `Toggle theme (current: light)` or `Toggle theme (current: dark)`. The theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with these three interviews already present on first render:
1. Participant: **Alice**, Segment: **SMB**, Key Takeaway: **Needs faster onboarding**
2. Participant: **Bob**, Segment: **Enterprise**, Key Takeaway: **Wants SSO support**
3. Participant: **Carol**, Segment: **SMB**, Key Takeaway: **Price is a concern**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
