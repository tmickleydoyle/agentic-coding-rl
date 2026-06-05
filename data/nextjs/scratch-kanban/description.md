# Build a Kanban board

Build a single-page React application for tracking work across a simple Kanban board.

The board has three columns, in this order: **Backlog**, **In Progress**, and **Done**.

What the app should do:

- A user can add a new card by typing a title into a **Card title** field and clicking an
  **Add card** button. New cards always start in the **Backlog** column. Adding a blank
  (empty/whitespace) title should do nothing, and the input should clear after a card is added.
- Each card shows its title and has two buttons: **Move left** and **Move right**, which move
  that card to the adjacent column. A card in Backlog cannot move left, and a card in Done
  cannot move right (those buttons are disabled at the ends).
- Each column shows its name together with a live count of the cards currently in it, written
  like `Backlog (0)`, `In Progress (2)`, `Done (1)`. The counts update immediately as cards are
  added or moved.

Cards are independent — moving one card must not affect the others. State is kept in memory
(no backend, no persistence needed).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs.
