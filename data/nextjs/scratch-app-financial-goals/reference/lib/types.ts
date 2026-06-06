export type GoalCategory = "purchase" | "savings" | "investment" | "lifestyle" | "education" | "other";
export type GoalStatus = "active" | "completed" | "paused";

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  category: GoalCategory;
  status: GoalStatus;
}

export type Route = "dashboard" | "goals" | "milestones" | "insights";

export interface AppState {
  route: Route;
  goals: FinancialGoal[];
}
