import { DietEntry } from "./types";

export function getEntries(): DietEntry[] { return []; }
export function addEntry(_data: Omit<DietEntry, "id">): DietEntry { return { id: "", date: "", mealType: "breakfast", foodName: "", calories: 0, protein: 0, carbs: 0, fat: 0, servings: 0 }; }
export function deleteEntry(_id: string): void {}
export function getTodayEntries(): DietEntry[] { return []; }
export function getDailySummary(_date: string): { calories: number; protein: number; carbs: number; fat: number } { return { calories: 0, protein: 0, carbs: 0, fat: 0 }; }
export function __reset(): void {}
