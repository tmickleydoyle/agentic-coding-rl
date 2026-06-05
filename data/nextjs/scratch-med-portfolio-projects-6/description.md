# Build a Portfolio Projects tracker

Build a complete single-page React application for a freelancer to track their portfolio projects, with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

## Seed data
Start the app with the following three projects already loaded:
- Title: `Brand Redesign`, Category: `Design`, Status: `live`
- Title: `API Integration`, Category: `Development`, Status: `draft`
- Title: `Landing Page`, Category: `Design`, Status: `live`

**Projects** — a list of all portfolio projects.
- An input labeled **Project title** and an input labeled **Category** (a plain text input, not a select), plus a **Add project** button. Clicking it adds a new project with status `draft` (ignore blank title or blank category).
- Each project row shows its title, its category, and its status (`live` or `draft`).
- Each project row has a **Toggle status** button that flips the project's status between `live` and `draft`.
- A filter control: a group of two buttons labeled **All** and **Live only**. When **Live only** is active, only `live` projects are shown in the list. When **All** is active, every project is shown. The app starts with **All** active.
- Above the list, show a count of currently visible projects as `Showing: N projects` (reflecting the active filter).

**Stats** — a read-only summary derived from all projects (ignoring the filter):
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is the number of live projects divided by total, as a whole-number percent (0% when there are no projects).
- `Design: N` — count of projects whose category is exactly `Design`.
- `Development: N` — count of projects whose category is exactly `Development`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state only).