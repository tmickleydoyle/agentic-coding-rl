# Build a conversion funnel analytics app

I own growth analytics and I need an in-memory tool to model conversion funnels and see where users
drop off. Build a single-page React app with **four views** reached from a top nav bar:
**Funnels**, **Steps**, **Analysis**, and **Settings**. The app starts on Funnels. State is shared
across every view and kept in memory.

Two related entities. A **funnel** is a flow we want to measure (e.g. "Signup"). A **step** belongs
to one funnel, has a name, and records how many **users** reached it. Steps are shown and analyzed
in the order they were added — the first step added is the top of the funnel.

Navigation: a nav bar with a button for each view (**Funnels**, **Steps**, **Analysis**,
**Settings**).

**Funnels**
- A form with an input labeled **Funnel name** and an **Add funnel** button. Ignore a blank name
  (after trimming).
- A list shows each funnel as `Name (N steps)` where N is how many steps belong to it.

**Steps**
- A form to attach a step to a funnel: a **Funnel** selector listing existing funnels, an input
  labeled **Step name**, a number input labeled **Users**, and an **Add step** button.
- Users is a whole number; treat a blank or non-positive value as 0. Ignore the submission if no
  funnel is selected or the step name is blank (after trimming).
- A list shows each step as `Name: U users`.

**Analysis** — the per-funnel drop-off report. For each funnel, in step order:
- A line per step `Name: U users, D% drop-off`. The **drop-off** is the whole-number percent of
  users lost relative to the **previous** step: `100 − round(users / previousUsers × 100)`. The
  first step is the baseline, so its drop-off is always `0%`. If the previous step had 0 users,
  show `0%` drop-off (there is nothing to lose).
- After the steps, a line `Name overall conversion: C%` — the last step's users over the first
  step's users as a whole-number percent (0% when the funnel has no steps or the first step has 0
  users).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide empty funnels** checkbox; when checked, the Analysis view omits funnels that have no
  steps.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
