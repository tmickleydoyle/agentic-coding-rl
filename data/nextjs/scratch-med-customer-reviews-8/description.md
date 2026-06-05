# Build a Customer Reviews Manager

Build a complete single-page React application for managing customer reviews, with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of customer reviews.
- A form at the top with:
  - An input labeled **Customer name** for the reviewer's name.
  - An input labeled **Rating** for a numeric rating from 1 to 5.
  - An **Add review** button that adds the review (ignore if name is blank or rating is not a whole number between 1 and 5 inclusive).
- A **Show unresponded only** checkbox that, when checked, filters the list to show only reviews that have not been responded to.
- Each review shows the customer name, the rating formatted as `Rating: N`, and a **Mark responded** button. Clicking **Mark responded** toggles that review's responded status. Once responded, the button label changes to **Responded** and the button is disabled.
- The total number of reviews currently visible in the list is shown as `Showing: N reviews`.

Seed the app with these three reviews on first load (already in state before any user interaction):
1. Customer: **Alice**, Rating: **5**, responded: **false**
2. Customer: **Bob**, Rating: **3**, responded: **true**
3. Customer: **Carol**, Rating: **4**, responded: **false**

**Stats** — a read-only summary computed from ALL reviews (not filtered):
- `Total reviews: N`
- `Responded: N`
- `Unresponded: N`
- `Average rating: X.X` where X.X is the mean rating across all reviews rounded to one decimal place (show `Average rating: 0.0` when there are no reviews).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
