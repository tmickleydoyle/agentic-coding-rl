export type Frequency = "daily" | "twice-daily" | "weekly" | "as-needed";

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: Frequency;
  notes: string;
}

export interface DoseLog {
  id: string;
  supplementId: string;
  date: string;
  time: string;
  taken: boolean;
}
