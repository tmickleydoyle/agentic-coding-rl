# Build a poll / voting app

Build a single-page React application for creating polls and voting on them.

Seed the app with one existing poll so results are visible immediately:

- Question: **Best language?**
- Options and their current vote counts: **Python** = 3, **JavaScript** = 1, **Rust** = 0
  (4 votes total).

What the app should do:

- **Build a poll.** A **Question** field, plus an **Option** field with an **Add option** button
  that appends each typed option to a pending list. A **Create poll** button creates the poll and
  resets the form. Create is **disabled until** there is a non-blank question and **at least two**
  options. New polls start with zero votes on every option.
- **Each poll** shows its question and, for every option:
  - a button to vote for that option,
  - the running count and share written like `Python: 3 (75%)` — the percentage is that option's
    votes ÷ the poll's total votes, rounded to a whole number (0% when there are no votes yet),
  - a bar indicating that share, exposed as a progress bar whose current value equals the
    percentage.
- Show each poll's **total votes**, e.g. `Total votes: 4`.
- **One vote per poll.** After a user votes in a poll, that poll's vote buttons are disabled so
  they cannot vote again; the counts and percentages update immediately.

All state is in memory. Implement the root component as the default export of `app/page.tsx`. Use
only `react` and `react-dom` — no other libraries, no Next.js APIs.
