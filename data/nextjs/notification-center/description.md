# Notification center

Implement a client component `NotificationCenter` in `components/NotificationCenter.tsx`:

- Accepts `notifications: { id: string; text: string }[]`.
- Two views:
  - **Inbox** (initial): `<ul data-testid="inbox">` with one `<li>` per notification. Each `<li>` contains the text and a `<button data-testid="open-<id>">"Open"</button>`. A `<span data-testid="unread">` shows the count of UNREAD notifications (initially equal to `notifications.length`).
  - **Reader** (after clicking Open): renders `<p data-testid="reading">` with the notification's text and `<button data-testid="back">"Back"</button>`.
- Opening a notification marks it as **read** (decrementing the unread count). Opening an already-read notification does NOT change the count.
- The two views are mutually exclusive — inbox is hidden while reading and vice versa.
- The Back button returns to the inbox; visited notifications remain marked read.

Default export.
