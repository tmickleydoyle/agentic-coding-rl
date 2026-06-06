# Meal Planning App

Build a multi-route React app for planning weekly meals.

## Routes
- `/` — Weekly Plan: shows a 7-day grid (Mon-Sun), each day shows planned meals
- `/add-meal` — Form to add a meal to a specific day
- `/meal-detail` — View detail of a selected meal entry
- `/weekly-plan` — alias for `/`

## Data Model (lib/types.ts)
```ts
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface MealEntry {
  id: string;
  day: DayOfWeek;
  mealType: MealType;
  name: string;
  notes: string;
}
```

## State (lib/store.ts)
- `getMeals(): MealEntry[]`
- `addMeal(data: Omit<MealEntry, "id">): MealEntry`
- `deleteMeal(id: string): void`
- `__reset(): void`

## Seed Data (4 entries)
1. id:"m1", day:"Monday", mealType:"breakfast", name:"Oatmeal", notes:"With berries"
2. id:"m2", day:"Monday", mealType:"dinner", name:"Grilled Chicken", notes:"With salad"
3. id:"m3", day:"Wednesday", mealType:"lunch", name:"Soup", notes:"Tomato basil"
4. id:"m4", day:"Friday", mealType:"dinner", name:"Pizza", notes:"Homemade"

## API (app/api/meals/route.ts)
- GET /api/meals — returns { meals: MealEntry[] }
- POST /api/meals — body { day, mealType, name, notes } — returns created MealEntry, status 201

## UI Behaviors
- Weekly plan shows all 7 days as sections with data-testid="day-section-{day}" (e.g. "day-section-Monday")
- Each meal entry shows with data-testid="meal-entry"
- Total meal count shown with data-testid="total-meals"
- Add meal form: day select, mealType select, name input, notes input
- Name is required — show data-testid="error-message" if empty on submit
- Clicking a meal entry navigates to meal-detail
- Meal detail shows data-testid="detail-name", "detail-day", "detail-type", "detail-notes", "delete-btn"

## data-testid attributes
- "nav-weekly-plan", "nav-add-meal"
- "total-meals"
- "day-section-Monday" through "day-section-Sunday"
- "meal-entry"
- "add-meal-form", "select-day", "select-meal-type", "input-name", "input-notes", "submit-btn", "error-message"
- "detail-name", "detail-day", "detail-type", "detail-notes", "delete-btn"
