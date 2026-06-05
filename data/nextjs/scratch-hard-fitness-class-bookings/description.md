# Build a class booking app for my fitness studio

I run a small fitness studio and need a single-page app to manage class sign-ups. It should have
**four views** reached from a top navigation bar: **Classes**, **Bookings**, **Roster**, and
**Settings**. The app starts on Classes. State is shared across every view and kept in memory.

Navigation: a nav bar with a button for each view (**Classes**, **Bookings**, **Roster**,
**Settings**).

**Classes**
- A form with an input labeled **Class name** and a number input labeled **Capacity**, plus an
  **Add class** button that creates the class. Ignore a blank name or a capacity that is not a
  positive whole number.
- A list showing each class as `Name (capacity N)`.

**Bookings**
- A **Class** selector listing the classes by name, an input labeled **Member name**, and a
  **Book spot** button. Booking does nothing if no member name is given or no class is chosen.
- Here is the important rule: each class only has so many confirmed spots (its capacity). When a
  member books a class that already has its capacity in confirmed spots, the member is **added to
  the waitlist** instead of getting a confirmed spot.
- A list shows every booking as `Member - Class Name` for a confirmed spot, or
  `Member - Class Name (waitlisted)` for a waitlisted one. Each booking row has a **Cancel** button
  (label it `Cancel <Member>`). When a *confirmed* booking is cancelled and that class has anyone on
  the waitlist, the earliest waitlisted member for that class is promoted to a confirmed spot.

**Roster** — a cross-view summary. For each class show a line `Name: C/N booked` where C is the
number of confirmed bookings and N is the capacity. When confirmed bookings reach the capacity also
show `Name FULL`. When a class has waitlisted members also show `Name waitlist: W` where W is the
count of waitlisted bookings for that class.

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide full classes** checkbox; when checked, the Roster hides any class whose confirmed
  bookings have reached capacity (those classes still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
