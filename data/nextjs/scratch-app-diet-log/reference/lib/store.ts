import { DietEntry } from "./types";

const SEED: DietEntry[] = [
  { id: "d1", date: "2024-03-15", mealType: "breakfast", foodName: "Eggs Scrambled", calories: 220, protein: 18, carbs: 2, fat: 15, servings: 2 },
  { id: "d2", date: "2024-03-15", mealType: "lunch", foodName: "Turkey Sandwich", calories: 380, protein: 28, carbs: 42, fat: 10, servings: 1 },
  { id: "d3", date: "2024-03-15", mealType: "snack", foodName: "Greek Yogurt", calories: 130, protein: 15, carbs: 10, fat: 3, servings: 1 },
  { id: "d4", date: "2024-03-15", mealType: "dinner", foodName: "Salmon with Veggies", calories: 450, protein: 40, carbs: 20, fat: 18, servings: 1 },
];

let entries: DietEntry[] = SEED.map((e) => ({ ...e }));
let nextId = 5;

export function getEntries(): DietEntry[] { return entries; }

export function addEntry(data: Omit<DietEntry, "id">): DietEntry {
  const entry: DietEntry = { ...data, id: `d${nextId++}` };
  entries = [...entries, entry];
  return entry;
}

export function deleteEntry(id: string): void {
  entries = entries.filter((e) => e.id !== id);
}

export function getTodayEntries(): DietEntry[] {
  return entries.filter((e) => e.date === "2024-03-15");
}

export function getDailySummary(date: string): { calories: number; protein: number; carbs: number; fat: number } {
  const dayEntries = entries.filter((e) => e.date === date);
  return {
    calories: dayEntries.reduce((s, e) => s + e.calories, 0),
    protein: dayEntries.reduce((s, e) => s + e.protein, 0),
    carbs: dayEntries.reduce((s, e) => s + e.carbs, 0),
    fat: dayEntries.reduce((s, e) => s + e.fat, 0),
  };
}

export function __reset(): void {
  entries = SEED.map((e) => ({ ...e }));
  nextId = 5;
}
