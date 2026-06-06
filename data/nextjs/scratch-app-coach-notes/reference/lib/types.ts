export type Level = "beginner" | "intermediate" | "advanced";

export interface Athlete {
  id: string;
  name: string;
  sport: string;
  level: Level;
}

export interface Drill {
  id: string;
  name: string;
  reps: number;
  notes: string;
}

export interface CoachSession {
  id: string;
  athleteId: string;
  date: string;
  duration: number;
  focus: string;
  drills: Drill[];
}

export type Route = "athletes" | "sessions" | "drills" | "review";
