export interface Exercise {
  id: number;
  name: string;
  category: string;
  muscleGroup: string;
}

export interface LogEntry {
  id: number;
  exerciseId: number;
  date: string;
  sets: number;
  reps: number;
  weightKg: number;
}

export interface Goal {
  id: number;
  title: string;
  target: number;
  unit: string;
  deadline: string;
  completed: boolean;
}

export type Route = "calendar" | "exercises" | "goals";
