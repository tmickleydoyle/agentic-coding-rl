# Build a Customer Reviews app

Build a complete single-page React application — a customer review management tool — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of customer reviews.
- An input labeled **Customer name** and a number input labeled **Rating** (1–5) plus an **Add review** button adds a review (ignore blank customer name; clamp rating between 1 and 5).
- Each review shows the customer name, the rating as `Rating: N`, and a button labeled **Mark responded** that toggles the responded status. When a review has been responded to the button label changes to **Responded** (and clicking it again toggles it back to **Mark responded**).
- A button labeled **Show unresponded only** filters the list to only show reviews that have not yet been responded to. When the filter is active the button label changes to **Show all**.
- A count line at the top of the review list reads `Showing: N reviews`; it reflects the currently visible (filtered) count.
- Seed the app with three initial reviews: customer **Alice**, rating **5**, not responded; customer **Bob**, rating **3**, not responded; customer **Carol**, rating **4**, responded.

**Stats** — a read-only summary computed from ALL reviews (not filtered):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: R` where R is the average of all ratings rounded to one decimal place (show `0.0` when there are no reviews).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
