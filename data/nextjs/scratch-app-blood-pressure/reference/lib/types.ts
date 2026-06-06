export type BPCategory = "normal" | "elevated" | "high-1" | "high-2" | "crisis";

export interface BPReading {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  systolic: number;
  diastolic: number;
  pulse: number;
  note: string;
  category: BPCategory;
  createdAt: number;
}

export type Route = "home" | "record" | "history" | "trends";

export interface AppState {
  route: Route;
  readings: BPReading[];
}
