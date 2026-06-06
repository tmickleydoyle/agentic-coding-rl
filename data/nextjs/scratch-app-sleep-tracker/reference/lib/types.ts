export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD (the morning date)
  bedtime: string; // HH:MM
  wakeTime: string; // HH:MM
  durationHours: number; // computed
  quality: SleepQuality;
  notes: string;
  createdAt: number;
}

export type Route = "home" | "log" | "history" | "insights";

export interface AppState {
  route: Route;
  entries: SleepEntry[];
}
