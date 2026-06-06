# Executor Log App

A multi-route React application for tracking estate executor tasks, contacts, and overall progress.

## Routes
- `/` (Tasks): List executor tasks with title, description, due date, and status (Todo | InProgress | Done). Allow adding, deleting, and updating task status.
- `/contacts`: List executor contacts with name, role (Solicitor | Accountant | Bank | Other), and phone. Allow adding and deleting contacts.
- `/progress`: Show a progress bar (percentage Done tasks), count of Todo / InProgress / Done tasks, and list of overdue tasks (due date < today and status != Done).

## Seed Data (today = 2024-07-01 for test purposes)
Tasks:
- { id: "t1", title: "File Probate Application", description: "Submit to court", due: "2024-06-01", status: "Done" }
- { id: "t2", title: "Notify Banks", description: "Send death certificate", due: "2024-07-15", status: "InProgress" }
- { id: "t3", title: "Sell Property", description: "List on market", due: "2024-08-01", status: "Todo" }
- { id: "t4", title: "Close Tax Affairs", description: "File final return", due: "2024-06-30", status: "Todo" }

Contacts:
- { id: "c1", name: "James White", role: "Solicitor", phone: "01234 567890" }
- { id: "c2", name: "Sarah Green", role: "Accountant", phone: "09876 543210" }

## Behaviors
- Adding task: title (required) + description + due date + status; appends.
- Updating status: cycles Todo -> InProgress -> Done.
- Deleting removes item.
- Progress percentage = Done count / total count * 100 (0 if no tasks).
- Overdue = due < "2024-07-01" AND status != "Done" (use hardcoded date for determinism).
- NavBar: Tasks, Contacts, Progress.

## API
`GET /api/executor` returns `{ total: number, done: number, overdue: number }` (overdue uses same hardcoded date).

## Edge Cases
- No tasks: progress bar shows 0%, "No overdue tasks."
- No contacts: "No contacts found."
