# Habit Streak Tracker

A habit tracker focused on maintaining streaks. Users manage habits, view current streaks, and browse history.

## Routes
- `/` → Home: longest current streak across all habits, total habits, total days logged
- `/habits` → Habits: list habits with name and color tag; add new habit
- `/streaks` → Streaks: current streak per habit (consecutive days completed ending today or yesterday)
- `/history` → History: all completion records (habitId, date) in reverse chronological order

## Data Model

### Habit
```ts
interface Habit {
  id: string
  name: string
  color: string
}
```

### Completion
```ts
interface Completion {
  id: string
  habitId: string
  date: string  // YYYY-MM-DD
}
```

## Seed Data (TODAY = "2026-06-06")
Habits:
- { id: "h1", name: "Push-ups", color: "red" }
- { id: "h2", name: "Journaling", color: "blue" }
- { id: "h3", name: "Cold Shower", color: "cyan" }

Completions:
- { id: "c1", habitId: "h1", date: "2026-06-06" }
- { id: "c2", habitId: "h1", date: "2026-06-05" }
- { id: "c3", habitId: "h1", date: "2026-06-04" }
- { id: "c4", habitId: "h2", date: "2026-06-06" }
- { id: "c5", habitId: "h2", date: "2026-06-04" }  // gap on 06-05, so streak=1
- { id: "c6", habitId: "h3", date: "2026-06-01" }

## Behaviors

### Home Page
- data-testid="longest-streak": longest current streak among all habits (h1 has streak 3)
- data-testid="total-habits": count of habits (3)
- data-testid="total-days-logged": total count of completion records (6)

### Habits Page
- Each habit: data-testid="habit-card-{id}" showing name and color
- Add form: name (text), color (text)
- Submit: data-testid="add-habit-btn"

### Streaks Page
- For each habit: data-testid="streak-{habitId}" showing current streak number
- Current streak = consecutive days completed ending on TODAY or yesterday (2026-06-06/05)
- h1 streak = 3, h2 streak = 1 (gap on 06-05), h3 streak = 0 (last on 06-01)

### History Page
- All completions listed, most recent first
- Each: data-testid="history-item-{id}"
- Shows habitId and date

## API Routes
- GET /api/habits → { habits: Habit[] }
- POST /api/habits → body { name, color } → created Habit
- GET /api/habits/completions → { completions: Completion[] }
- POST /api/habits/completions → body { habitId, date } → created Completion

## Edge Cases
- Streak calculation: only consecutive days (no gaps); must include today or yesterday to count
- Missing name on habit POST returns 400
- Duplicate completion for same habitId+date should still work (just adds another record)
