export interface StepEntry {
  id: string;
  date: string;
  steps: number;
  distanceKm: number;
  caloriesBurned: number;
  notes: string;
  goalMet: boolean;
  createdAt: number;
}

export interface StepGoal {
  dailyTarget: number;
}

export type Route = "home" | "log" | "history" | "goals";

export interface AppState {
  route: Route;
  entries: StepEntry[];
  goal: StepGoal;
}
