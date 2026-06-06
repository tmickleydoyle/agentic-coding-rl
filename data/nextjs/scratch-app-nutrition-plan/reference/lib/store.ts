import { Meal, FoodItem, DailyTargets } from "./types";

const SEED_MEALS: Meal[] = [
  {
    id: "m1",
    name: "Morning Bowl",
    time: "breakfast",
    foods: [{ id: "f1", name: "Oats", calories: 300, protein: 10, carbs: 55, fat: 6 }],
  },
  {
    id: "m2",
    name: "Lunch Wrap",
    time: "lunch",
    foods: [
      { id: "f2", name: "Chicken", calories: 250, protein: 30, carbs: 10, fat: 5 },
      { id: "f3", name: "Tortilla", calories: 150, protein: 4, carbs: 28, fat: 3 },
    ],
  },
];

let meals: Meal[] = SEED_MEALS.map((m) => ({ ...m, foods: m.foods.map((f) => ({ ...f })) }));
let targets: DailyTargets = { calories: 2000, protein: 150, carbs: 200, fat: 65 };
let mCounter = 3;
let fCounter = 4;

export function __reset() {
  meals = SEED_MEALS.map((m) => ({ ...m, foods: m.foods.map((f) => ({ ...f })) }));
  targets = { calories: 2000, protein: 150, carbs: 200, fat: 65 };
  mCounter = 3;
  fCounter = 4;
}

export function getMeals(): Meal[] {
  return meals;
}

export function getTargets(): DailyTargets {
  return { ...targets };
}

export function addMeal(name: string, time: Meal["time"]): Meal | null {
  if (!name.trim()) return null;
  const m: Meal = { id: `m${mCounter++}`, name: name.trim(), time, foods: [] };
  meals.push(m);
  return m;
}

export function deleteMeal(id: string): void {
  meals = meals.filter((m) => m.id !== id);
}

export function addFood(mealId: string, name: string, calories: number, protein: number, carbs: number, fat: number): FoodItem | null {
  if (!name.trim() || calories < 0 || protein < 0 || carbs < 0 || fat < 0) return null;
  const m = meals.find((x) => x.id === mealId);
  if (!m) return null;
  const f: FoodItem = { id: `f${fCounter++}`, name: name.trim(), calories, protein, carbs, fat };
  m.foods.push(f);
  return f;
}

export function setTargets(t: DailyTargets): void {
  if (t.calories <= 0 || t.protein <= 0 || t.carbs <= 0 || t.fat <= 0) return;
  targets = { ...t };
}
