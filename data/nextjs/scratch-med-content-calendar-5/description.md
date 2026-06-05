# Build a Content Calendar app

Build a complete single-page React application — a lightweight content scheduling tool — with **three views** the user navigates between using a top navigation bar: **Posts**, **Stats**, and **Settings**. The app starts on the Posts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Posts**, **Stats**, **Settings**) switches the active view.

**Posts** — a list of content items.
- A form with three fields:
  - An input labeled **Title**
  - A select labeled **Platform** with options: **Twitter**, **LinkedIn**, **Instagram**
  - A select labeled **Status** with options: **draft**, **scheduled**, **published**
  - An **Add Post** button that adds the item (ignore a blank title).
- Each post appears in a list row showing its title, platform, and status.
- A filter select labeled **Filter by status** with options: **all**, **draft**, **scheduled**, **published**. When a filter is active only matching posts are shown in the list (but all posts still count in Stats).
- A live summary line below the filter showing `Showing: N post(s)` where N is the number of posts currently visible.
- Each post row has a **Delete** button that removes it permanently.
- Each post row has a **Toggle status** button that cycles the post's status: draft → scheduled → published → draft.

**Stats** — a read-only summary derived from all posts (ignores any active filter):
- `Total posts: N`
- `Draft: N`
- `Scheduled: N`
- `Published: N`
- `Scheduled rate: P%` where P is scheduled ÷ total as a whole-number percent (0% when there are no posts).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with three initial posts:
1. Title: **Launch announcement**, Platform: **Twitter**, Status: **scheduled**
2. Title: **Case study**, Platform: **LinkedIn**, Status: **draft**
3. Title: **Product photo**, Platform: **Instagram**, Status: **published**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).