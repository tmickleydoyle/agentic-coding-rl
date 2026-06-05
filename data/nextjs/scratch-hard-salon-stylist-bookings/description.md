# Build a salon booking app

I run a small hair salon and need a single-page React app to track appointments across my team.
Give me **four views** reached from a top nav bar: **Appointments**, **Stylists**, **Reports**, and
**Settings**. The app starts on Appointments. State is shared across all views and kept in memory.

My three stylists are **Ava**, **Mia**, and **Leo**. I offer three services with fixed prices:
**Haircut** ($40), **Color** ($90), and **Blowout** ($35).

Navigation: a nav bar with a button for each view (**Appointments**, **Stylists**, **Reports**,
**Settings**).

**Appointments**
- A booking form with an input labeled **Client**, a **Stylist** selector (Ava, Mia, Leo), and a
  **Service** selector (Haircut, Color, Blowout). A **Book appointment** button records it. Ignore
  a blank client name. Each new appointment starts with status **booked** and takes its price from
  the chosen service.
- A list shows each appointment as `Client with Stylist: Service ($Price) — Status`. While an
  appointment is still **booked**, it has a **Complete** control and a **Cancel** control that set
  its status to completed or cancelled. Once it is completed or cancelled those controls disappear.

**Stylists** — for each of the three stylists a line `Name: B bookings, $R earned`, where **B** is
the number of that stylist's appointments that are **not cancelled** (booked or completed), and
**R** is the total price of that stylist's **completed** appointments.

**Reports** — read-only summary lines: `Total appointments: N`, `Completed: C`, `Cancelled: X`,
`Total revenue: $R` (sum of prices of completed appointments), and `Cancellation rate: P%`
(cancelled ÷ total appointments as a whole-number percent; 0% when there are no appointments).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide cancelled** checkbox; when checked, the Appointments list hides cancelled appointments
  (they still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
