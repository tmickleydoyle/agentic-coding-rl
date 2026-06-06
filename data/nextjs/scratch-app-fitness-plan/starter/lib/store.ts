import { Workout } from "./types";

export function __reset(): void {}

export function getWorkouts(): Workout[] {
  return [];
}

export function addWorkout(_name: string, _type: Workout["type"], _duration: number): Workout | null {
  return null;
}

export function removeWorkout(_id: string): void {}

export function toggleComplete(_id: string): void {}
