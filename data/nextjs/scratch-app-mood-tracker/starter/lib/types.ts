export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodLog {
  id: string;
  date: string;
  level: MoodLevel;
  note: string;
  activities: string[];
  createdAt: number;
}

export type Route = "home" | "log" | "history" | "insights";

export interface AppState {
  route: Route;
  logs: MoodLog[];
}
