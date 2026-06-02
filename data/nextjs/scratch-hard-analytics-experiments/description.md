# Build an A/B experiment analytics app

I run our experimentation program and I need a small in-memory tool to track A/B tests and see
which variant is winning. Build a single-page React app with **four views** reached from a top
nav bar: **Experiments**, **Variants**, **Results**, and **Settings**. The app starts on
Experiments. State is shared across every view and kept in memory.

We have two related entities. An **experiment** is a test we're running (e.g. "Checkout button
color"). A **variant** belongs to one experiment and records how many **visitors** saw it and how
many **conversions** it produced.

Navigation: a nav bar with a button for each view (**Experiments**, **Variants**, **Results**,
**Settings**).

**Experiments**
- A form with an input labeled **Experiment name** and an **Add experiment** button. Ignore a
  blank name (after trimming).
- A list shows each experiment as `Name (N variants)` where N is how many variants currently
  belong to it.

**Variants**
- A form to attach a variant to an experiment: an **Experiment** selector listing the existing
  experiments, an input labeled **Variant name**, a number input labeled **Visitors**, a number
  input labeled **Conversions**, and an **Add variant** button.
- Visitors and conversions are whole numbers; treat a blank or non-positive value as 0. Ignore the
  submission if no experiment is selected, if the name is blank (after trimming), or if
  conversions exceed visitors.
- A list shows each variant as `Name: Conversions/Visitors (R%)` where R is the **conversion
  rate** — conversions divided by visitors as a whole-number percent, and 0% when visitors is 0.

**Results** — the cross-experiment summary:
- `Total visitors: V` (sum of visitors across all variants), `Total conversions: C` (sum across
  all variants), and `Overall conversion rate: R%` (total conversions over total visitors as a
  whole-number percent, 0% when there are no visitors).
- For each experiment, a line `Name winner: Variant (R%)` naming the variant with the highest
  conversion rate (on a tie, the one added first), or `Name winner: none` when the experiment has
  no variants.

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Hide empty experiments** checkbox; when checked, the Results view omits experiments that
  have no variants.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
