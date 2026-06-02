# Build a Customer Reviews Manager

Build a complete single-page React application for managing customer reviews, with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of customer reviews.
- An input labeled **Customer name** and an input labeled **Rating** (a number 1–5) plus an **Add review** button adds a new review (ignore if customer name is blank or rating is not a whole number between 1 and 5 inclusive).
- Each review shows the customer name, the rating as `Rating: N`, and a **Mark responded** button. When clicked, the button changes to **Responded** (disabled) and the review is considered responded to.
- A **Show unresponded only** checkbox filters the list to show only reviews that have NOT yet been responded to. When unchecked, all reviews are shown.
- The heading above the list shows the count of currently visible reviews, like `Reviews (3)`.

**Stats** — a read-only summary computed from all reviews (regardless of filter):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: R` where R is the average of all ratings formatted to one decimal place (e.g. `Average rating: 4.2`), or `Average rating: –` when there are no reviews.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three reviews already present on first render:
1. Customer `Alice`, rating `5`, responded: false
2. Customer `Bob`, rating `3`, responded: true
3. Customer `Carol`, rating `4`, responded: false

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
