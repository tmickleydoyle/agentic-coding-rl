import { MealEntry } from "./types";

const SEED: MealEntry[] = [
  { id: "m1", day: "Monday", mealType: "breakfast", name: "Oatmeal", notes: "With berries" },
  { id: "m2", day: "Monday", mealType: "dinner", name: "Grilled Chicken", notes: "With salad" },
  { id: "m3", day: "Wednesday", mealType: "lunch", name: "Soup", notes: "Tomato basil" },
  { id: "m4", day: "Friday", mealType: "dinner", name: "Pizza", notes: "Homemade" },
];

let meals: MealEntry[] = SEED.map((m) => ({ ...m }));
let nextId = 5;

export function getMeals(): MealEntry[] {
  return meals;
}

export function addMeal(data: Omit<MealEntry, "id">): MealEntry {
  const entry: MealEntry = { ...data, id: `m${nextId++}` };
  meals = [...meals, entry];
  return entry;
}

export function deleteMeal(id: string): void {
  meals = meals.filter((m) => m.id !== id);
}

export function __reset(): void {
  meals = SEED.map((m) => ({ ...m }));
  nextId = 5;
}
