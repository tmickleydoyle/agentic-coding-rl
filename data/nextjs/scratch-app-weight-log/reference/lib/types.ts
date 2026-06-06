export type WeightUnit = "kg" | "lbs";

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  unit: WeightUnit;
  note: string;
  createdAt: number;
}

export type Route = "home" | "log" | "history" | "stats";

export interface AppState {
  route: Route;
  entries: WeightEntry[];
  unit: WeightUnit;
}
