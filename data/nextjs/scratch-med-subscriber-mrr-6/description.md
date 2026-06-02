# Build a Subscriber MRR Tracker

Build a complete single-page React application for tracking subscribers and monthly recurring revenue (MRR). The app has **three views** navigated via a top nav bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the **Subscribers** view. All state is in-memory.

## Navigation
A nav bar with buttons **Subscribers**, **Dashboard**, and **Settings** switches the active view.

## Subscribers view
- An input labeled **Name** and a dropdown (select) labeled **Plan** let you add a new subscriber.
- Plans available in the dropdown: **Starter – $29/mo**, **Growth – $79/mo**, **Pro – $149/mo**.
- An **Add subscriber** button adds the subscriber (ignore if Name is blank).
- Each subscriber is shown in a list row with their name, their plan label (e.g. `Starter`), their monthly price formatted as `$29`, and a toggle button that reads **Deactivate** when the subscriber is active and **Activate** when inactive.
- New subscribers are active by default.
- A subscriber row shows `Active` or `Inactive` as a status label.
- Above the list, show the counts: `Active: N` and `Total: N` on the same line as one string `Active: N | Total: N`.

## Dashboard view
- Read-only summary computed from the subscribers list.
- Show these lines of text:
  - `Total subscribers: N`
  - `Active subscribers: N`
  - `MRR: $N` — sum of monthly prices of **active** subscribers only (whole number, no decimals)
  - `Inactive: N`

## Settings view
- A **Toggle theme** button switches between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.
- A **Hide inactive** checkbox (labeled **Hide inactive**); when checked, inactive subscribers are hidden from the Subscribers list (but still counted in the Dashboard).

## Seed data
Start with these three subscribers already present (active):
- Alice — Pro ($149/mo)
- Bob — Starter ($29/mo)
- Carol — Growth ($79/mo)

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
