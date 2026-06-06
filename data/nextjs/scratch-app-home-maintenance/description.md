# Home Maintenance App

Track home maintenance tasks, history, and organize by room.

## Routes
- **Home** (`home`): Dashboard with total tasks count, overdue tasks count (dueDate before today), and completed tasks count.
- **Tasks** (`tasks`): List maintenance tasks with title, room, dueDate, priority (low/medium/high), status (pending/completed). Add new task. Mark task complete. Delete task.
- **History** (`history`): List completed tasks sorted by completedDate descending. Shows title, room, completedDate.
- **Rooms** (`rooms`): List distinct rooms with count of tasks per room.

## Seed Data
Tasks:
1. Replace HVAC filter, Kitchen, dueDate: 2024-06-01, priority: high, status: pending
2. Clean gutters, Exterior, dueDate: 2024-05-15, priority: medium, status: completed, completedDate: 2024-05-14
3. Fix leaky faucet, Bathroom, dueDate: 2024-06-20, priority: high, status: pending
4. Paint walls, Living Room, dueDate: 2024-07-01, priority: low, status: pending

## Fields & Validation
- Task: title (required), room (required), dueDate (required), priority low|medium|high, status pending|completed
- Marking complete sets status=completed and completedDate=today

## Behaviors
- Tasks page: filter by status using a select (all/pending/completed)
- Overdue = pending tasks with dueDate before today (2024-06-10 for test purposes)
- Rooms page: aggregates tasks by room, shows room name and task count
- API returns 400 for missing required fields

## API
- GET/POST /api/tasks — list / create task
- PATCH /api/tasks — mark complete `{ id }`
- DELETE /api/tasks — delete `{ id }`
- GET /api/history — list completed tasks

## data-testid Requirements
- nav-home, nav-tasks, nav-history, nav-rooms
- dashboard-task-count, dashboard-overdue-count, dashboard-completed-count
- task-list, task-item, task-status-filter, add-task-form, task-title-input, task-room-input, task-due-date-input, task-priority-select, submit-task, complete-task, delete-task
- history-list, history-item
- room-list, room-item
