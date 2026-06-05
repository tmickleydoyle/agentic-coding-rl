# Build a Customer Reviews Manager

Build a complete single-page React application — a small internal tool for tracking customer reviews — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of customer reviews.
- An input labeled **Customer name** for the reviewer's name.
- An input labeled **Rating** for a numeric rating from 1 to 5.
- An **Add review** button that adds the review (ignore if name is blank or rating is not a number between 1 and 5 inclusive).
- Each review shows the customer name, the rating as `Rating: N` (where N is the number), and a **Mark responded** button. Clicking **Mark responded** toggles the review's responded status. When responded, show the text `Responded` next to the review and change the button label to **Mark unresponded**.
- A checkbox labeled **Show unresponded only** — when checked, only reviews that have NOT been responded to are shown in the list. The total count in the heading always reflects the unfiltered list.
- The section heading always shows the total number of reviews as `Reviews (N)` where N is the total count of all reviews (not the filtered count).

**Stats** — a read-only summary computed from all reviews (unaffected by the filter):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: R` where R is the average rating rounded to one decimal place (show `0.0` when there are no reviews).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with **no reviews** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
