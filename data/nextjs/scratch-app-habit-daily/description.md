# Daily Habit Tracker

A daily habit tracking app where users manage habits, log daily completions, and view statistics.

## Routes
- `/` → Home: today's date, count of habits, count completed today
- `/habits` → Habits list: all habits with name, frequency, category; add new habit form
- `/log` → Daily Log: for each habit, show a checkbox to mark complete for today; completions persisted per date
- `/stats` → Stats: per-habit completion count (total completions across all days)

## Data Model

### Habit
```ts
interface Habit {
  id: string
  name: string
  frequency: 'daily' | 'weekly'
  category: string
}
```

### HabitLog
```ts
interface HabitLog {
  id: string
  habitId: string
  date: string  // YYYY-MM-DD
  completed: boolean
}
```

## Seed Data
Habits:
- { id: "h1", name: "Morning Run", frequency: "daily", category: "Health" }
- { id: "h2", name: "Read 30min", frequency: "daily", category: "Learning" }
- { id: "h3", name: "Weekly Review", frequency: "weekly", category: "Productivity" }

HabitLogs (today = use store's TODAY constant = "2026-06-06"):
- { id: "l1", habitId: "h1", date: "2026-06-06", completed: true }
- { id: "l2", habitId: "h2", date: "2026-06-05", completed: true }
- { id: "l3", habitId: "h1", date: "2026-06-05", completed: true }

## Behaviors

### Home Page
- data-testid="today-date": today's date string (from store TODAY constant "2026-06-06")
- data-testid="habit-count": total number of habits (3)
- data-testid="completed-today": count of habits completed today (1 — only h1 on 2026-06-06)

### Habits Page
- Each habit: data-testid="habit-item-{id}"
- Shows name, frequency, category
- Add form: name, frequency (select: daily/weekly), category
- Submit: data-testid="add-habit-btn"

### Log Page
- For each habit, show: data-testid="log-check-{habitId}" — checkbox
- Checkbox is checked if a log entry exists for that habit on TODAY with completed=true
- Clicking checkbox toggles completion for today (add entry if none, toggle completed if exists)

### Stats Page
- For each habit: data-testid="stat-{habitId}" showing total completed logs count
- h1 has 2 completions (l1, l3), h2 has 1 (l2), h3 has 0

## API Routes
- GET /api/habits → { habits: Habit[] }
- POST /api/habits → body { name, frequency, category } → created Habit
- GET /api/habits/logs → { logs: HabitLog[] }
- POST /api/habits/logs → body { habitId, date, completed } → created or updated HabitLog

## Edge Cases
- Stats show 0 for habits with no logs
- Log page checkboxes reflect actual state (pre-checked for completed today)
- Missing name on habit POST returns 400
