# Calorie Tracker App

Build a multi-route React app for tracking daily calorie intake against a goal.

## Routes
- `/` — Tracker: daily calorie progress bar (consumed vs goal), list of today's food logs
- `/add-food` — Form to log a food item with calories
- `/goals` — Set and display daily calorie and macro goals

## Data Model (lib/types.ts)
```ts
interface FoodLog {
  id: string;
  date: string;       // YYYY-MM-DD
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
```

## State (lib/store.ts)
- `getLogs(): FoodLog[]`
- `addLog(data: Omit<FoodLog, "id">): FoodLog`
- `deleteLog(id: string): void`
- `getGoals(): Goals`
- `setGoals(g: Goals): void`
- `getTodayTotal(): { calories: number; protein: number; carbs: number; fat: number }` — sums logs for "2024-04-10"
- `__reset(): void`

## Seed Data
Logs (all date "2024-04-10"):
1. id:"c1", name:"Oatmeal", calories:300, protein:10, carbs:54, fat:5
2. id:"c2", name:"Chicken Rice Bowl", calories:550, protein:40, carbs:60, fat:12
3. id:"c3", name:"Protein Bar", calories:200, protein:20, carbs:25, fat:8

Default Goals: { calories:2000, protein:150, carbs:200, fat:65 }

## API (app/api/calories/route.ts)
- GET /api/calories — returns { logs: FoodLog[], goals: Goals }
- POST /api/calories — body Omit<FoodLog,"id"> — returns created log, status 201

## UI Behaviors
- Tracker shows: data-testid="calories-consumed", "calories-goal", "calories-remaining"
- Each food log: data-testid="food-log-item"
- Delete: data-testid="delete-log-{id}"
- Progress percentage: data-testid="progress-percent"
- Goals page: data-testid="goal-calories", "goal-protein", "goal-carbs", "goal-fat"
- Goals form: data-testid="goals-form", "input-goal-calories", save button "save-goals-btn"
- Add food validates: name required, calories >= 1

## data-testid attributes
- "nav-tracker", "nav-add-food", "nav-goals"
- "calories-consumed", "calories-goal", "calories-remaining", "progress-percent"
- "food-log-item", "delete-log-{id}"
- "add-food-form", "input-name", "input-calories", "input-protein", "input-carbs", "input-fat", "submit-btn", "error-message"
- "goals-form", "input-goal-calories", "input-goal-protein", "input-goal-carbs", "input-goal-fat", "save-goals-btn"
- "goal-calories", "goal-protein", "goal-carbs", "goal-fat"
