# Cash drawer ledger for my market stall

I run a market stall and I want to track money in and out of my cash drawer by category, and see a
running balance. Build a single-page React app with **three views** from a top nav bar: **Ledger**,
**Categories**, and **Report**. It starts on **Ledger**. State is in memory and shared.

There are three categories: **Sales**, **Supplies**, and **Other**.

Navigation: a nav bar with a button for each view (**Ledger**, **Categories**, **Report**).

**Ledger** — record cash movements (newest entries appear at the bottom of the list).
- A form with an input labeled **Memo**, an input labeled **Amount** (a number), a **Category**
  selector (Sales, Supplies, Other), and a **Type** selector with options **in** and **out**, plus
  an **Add entry** button. Ignore an amount that is not greater than 0. An `in` entry adds to the
  balance; an `out` entry subtracts.
- The list shows each entry, in the order added, as
  `Memo: +$Amount [Category] balance $Running` for an `in` entry, or
  `Memo: -$Amount [Category] balance $Running` for an `out`, where **Running** is the overall
  running balance **after** that entry (starting from 0, counting every prior entry of every
  category in order).

**Categories** — per-category totals.
- For each of the three categories a line `Category: in $I, out $O, net $N` where I is the sum of
  that category's `in` amounts, O is the sum of its `out` amounts, and N is `I − O`.

**Report** — the bottom line.
- A line `Money in: $TI` (sum of all `in` amounts) and `Money out: $TO` (sum of all `out`
  amounts).
- A line `Balance: $B` where B is `TI − TO`.
- A line `Biggest category: Name` naming the category with the highest **net** (in − out); ties go
  to the category listed first in the order Sales, Supplies, Other; show `Biggest category: none`
  when there are no entries at all.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is just in-app state).
