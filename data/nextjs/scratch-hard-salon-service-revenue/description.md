# Build a salon sales-tracking app

I run a salon and want to see which services make me the most money. Build a single-page React app
with **four views** reached from a top nav bar: **Sales**, **Services**, **Reports**, and
**Settings**. The app starts on Sales. State is shared across all views and kept in memory.

I offer three services at fixed prices: **Haircut** ($40), **Color** ($90), and **Manicure** ($25).
Every sale may also include a cash **tip**.

Navigation: a nav bar with a button for each view (**Sales**, **Services**, **Reports**,
**Settings**).

**Sales**
- A form with an input labeled **Client**, a **Service** selector (Haircut, Color, Manicure), and a
  number input labeled **Tip**. A **Record sale** button records it. Ignore a blank client name. A
  blank or negative tip counts as $0.
- A list shows each sale as `Client: Service $Price + $Tip tip` (Price is the service's fixed
  price), for example `Dana: Color $90 + $10 tip`.

**Services** — for each of the three services a line `Service: N sold, $R revenue`, where **N** is
how many sales used that service and **R** is that service's total revenue: the sum, over its sales,
of the service price plus that sale's tip.

**Reports** — read-only summary lines: `Total sales: N`, `Total revenue: $R` (price plus tip summed
over all sales), `Total tips: $T`, `Average sale: $A` (total revenue ÷ number of sales, rounded to a
whole number; $0 when there are no sales), and `Top service: S` (the service with the highest total
revenue, or `None` when there are no sales).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide untipped sales** checkbox; when checked, the Sales list hides sales with a $0 tip (they
  still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
