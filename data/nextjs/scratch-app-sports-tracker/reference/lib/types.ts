export interface Athlete {
  id: number;
  name: string;
  sport: string;
  position: string;
}

export interface Session {
  id: number;
  athleteId: number;
  date: string;
  duration: number;
  score: number;
}

export type Route = "dashboard" | "athletes" | "sessions";
