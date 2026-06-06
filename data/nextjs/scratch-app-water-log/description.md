# Water Log App

Build a multi-route React app for tracking daily water intake.

## Routes
- `/` — Dashboard: today's water intake progress vs daily goal (8 cups default)
- `/log-water` — Quick-log form: add cups of water with optional timestamp
- `/history` — Shows all past water log entries grouped by date

## Data Model (lib/types.ts)
```ts
interface WaterEntry {
  id: string;
  date: string;        // YYYY-MM-DD
  cups: number;
  note: string;
  time: string;        // HH:MM (24h)
}
```

## State (lib/store.ts)
- `getEntries(): WaterEntry[]`
- `addEntry(data: Omit<WaterEntry, "id">): WaterEntry`
- `deleteEntry(id: string): void`
- `getTodayTotal(): number` — sum of cups for "2024-05-20"
- `getDailyGoal(): number` — returns current goal (default 8)
- `setDailyGoal(cups: number): void`
- `__reset(): void`

## Seed Data (4 entries all date "2024-05-20")
1. id:"w1", date:"2024-05-20", cups:2, note:"Morning", time:"08:00"
2. id:"w2", date:"2024-05-20", cups:1, note:"Before lunch", time:"11:30"
3. id:"w3", date:"2024-05-20", cups:2, note:"After workout", time:"15:00"
4. id:"w4", date:"2024-05-20", cups:1, note:"Evening", time:"19:00"

## API (app/api/water/route.ts)
- GET /api/water — returns { entries: WaterEntry[], goal: number }
- POST /api/water — body { date, cups, note, time } — returns created entry, status 201

## UI Behaviors
- Dashboard: data-testid="today-cups" (total cups today), "daily-goal" (goal), "cups-remaining"
- Progress bar or text: data-testid="progress-text"
- Quick-log form: cups input (min 0.5 step 0.5), note input, time input, goal input (to change goal)
- History: entries grouped by date with data-testid="history-date-group", each entry data-testid="water-entry"
- Delete entry: data-testid="delete-entry-{id}"
- Form validates: cups must be > 0

## data-testid attributes
- "nav-dashboard", "nav-log-water", "nav-history"
- "today-cups", "daily-goal", "cups-remaining", "progress-text"
- "log-water-form", "input-cups", "input-note", "input-time", "input-goal", "submit-btn", "error-message"
- "history-date-group", "water-entry", "delete-entry-{id}"
