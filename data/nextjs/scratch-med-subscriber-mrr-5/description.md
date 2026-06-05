# Build a Subscriber MRR Tracker

Build a complete single-page React application — a subscriber management tool for a small SaaS business — with **three views** the user navigates between using a top navigation bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the Subscribers view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Subscribers**, **Dashboard**, **Settings**) switches the active view.

**Subscribers** — the main list of subscribers.
- A form with three inputs:
  - **Name** (text input, labeled **Name**)
  - **Plan** (a `<select>` labeled **Plan**) with options: **Starter ($29/mo)**, **Pro ($79/mo)**, **Enterprise ($199/mo)**
  - An **Add Subscriber** button that adds the subscriber (ignore if Name is blank)
- Each subscriber row shows their name, plan label (e.g. `Starter`), monthly price (e.g. `$29`), and an **Active** toggle checkbox (labeled `Active` per row, but implemented as `aria-label="Active: <name>"`) that controls whether they are active.
- Each subscriber row also has a **Remove** button (aria-label `Remove <name>`) that deletes the subscriber.
- The list shows a live count at the top: **Subscribers (N)** where N is the total number of subscribers (active and inactive).

**Dashboard** — a read-only summary computed from the subscriber list:
- `Total subscribers: N` — all subscribers regardless of active status
- `Active subscribers: N` — only active ones
- `Monthly Recurring Revenue: $N` — sum of monthly prices for active subscribers only, formatted as a whole-number dollar amount (e.g. `Monthly Recurring Revenue: $108`)
- `Average MRR per active subscriber: $N` — MRR ÷ active count as a whole-number dollar amount, shown as `$0` when there are no active subscribers

**Settings** — a simple preferences view:
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element. The button label shows the current theme, e.g. `Toggle theme (current: light)`.
- Theme persists as the user navigates between views.

## Seed data
The app starts with these three subscribers already in the list (all active):
1. Name: `Alice`, Plan: Starter ($29/mo), active: true
2. Name: `Bob`, Plan: Pro ($79/mo), active: true
3. Name: `Carol`, Plan: Enterprise ($199/mo), active: true

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).