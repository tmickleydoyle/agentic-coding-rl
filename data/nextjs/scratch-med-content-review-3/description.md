# Build a Content Review Tracker

Build a complete single-page React application for managing a list of content items under review. The app has **three views** navigated via a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. All state is kept in memory.

## Navigation
A nav bar with three buttons — **Reviews**, **Stats**, **Settings** — switches the active view.

## Reviews view
This is the main list view.

- An input labeled **Title** and an input labeled **Reviewer** plus an **Add item** button adds a new review item. Ignore the submission if either field is blank. New items start with status **draft**.
- Each item is displayed in a list row showing its title, reviewer name, and current status.
- Each row has a **Approve** button and a **Request changes** button that update that item's status to `approved` or `changes` respectively. A **Delete** button removes the item entirely.
- A filter control labeled **Filter by status** (a `<select>`) with options **All**, **draft**, **approved**, **changes** — filters the visible list. The heading above the list reads `Items (N)` where N is the count of currently visible items.
- Seed the app with these three items already present (in order):
  1. Title: `Homepage copy`, Reviewer: `Alice`, Status: `draft`
  2. Title: `Pricing page`, Reviewer: `Bob`, Status: `approved`
  3. Title: `About us`, Reviewer: `Alice`, Status: `changes`

## Stats view
A read-only derived summary:
- `Total items: N`
- `Draft: N`
- `Approved: N`
- `Changes requested: N`
- `Approved %: P%` where P is approved ÷ total as a whole-number percent (0% when total is 0).

Stats always reflect the full list (ignoring the filter).

## Settings view
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is stored in a `data-theme` attribute on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
