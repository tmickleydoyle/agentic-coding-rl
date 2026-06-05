# Build an email engagement app

I'm a growth PM and I want a single-page React tool to track our email blasts and see how each
subscriber list engages. Build it with **four views** reached from a top nav bar: **Blasts**,
**Lists**, **Overview**, and **Settings**. The app starts on Blasts. State is shared across all
views and kept in memory.

Every blast goes to one list: **Newsletter**, **Onboarding**, **Promotions**, **Winback**.

Navigation: a nav bar with a button for each view (**Blasts**, **Lists**, **Overview**,
**Settings**).

**Blasts**
- A form with an input labeled **Subject**, a **List** selector (Newsletter, Onboarding,
  Promotions, Winback), and three whole-number inputs labeled **Sent**, **Opens**, and **Clicks**.
  An **Add blast** button records it. Ignore a blast if any of sent, opens, or clicks is negative;
  zeros are allowed.
- A list shows each blast as `Subject — List: Sent sent, Opens opens, Clicks clicks`.

**Lists** — a per-list rollup. For each list that has at least one blast, show one line
`List: open rate O%, CTR C%` where the rates use the list's totals: the open rate is total opens
divided by total sent, and the CTR (click-through rate) is total clicks divided by total opens —
each as a whole-number percent. When total sent is 0 show `open rate n/a`; when total opens is 0
show `CTR n/a`. Lists with no blasts are not listed.

**Overview** — read-only summary lines across all blasts: `Total sent: N`, `Total opens: M`,
`Total clicks: K`, `Open rate: O%` (total opens / total sent, whole-number percent, `n/a` when no
sends), and `Click-through rate: C%` (total clicks / total opens, whole-number percent, `n/a` when
no opens).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show opened only** checkbox; when checked, the Blasts list hides blasts with 0 opens (they
  still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
