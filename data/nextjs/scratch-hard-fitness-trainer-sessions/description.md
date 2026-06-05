# Build a trainer scheduling app for my fitness studio

I run a personal-training studio and need a single-page app to track how booked up each trainer is.
It should have **four views** reached from a top navigation bar: **Trainers**, **Sessions**,
**Utilization**, and **Settings**. The app starts on Trainers. State is shared across every view and
kept in memory.

Navigation: a nav bar with a button for each view (**Trainers**, **Sessions**, **Utilization**,
**Settings**).

**Trainers**
- A form with an input labeled **Trainer name** and a number input labeled **Weekly hour cap**, plus
  an **Add trainer** button. Ignore a blank name or a cap that is not a positive whole number.
- A list showing each trainer as `Name (cap Hh)` — for example `Dana (cap 20h)`.

**Sessions**
- A **Trainer** selector listing trainers by name, an input labeled **Client name**, a number input
  labeled **Hours**, and an **Add session** button. Ignore the session if no trainer is chosen, the
  client name is blank, or hours is not a positive whole number.
- A list showing each session as `Client with Trainer Name (Hh)` — for example
  `Sam with Dana (2h)`.

**Utilization** — a cross-view summary.
- For each trainer a line `Name: B/Ch` where B is the total booked hours (the sum of that trainer's
  session hours) and C is the cap — for example `Dana: 6/20h`. When booked hours exceed the cap,
  also show `Name overbooked`.
- A final line `Studio utilization: P%` where P is total booked hours across all trainers divided by
  the total of all caps, as a whole-number percent (0% when there are no caps).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show fully booked only** checkbox; when checked, the Utilization list shows only trainers whose
  booked hours have reached or exceeded their cap (other trainers still count in the studio total).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
