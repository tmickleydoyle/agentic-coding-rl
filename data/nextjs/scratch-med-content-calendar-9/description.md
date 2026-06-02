# Build a Content Calendar app

Build a complete single-page React application — a simple content calendar tool for a small marketing team — with **three views** the user navigates between using a top navigation bar: **Posts**, **Stats**, and **Settings**. The app starts on the Posts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Posts**, **Stats**, **Settings**) switches the active view.

**Posts** — the main content list view.
- An input labeled **Title** for the post title.
- A select labeled **Platform** with options: **Twitter**, **Instagram**, **LinkedIn**.
- A select labeled **Status** with options: **draft**, **scheduled**, **published**.
- An **Add Post** button that adds the post to the list (ignore a blank title).
- The list shows all posts (subject to the active filter, see below).
- Each post shows its title, platform, and status on one row.
- Each post has a **Delete** button that removes it.
- Each post has a **Mark Published** button that sets its status to **published** (the button is disabled when the post is already published).
- A filter control: a select labeled **Filter by status** with options **All**, **draft**, **scheduled**, **published**. Selecting a value filters the visible list; the default is **All**.
- A summary line below the filter shows `Scheduled: N` where N is the total number of scheduled posts across ALL posts (not just the filtered view).

**Stats** — a read-only derived summary:
- `Total posts: N`
- `Draft: N`
- `Scheduled: N`
- `Published: N`
- `Twitter: N`, `Instagram: N`, `LinkedIn: N`
- `Published rate: P%` where P is published ÷ total as a whole-number percent (0% when there are no posts).

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with these three initial posts so tests can rely on them:
1. Title: **Launch announcement**, Platform: **Twitter**, Status: **published**
2. Title: **Product demo**, Platform: **LinkedIn**, Status: **scheduled**
3. Title: **Behind the scenes**, Platform: **Instagram**, Status: **draft**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
