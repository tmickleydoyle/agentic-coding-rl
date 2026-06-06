import { Exercise, LogEntry, Goal } from "./types";

const seedExercises: Exercise[] = [
  { id: 1, name: "Squat", category: "Strength", muscleGroup: "Legs" },
  { id: 2, name: "Bench Press", category: "Strength", muscleGroup: "Chest" },
];

const seedLogs: LogEntry[] = [
  { id: 1, exerciseId: 1, date: "2024-02-01", sets: 3, reps: 10, weightKg: 80 },
  { id: 2, exerciseId: 2, date: "2024-02-01", sets: 4, reps: 8, weightKg: 60 },
];

const seedGoals: Goal[] = [
  { id: 1, title: "Squat 100kg", target: 100, unit: "kg", deadline: "2024-06-01", completed: false },
  { id: 2, title: "Run 5km", target: 5, unit: "km", deadline: "2024-05-01", completed: false },
];

let exercises: Exercise[] = seedExercises.map((e) => ({ ...e }));
let logs: LogEntry[] = seedLogs.map((l) => ({ ...l }));
let goals: Goal[] = seedGoals.map((g) => ({ ...g }));
let nextExerciseId = 3;
let nextLogId = 3;
let nextGoalId = 3;

export function __reset() {
  exercises = seedExercises.map((e) => ({ ...e }));
  logs = seedLogs.map((l) => ({ ...l }));
  goals = seedGoals.map((g) => ({ ...g }));
  nextExerciseId = 3;
  nextLogId = 3;
  nextGoalId = 3;
}

export function getExercises(): Exercise[] { return exercises; }

export function addExercise(name: string, category: string, muscleGroup: string): Exercise {
  const e: Exercise = { id: nextExerciseId++, name, category, muscleGroup };
  exercises.push(e);
  return e;
}

export function removeExercise(id: number): boolean {
  const idx = exercises.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  exercises.splice(idx, 1);
  logs = logs.filter((l) => l.exerciseId !== id);
  return true;
}

export function getLogs(): LogEntry[] { return logs; }

export function addLog(exerciseId: number, date: string, sets: number, reps: number, weightKg: number): LogEntry | null {
  if (sets <= 0 || reps <= 0 || weightKg < 0) return null;
  const l: LogEntry = { id: nextLogId++, exerciseId, date, sets, reps, weightKg };
  logs.push(l);
  return l;
}

export function getGoals(): Goal[] { return goals; }

export function addGoal(title: string, target: number, unit: string, deadline: string): Goal {
  const g: Goal = { id: nextGoalId++, title, target, unit, deadline, completed: false };
  goals.push(g);
  return g;
}

export function toggleGoal(id: number): boolean {
  const g = goals.find((g) => g.id === id);
  if (!g) return false;
  g.completed = !g.completed;
  return true;
}
