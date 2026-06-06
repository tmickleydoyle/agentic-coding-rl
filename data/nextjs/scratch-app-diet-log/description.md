# Diet Log App

Build a multi-route React app for tracking daily diet entries.

## Routes
- `/` — Log: lists all diet entries ordered by date desc
- `/add-entry` — Form to add a new food entry
- `/summary` — Daily summary: total calories, macros (protein, carbs, fat) for today

## Data Model (lib/types.ts)
```ts
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface DietEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number;    // grams
  carbs: number;      // grams
  fat: number;        // grams
  servings: number;
}
```

## State (lib/store.ts)
- `getEntries(): DietEntry[]`
- `addEntry(data: Omit<DietEntry, "id">): DietEntry`
- `deleteEntry(id: string): void`
- `getTodayEntries(): DietEntry[]` — entries where date === today (seed uses "2024-03-15")
- `getDailySummary(date: string): { calories: number; protein: number; carbs: number; fat: number }`
- `__reset(): void`

## Seed Data (4 entries, all date "2024-03-15")
1. id:"d1", date:"2024-03-15", mealType:"breakfast", foodName:"Eggs Scrambled", calories:220, protein:18, carbs:2, fat:15, servings:2
2. id:"d2", date:"2024-03-15", mealType:"lunch", foodName:"Turkey Sandwich", calories:380, protein:28, carbs:42, fat:10, servings:1
3. id:"d3", date:"2024-03-15", mealType:"snack", foodName:"Greek Yogurt", calories:130, protein:15, carbs:10, fat:3, servings:1
4. id:"d4", date:"2024-03-15", mealType:"dinner", foodName:"Salmon with Veggies", calories:450, protein:40, carbs:20, fat:18, servings:1

## API (app/api/entries/route.ts)
- GET /api/entries — returns { entries: DietEntry[] }
- POST /api/entries — creates entry, returns it with status 201

## UI Behaviors
- Log page shows all entries with data-testid="diet-entry"
- Each entry shows food name, meal type, calories
- data-testid="entry-count" shows total number
- Delete button data-testid="delete-btn-{id}"
- Summary page shows: data-testid="summary-calories", "summary-protein", "summary-carbs", "summary-fat"
- Add form validates: foodName required, calories must be >= 0

## data-testid attributes
- "nav-log", "nav-add-entry", "nav-summary"
- "diet-entry", "entry-count"
- "delete-btn-{id}"
- "add-entry-form", "input-date", "select-meal-type", "input-food-name", "input-calories", "input-protein", "input-carbs", "input-fat", "input-servings", "submit-btn", "error-message"
- "summary-calories", "summary-protein", "summary-carbs", "summary-fat"
