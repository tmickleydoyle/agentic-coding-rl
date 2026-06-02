# Build a referral program app

I'm a growth PM running our referral program and I need a single-page React tool to see which
acquisition sources actually convert invites into signups. Build it with **four views** reached from
a top nav bar: **Referrals**, **Sources**, **Funnel**, and **Settings**. The app starts on
Referrals. State is shared across all views and kept in memory.

Every referral record belongs to one source: **Organic**, **Paid**, **Partner**, **Influencer**.
We pay a **$20** bounty for every successful signup.

Navigation: a nav bar with a button for each view (**Referrals**, **Sources**, **Funnel**,
**Settings**).

**Referrals**
- A form with an input labeled **Referrer**, a **Source** selector (Organic, Paid, Partner,
  Influencer), an input labeled **Invites** (a whole number) and an input labeled **Signups** (a
  whole number). An **Add referral** button records it. Ignore a record whose invites is negative
  or whose signups is negative; zeros are allowed.
- A list shows each record as `Referrer — Source: Invites invites, Signups signups`.

**Sources** — a per-source rollup. For each source that has at least one referral record, show one
line `Source: Invites invites, Signups signups, rate P%` where Invites and Signups are the totals
across that source's records and rate is total signups divided by total invites as a whole-number
percent. When a source has 0 invites, show `rate n/a` instead of a percentage. Sources with no
records are not listed.

**Funnel** — read-only summary lines across all records: `Total invites: N`, `Total signups: M`,
`Conversion rate: P%` (total signups divided by total invites as a whole-number percent; `n/a` when
there are no invites), and `Bounty owed: $B` (total signups times $20).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show converted only** checkbox; when checked, the Referrals list hides records with 0 signups
  (they still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
