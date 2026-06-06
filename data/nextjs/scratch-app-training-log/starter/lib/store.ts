import { Exercise, LogEntry, Goal } from "./types";

export function __reset(): void {}
export function getExercises(): Exercise[] { return []; }
export function addExercise(_name: string, _category: string, _muscleGroup: string): Exercise { return { id: 0, name: "", category: "", muscleGroup: "" }; }
export function removeExercise(_id: number): boolean { return false; }
export function getLogs(): LogEntry[] { return []; }
export function addLog(_exerciseId: number, _date: string, _sets: number, _reps: number, _weightKg: number): LogEntry | null { return null; }
export function getGoals(): Goal[] { return []; }
export function addGoal(_title: string, _target: number, _unit: string, _deadline: string): Goal { return { id: 0, title: "", target: 0, unit: "", deadline: "", completed: false }; }
export function toggleGoal(_id: number): boolean { return false; }
