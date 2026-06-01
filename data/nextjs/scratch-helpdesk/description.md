# Build a Help Desk Support Queue

Build a single-page React application for managing a support ticket queue.

## Creating Tickets

- A user can create a new ticket by typing a title into a **Ticket title** field and clicking a **Create ticket** button.
- Blank (empty/whitespace) titles should be ignored and do nothing.
- The input should clear after a ticket is successfully created.
- New tickets always start with the status **Open**.

## Ticket List

All tickets (subject to the active filter — see below) are displayed in a list. Each ticket shows:
- Its title
- Its current status (one of **Open**, **In Progress**, or **Closed**)
- An **Advance** button that moves the ticket forward through the status pipeline:
  - Open → In Progress → Closed
  - A ticket that is already **Closed** cannot be advanced; its **Advance** button must be disabled.

## Filtering

Above the ticket list, show three filter buttons: **Show Open**, **Show In Progress**, and **Show Closed**, plus a **Show All** button. Clicking a filter button shows only tickets with that status. Clicking **Show All** removes the filter and shows every ticket. The app starts with **Show All** active (no filter).

## Status Counts

Below the filter buttons, always display a summary line in exactly this format:
`Open: 2 | In Progress: 1 | Closed: 0`

The counts reflect ALL tickets regardless of the active filter, and update immediately as tickets are created or advanced.

## Heading

The page heading should read **Support Queue**.

State is kept in memory — no backend or persistence needed. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
