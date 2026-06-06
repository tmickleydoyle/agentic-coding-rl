import { Meal, FoodItem, DailyTargets } from "./types";

export function __reset(): void {}
export function getMeals(): Meal[] { return []; }
export function getTargets(): DailyTargets { return { calories: 2000, protein: 150, carbs: 200, fat: 65 }; }
export function addMeal(_name: string, _time: Meal["time"]): Meal | null { return null; }
export function deleteMeal(_id: string): void {}
export function addFood(_mealId: string, _name: string, _calories: number, _protein: number, _carbs: number, _fat: number): FoodItem | null { return null; }
export function setTargets(_t: DailyTargets): void {}
