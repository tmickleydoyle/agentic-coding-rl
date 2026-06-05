# Low-stock and reorder helper for my hardware store

I run a small hardware store and I keep losing track of what's running low. Build me a single-page
React app with **three views** from a top nav bar: **Inventory**, **Restock**, and **Report**. It
starts on **Inventory**. Everything lives in memory and is shared across the views.

Navigation: a nav bar with a button for each view (**Inventory**, **Restock**, **Report**).

**Inventory** — my item list.
- A form with inputs labeled **Item name**, **On hand** (a number), **Reorder level** (a number),
  and **Target** (a number), plus an **Add item** button. Ignore a blank name. On hand, reorder
  level and target each default to 0 if blank or negative, and are rounded down to whole numbers.
- A list shows each item as `Name: On hand X (reorder at Y)`. If the item is low — that is, on
  hand is **at or below** the reorder level — append the word ` LOW` to that same line, so it
  reads `Name: On hand X (reorder at Y) LOW`.

**Restock** — adjust quantities.
- A **Item** selector listing every item by name, an input labeled **Receive** (a number), and a
  **Receive stock** button that adds that many units to the chosen item's on hand (ignore a
  receive amount below 1; round down to whole units; ignore when no item is chosen).
- Also a **Sell** button next to an input labeled **Reduce** that subtracts that many units from
  the chosen item's on hand, but on hand never goes below 0 (same rounding/guards as Receive).

**Report** — what to buy.
- A summary line `Items low: N` counting how many items are currently low.
- For **each low item**, a line `Reorder Name: buy Z` where Z is how many units to order to bring
  it back up to its **target** — that is `Target − On hand`, but never less than 0. (Items that
  are not low are not listed here.)
- A summary line `Total to reorder: T` (the sum of every Z across all low items).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is just in-app state).
