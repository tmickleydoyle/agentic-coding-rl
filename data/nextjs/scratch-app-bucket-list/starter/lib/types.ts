export type Difficulty = "easy" | "medium" | "hard" | "extreme";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  difficulty: Difficulty;
  completed: boolean;
  completedAt: string | null;
  addedAt: string;
}

export type Route = "/" | "/goals" | "/completed" | "/categories";
