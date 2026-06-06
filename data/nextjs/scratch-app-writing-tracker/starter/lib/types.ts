export interface Project {
  id: string;
  name: string;
  dailyGoal: number;
  color: string;
}

export interface Entry {
  id: string;
  projectId: string;
  date: string;
  wordCount: number;
  notes: string;
  createdAt: number;
}

export interface Goal {
  id: string;
  projectId: string;
  type: "daily" | "weekly";
  target: number;
  startDate: string;
  completed: boolean;
}

export type Route = "dashboard" | "entries" | "goals" | "settings";
