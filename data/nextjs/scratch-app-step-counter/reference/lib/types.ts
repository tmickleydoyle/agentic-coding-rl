export interface StepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number; // computed: steps * 0.0008
  caloriesBurned: number; // computed: steps * 0.04
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
