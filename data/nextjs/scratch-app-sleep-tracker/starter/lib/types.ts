export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  durationHours: number;
  quality: SleepQuality;
  notes: string;
  createdAt: number;
}

export type Route = "home" | "log" | "history" | "insights";

export interface AppState {
  route: Route;
  entries: SleepEntry[];
}
