# Build a Customer Reviews Manager

Build a complete single-page React application for managing customer reviews, with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of customer reviews.
- An input labeled **Customer name** and a numeric input labeled **Rating (1-5)** (whole numbers 1 through 5), plus an **Add review** button adds a review (ignore a blank customer name or a rating outside 1–5).
- Each review row shows the customer name, their rating as `Rating: N`, and a **Mark responded** button (or **Mark unresponded** if already responded) that toggles the responded status.
- A **Show unresponded only** checkbox, when checked, hides reviews that have already been responded to, showing only the unresponded ones.
- The heading above the list shows the live count of currently visible reviews like `Reviews (3)`.

**Stats** — a read-only summary derived from all reviews (not filtered):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: X.X` where X.X is the average of all ratings formatted to one decimal place (show `Average rating: 0.0` when there are no reviews).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with these three reviews already present on first render:
1. Customer: `Alice`, Rating: `5`, responded: `true`
2. Customer: `Bob`, Rating: `3`, responded: `false`
3. Customer: `Carol`, Rating: `4`, responded: `false`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
