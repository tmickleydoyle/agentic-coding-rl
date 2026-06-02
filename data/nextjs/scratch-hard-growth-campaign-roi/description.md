# Build a campaign performance app

I'm a growth PM and I need a single-page React tool to track paid campaigns and see how each
acquisition channel is performing. Build it with **four views** reached from a top nav bar:
**Campaigns**, **Channels**, **Overview**, and **Settings**. The app starts on Campaigns. State is
shared across all views and kept in memory.

Every campaign runs on one of four channels: **Search**, **Social**, **Email**, **Display**. Each
conversion is worth **$50** in revenue.

Navigation: a nav bar with a button for each view (**Campaigns**, **Channels**, **Overview**,
**Settings**).

**Campaigns**
- A form with an input labeled **Name**, a **Channel** selector (Search, Social, Email, Display),
  an input labeled **Spend** (a number, dollars), and an input labeled **Conversions** (a whole
  number). An **Add campaign** button records it. Ignore a campaign whose spend is negative or
  whose conversions is negative; spend of 0 and conversions of 0 are allowed.
- A list shows each campaign as `Name — Channel: $Spend spent, Conversions conversions`.

**Channels** — a per-channel rollup. For each channel that has at least one campaign, show one line
`Channel: $Spend spent, Conversions conversions, CPA $X` where Spend and Conversions are the totals
across that channel's campaigns and CPA (cost per acquisition) is total spend divided by total
conversions, rounded to the nearest whole dollar. When a channel has 0 conversions, show `CPA n/a`
instead of a dollar amount. Channels with no campaigns are not listed.

**Overview** — read-only summary lines across all campaigns: `Total spend: $X`,
`Total conversions: N`, `Total revenue: $R` (conversions times $50), `Blended CAC: $C` (total spend
divided by total conversions, rounded to the nearest whole dollar; `n/a` when there are no
conversions), and `ROAS: Vx` (total revenue divided by total spend, to one decimal place; `n/a`
when total spend is 0).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show active only** checkbox; when checked, the Campaigns list hides campaigns with 0
  conversions (they still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
