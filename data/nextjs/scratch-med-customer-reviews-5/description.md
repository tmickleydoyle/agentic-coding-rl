# Build a Customer Reviews app

Build a complete single-page React application — a customer review management tool — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

## Seed data

The app starts with these three reviews already loaded:

| Customer | Rating | Responded |
|---|---|---|
| Alice | 5 | false |
| Bob | 3 | true |
| Carol | 4 | false |

## Reviews view

This is the main list view.

- An input labeled **Customer name** and a number input labeled **Rating (1-5)** plus an **Add review** button adds a new review (ignore if customer name is blank or rating is not 1–5). New reviews start with responded = false.
- Each review row shows: the customer name, the rating displayed as `Rating: N`, and a toggle button whose visible label is **Mark responded** when unresponded, or **Mark unresponded** when already responded.
- A **Filter: unresponded only** checkbox (unchecked by default) — when checked, only reviews where responded = false are shown.
- The heading shows a live count of currently visible rows: `Reviews (N)`.

## Stats view

A read-only summary computed from **all** reviews (ignoring the filter):

- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: X.X` — the mean of all ratings rounded to one decimal place (show `0.0` when there are no reviews).

## Settings view

- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
