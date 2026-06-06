export type RunType = "easy" | "tempo" | "long" | "race";

export interface Run {
  id: string;
  type: RunType;
  distance: number;
  date: string;
  completed: boolean;
}

export interface RacePlan {
  raceName: string;
  distance: string;
  raceDate: string;
}

export interface PaceGoals {
  easy: string;
  tempo: string;
  long: string;
  race: string;
}

export type Route = "plan" | "runs" | "goals" | "log";
