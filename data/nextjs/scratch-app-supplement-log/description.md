# Supplement Log App

Build a multi-route React app for tracking supplement intake and schedules.

## Routes
- `/` — Schedule: list all supplements with their daily schedule and today's taken status
- `/add-supplement` — Form to add a new supplement to track
- `/log-dose` — Log that a dose of a supplement was taken today

## Data Model (lib/types.ts)
```ts
type Frequency = "daily" | "twice-daily" | "weekly" | "as-needed";

interface Supplement {
  id: string;
  name: string;
  dosage: string;       // e.g. "500mg", "1 tablet"
  frequency: Frequency;
  notes: string;
}

interface DoseLog {
  id: string;
  supplementId: string;
  date: string;         // YYYY-MM-DD
  time: string;         // HH:MM
  taken: boolean;
}
```

## State (lib/store.ts)
- `getSupplements(): Supplement[]`
- `addSupplement(data: Omit<Supplement, "id">): Supplement`
- `deleteSupplement(id: string): void`
- `getDoseLogs(): DoseLog[]`
- `logDose(supplementId: string, date: string, time: string): DoseLog`
- `getTodayLogs(): DoseLog[]` — logs where date === "2024-06-01"
- `__reset(): void`

## Seed Data
Supplements:
1. id:"s1", name:"Vitamin D", dosage:"1000 IU", frequency:"daily", notes:"Take with food"
2. id:"s2", name:"Fish Oil", dosage:"1000mg", frequency:"daily", notes:"Omega-3s"
3. id:"s3", name:"Magnesium", dosage:"400mg", frequency:"daily", notes:"Before bed"
4. id:"s4", name:"Vitamin C", dosage:"500mg", frequency:"twice-daily", notes:""

Dose Logs (date "2024-06-01"):
1. id:"dl1", supplementId:"s1", date:"2024-06-01", time:"08:00", taken:true
2. id:"dl2", supplementId:"s2", date:"2024-06-01", time:"08:30", taken:true

## API (app/api/supplements/route.ts)
- GET /api/supplements — returns { supplements: Supplement[], todayLogs: DoseLog[] }
- POST /api/supplements — creates supplement, returns it, status 201

## UI Behaviors
- Schedule page shows all supplements with data-testid="supplement-item"
- Each item shows whether it was taken today (check via today logs)
- data-testid="taken-count" — how many supplements taken today
- data-testid="total-supplements" — total supplement count
- Log dose page: select supplement, shows time input, logs the dose
- Add supplement form validates: name required
- Delete supplement: data-testid="delete-supplement-{id}"

## data-testid attributes
- "nav-schedule", "nav-add-supplement", "nav-log-dose"
- "supplement-item", "total-supplements", "taken-count"
- "delete-supplement-{id}"
- "add-supplement-form", "input-name", "input-dosage", "select-frequency", "input-notes", "submit-btn", "error-message"
- "log-dose-form", "select-supplement", "input-time", "log-btn"
- "today-log-item"
