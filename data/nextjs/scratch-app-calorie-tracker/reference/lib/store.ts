import { FoodLog, Goals } from "./types";

const SEED_LOGS: FoodLog[] = [
  { id: "c1", date: "2024-04-10", name: "Oatmeal", calories: 300, protein: 10, carbs: 54, fat: 5 },
  { id: "c2", date: "2024-04-10", name: "Chicken Rice Bowl", calories: 550, protein: 40, carbs: 60, fat: 12 },
  { id: "c3", date: "2024-04-10", name: "Protein Bar", calories: 200, protein: 20, carbs: 25, fat: 8 },
];

const DEFAULT_GOALS: Goals = { calories: 2000, protein: 150, carbs: 200, fat: 65 };

let logs: FoodLog[] = SEED_LOGS.map((l) => ({ ...l }));
let goals: Goals = { ...DEFAULT_GOALS };
let nextId = 4;

export function getLogs(): FoodLog[] { return logs; }

export function addLog(data: Omit<FoodLog, "id">): FoodLog {
  const log: FoodLog = { ...data, id: `c${nextId++}` };
  logs = [...logs, log];
  return log;
}

export function deleteLog(id: string): void {
  logs = logs.filter((l) => l.id !== id);
}

export function getGoals(): Goals { return goals; }

export function setGoals(g: Goals): void { goals = { ...g }; }

export function getTodayTotal(): { calories: number; protein: number; carbs: number; fat: number } {
  const today = logs.filter((l) => l.date === "2024-04-10");
  return {
    calories: today.reduce((s, l) => s + l.calories, 0),
    protein: today.reduce((s, l) => s + l.protein, 0),
    carbs: today.reduce((s, l) => s + l.carbs, 0),
    fat: today.reduce((s, l) => s + l.fat, 0),
  };
}

export function __reset(): void {
  logs = SEED_LOGS.map((l) => ({ ...l }));
  goals = { ...DEFAULT_GOALS };
  nextId = 4;
}
