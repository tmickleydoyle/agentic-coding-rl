export type WorkoutType = "cardio" | "strength" | "flexibility";

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  duration: number;
  completed: boolean;
}

export type Route = "dashboard" | "workouts" | "schedule" | "progress";

export interface AppState {
  route: Route;
  workouts: Workout[];
}
