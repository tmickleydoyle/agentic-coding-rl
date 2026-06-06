export type OkrStatus = "on_track" | "at_risk" | "behind" | "completed";

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  quarter: string;
  status: OkrStatus;
  keyResults: KeyResult[];
  createdAt: string;
}

export type Route = "objectives" | "keyresults" | "progress";
