import { Workout } from "./types";

const SEED: Workout[] = [
  { id: "w1", name: "Morning Run", type: "cardio", duration: 30, completed: false },
  { id: "w2", name: "Push Day", type: "strength", duration: 45, completed: false },
  { id: "w3", name: "Yoga Flow", type: "flexibility", duration: 20, completed: false },
];

let workouts: Workout[] = SEED.map((w) => ({ ...w }));
let counter = 4;

export function __reset() {
  workouts = SEED.map((w) => ({ ...w }));
  counter = 4;
}

export function getWorkouts(): Workout[] {
  return workouts;
}

export function addWorkout(name: string, type: Workout["type"], duration: number): Workout | null {
  if (!name.trim() || duration <= 0) return null;
  const workout: Workout = { id: `w${counter++}`, name: name.trim(), type, duration, completed: false };
  workouts.push(workout);
  return workout;
}

export function removeWorkout(id: string): void {
  workouts = workouts.filter((w) => w.id !== id);
}

export function toggleComplete(id: string): void {
  const w = workouts.find((w) => w.id === id);
  if (w) w.completed = !w.completed;
}
