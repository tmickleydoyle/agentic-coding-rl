# Build a Customer Reviews app

Build a complete single-page React application — a customer review management tool — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

## Seed data

Pre-populate the app with exactly these three reviews so the Stats view has something to show immediately:

| Customer | Rating | Responded |
|---|---|---|
| Alice | 5 | false |
| Bob | 3 | true |
| Carol | 4 | false |

**Reviews** — the main list of customer reviews.
- An input labeled **Customer name** and a number input labeled **Rating (1-5)** plus an **Add review** button adds a new review (ignore a blank customer name; clamp rating to 1–5).
- Each review shows: the customer name, `Rating: N` (where N is the 1–5 number), and a **Mark responded** button (when not yet responded) or a **Responded** button (when already responded, and disabled).
- Clicking **Mark responded** toggles that review's responded state to true.
- A checkbox labeled **Show unresponded only** filters the list to show only reviews where responded is false. When unchecked all reviews are shown.
- The heading above the list reads `Reviews (N)` where N is the count of currently visible reviews (respecting the filter).

**Stats** — a read-only summary computed from ALL reviews (ignoring the filter):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: R` where R is the average of all ratings rounded to one decimal place (show `0.0` when there are no reviews).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is shown on the button as `Toggle theme (current: light)` or `Toggle theme (current: dark)`. The theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
