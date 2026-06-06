import { FoodLog, Goals } from "./types";

export function getLogs(): FoodLog[] { return []; }
export function addLog(_data: Omit<FoodLog, "id">): FoodLog { return { id: "", date: "", name: "", calories: 0, protein: 0, carbs: 0, fat: 0 }; }
export function deleteLog(_id: string): void {}
export function getGoals(): Goals { return { calories: 2000, protein: 150, carbs: 200, fat: 65 }; }
export function setGoals(_g: Goals): void {}
export function getTodayTotal(): { calories: number; protein: number; carbs: number; fat: number } { return { calories: 0, protein: 0, carbs: 0, fat: 0 }; }
export function __reset(): void {}
