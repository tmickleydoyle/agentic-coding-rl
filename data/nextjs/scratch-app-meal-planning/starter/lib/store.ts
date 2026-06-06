import { MealEntry } from "./types";

export function getMeals(): MealEntry[] { return []; }
export function addMeal(_data: Omit<MealEntry, "id">): MealEntry { return { id: "", day: "Monday", mealType: "breakfast", name: "", notes: "" }; }
export function deleteMeal(_id: string): void {}
export function __reset(): void {}
