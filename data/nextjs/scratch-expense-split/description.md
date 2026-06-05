# Build a shared-expense splitter

Build a single-page React application that helps a group of friends split shared expenses
(like a trip or a shared house) and figure out who owes whom.

What the app should do:

- **People.** A user can add a person by typing into a **Person name** field and clicking
  **Add person**. The current people are listed. Don't add blank names or duplicate names.
- **Expenses.** A user can record an expense with a **Description**, an **Amount**, and a
  **Paid by** selector (one of the current people). Clicking **Add expense** records it and
  splits the amount **equally among all current people**. Ignore an expense with a blank
  description or a non-positive amount.
- **Balances.** Show each person's net balance — what they paid minus their share of every
  expense. Display it signed, formatted as money, like `Alice +$5.00` (owed money) or
  `Bob -$5.00` (owes money). A balanced person shows `+$0.00`.
- **Settlement.** Show the transfers that settle everyone up, one per line, written like
  `Bob pays Alice $5.00`. Use as few transfers as reasonably possible. When everyone is
  even, show a message like `All settled up`.

Example: with people Alice and Bob, if Alice pays a $10.00 expense, it splits $5.00 each, so
Alice's balance is `+$5.00`, Bob's is `-$5.00`, and the settlement reads `Bob pays Alice $5.00`.

All state is in memory (no backend). Implement the root component as the default export of
`app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
