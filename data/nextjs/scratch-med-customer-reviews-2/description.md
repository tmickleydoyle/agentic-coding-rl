# Build a Customer Reviews Manager

Build a complete single-page React application — a small internal tool for tracking customer reviews — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of customer reviews.
- An input labeled **Customer name** and a number input labeled **Rating** (integer 1–5) plus an **Add review** button adds a new review (ignore blank customer name; default rating to 1 if out of range). New reviews default to unresponded.
- Each review entry shows the customer name, the rating as `Rating: N`, and a toggle button labeled **Mark responded** (when unresponded) or **Mark unresponded** (when already responded).
- A checkbox labeled **Show unresponded only** filters the list to only show unresponded reviews when checked. The checkbox state persists when navigating away and back.
- The heading above the list reads `Reviews (N)` where N is the count of currently displayed reviews (filtered or all).

**Stats** — a read-only summary computed from all reviews (unfiltered):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: X.X` where X.X is the average of all ratings rounded to one decimal place (show `0.0` when there are no reviews).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with no initial reviews. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
