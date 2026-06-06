# Finance Goals Tracker

A personal finance goals tracking app where users can set savings goals, track contributions, view budgets, and review progress reports.

## Routes
- `/` → Home: dashboard showing total saved vs total goal amount, count of active goals
- `/goals` → Goals list: all goals with name, target, current amount, deadline, progress bar
- `/budget` → Budget: form to add a monthly budget entry (category, amount); list of budget entries
- `/reports` → Reports: summary of goals by status (on-track, at-risk, completed)

## Data Model

### Goal
```ts
interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string  // YYYY-MM-DD
  category: string
}
```

### BudgetEntry
```ts
interface BudgetEntry {
  id: string
  category: string
  amount: number
  month: string  // YYYY-MM
}
```

## Seed Data (pre-load in store)
Goals:
- { id: "g1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 4500, deadline: "2026-12-31", category: "Savings" }
- { id: "g2", name: "Vacation", targetAmount: 3000, currentAmount: 3200, deadline: "2026-06-30", category: "Travel" }
- { id: "g3", name: "New Laptop", targetAmount: 2000, currentAmount: 800, deadline: "2025-09-01", category: "Tech" }

Budget Entries:
- { id: "b1", category: "Rent", amount: 1500, month: "2026-06" }
- { id: "b2", category: "Food", amount: 400, month: "2026-06" }

## Behaviors

### Goals Page
- Display each goal in a card with data-testid="goal-card"
- Show name, targetAmount, currentAmount, deadline
- Show a progress bar: currentAmount / targetAmount * 100 (capped at 100%)
- Progress bar element: data-testid="goal-progress-{id}"
- Form to add a new goal: fields name, targetAmount, currentAmount, deadline, category
- Submit button data-testid="add-goal-btn"
- Each goal card has data-testid="goal-card-{id}"

### Budget Page
- Form with fields: category (text), amount (number), month (text YYYY-MM)
- Submit adds a new budget entry to the list
- Submit button data-testid="add-budget-btn"
- Each entry: data-testid="budget-entry-{id}"
- Show total budget for all entries: data-testid="total-budget"

### Reports Page
- List goals grouped by status:
  - "completed": currentAmount >= targetAmount
  - "at-risk": deadline < today AND currentAmount < targetAmount
  - "on-track": everything else
- data-testid="report-completed", "report-at-risk", "report-on-track"
- Each shows count of goals in that bucket

### Home Page
- data-testid="total-saved": sum of all currentAmount values
- data-testid="total-target": sum of all targetAmount values
- data-testid="active-goals-count": number of goals where currentAmount < targetAmount

## API Routes
- GET /api/goals → returns { goals: Goal[] }
- POST /api/goals → body { name, targetAmount, currentAmount, deadline, category } → returns created Goal
- GET /api/goals/budget → returns { entries: BudgetEntry[] }
- POST /api/goals/budget → body { category, amount, month } → returns created BudgetEntry

## Edge Cases
- Progress bar maxes at 100% even if currentAmount > targetAmount
- Adding a goal with missing required fields returns 400
- Budget total updates immediately after adding an entry
