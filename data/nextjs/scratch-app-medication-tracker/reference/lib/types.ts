export type Frequency = "daily" | "twice-daily" | "weekly" | "as-needed";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: Frequency;
  instructions: string;
  active: boolean;
  createdAt: number;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  takenAt: number;
  note: string;
}

export type Route = "home" | "add" | "schedule" | "log";

export interface AppState {
  route: Route;
  medications: Medication[];
  doseLogs: DoseLog[];
}
