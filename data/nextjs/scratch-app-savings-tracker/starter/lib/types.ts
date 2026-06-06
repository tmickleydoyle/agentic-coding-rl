export interface Goal {
  id: string;
  name: string;
  target: number;
  deadline: string;
}

export interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
}

export type Route = "dashboard" | "goals" | "contributions" | "progress";

export interface AppState {
  route: Route;
  goals: Goal[];
  contributions: Contribution[];
}
