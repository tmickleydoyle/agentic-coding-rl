# Task Board

A multi-route Kanban-style task board application.

## Routes
- `/home` — Dashboard: total task count, count per status, quick-add link
- `/board` — Kanban view: three columns (Todo, In Progress, Done); tasks in each column; move task to next status
- `/completed` — List of all completed (Done) tasks with option to reopen (move back to Todo)
- `/settings` — Manage labels: add new label, list existing labels

## Data Model

### Task
```ts
{ id: string; title: string; description: string; status: 'todo' | 'inprogress' | 'done'; label: string; priority: 'low' | 'medium' | 'high' }
```

### Label
```ts
{ id: string; name: string }
```

## Seed Data
Labels: `[{id:"l1",name:"Bug"},{id:"l2",name:"Feature"},{id:"l3",name:"Docs"}]`

Tasks:
```
{id:"t1", title:"Fix login bug", description:"Users can't log in", status:"todo", label:"Bug", priority:"high"}
{id:"t2", title:"Add dark mode", description:"Theme toggle", status:"inprogress", label:"Feature", priority:"medium"}
{id:"t3", title:"Update README", description:"Add setup guide", status:"done", label:"Docs", priority:"low"}
{id:"t4", title:"Write unit tests", description:"Cover auth module", status:"todo", label:"Feature", priority:"high"}
```

## Behaviors
- Add task (from board page): title (required), description (optional), label (select), priority (select: low/medium/high), starts as 'todo'
- Move task forward: todo→inprogress→done; button labeled "Move Forward"
- Reopen task: done→todo; from completed page
- Add label: name (required, unique case-insensitive)
- Home: shows counts for each status
- Board: groups tasks by status column

## Edge Cases
- Cannot add task with empty title
- Cannot add duplicate label
- Moving a done task forward does nothing (no button shown)
- Reopening updates board immediately

## UI Requirements
- NavBar: `data-testid="nav-home"`, `data-testid="nav-board"`, `data-testid="nav-completed"`, `data-testid="nav-settings"`
- Task cards: `data-testid="task-card-{id}"`
- Move forward button: `data-testid="move-forward-{id}"`
- Reopen button: `data-testid="reopen-task-{id}"`
- Add task form: `data-testid="task-title"`, `data-testid="task-description"`, `data-testid="task-label"`, `data-testid="task-priority"`, `data-testid="add-task-btn"`
- Task error: `data-testid="task-error"`
- Home counts: `data-testid="count-todo"`, `data-testid="count-inprogress"`, `data-testid="count-done"`
- Label rows: `data-testid="label-row-{id}"`
- Add label form: `data-testid="label-name"`, `data-testid="add-label-btn"`
- Label error: `data-testid="label-error"`
