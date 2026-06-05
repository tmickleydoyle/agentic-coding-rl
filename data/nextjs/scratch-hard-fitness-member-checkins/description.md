# Build a member check-in tracker for my gym

I run a gym and want a single-page app to track member attendance against their monthly visit goals.
It should have **four views** reached from a top navigation bar: **Members**, **Check-ins**,
**Progress**, and **Settings**. The app starts on Members. State is shared across every view and
kept in memory.

Navigation: a nav bar with a button for each view (**Members**, **Check-ins**, **Progress**,
**Settings**).

**Members**
- A form with an input labeled **Member name** and a number input labeled **Monthly goal**, plus an
  **Add member** button. Ignore a blank name or a goal that is not a positive whole number.
- A list showing each member as `Name (goal G)`.

**Check-ins**
- A **Member** selector listing members by name and a **Check in** button that records one visit for
  the chosen member. Do nothing if no member is selected.
- A list showing each member as `Name: C check-ins` where C is that member's recorded visit count.

**Progress** — a cross-view summary.
- For each member a line `Name: V/G visits` where V is the member's check-in count and G is the goal.
  When V reaches or exceeds the goal, also show `Name goal met`.
- Then a **Leaderboard** heading followed by every member ranked by visit count, highest first, each
  as `Rank N: Name (V)`. Members with the same visit count keep the order they were added in.

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide members who met goal** checkbox; when checked, the per-member progress lines hide any
  member who has met their goal (they still appear on the leaderboard and count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
