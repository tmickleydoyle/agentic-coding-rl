export interface CompResult {
  id: string;
  athleteName: string;
  place: number;
  score: string;
  notes: string;
}

export interface Competition {
  id: string;
  name: string;
  sport: string;
  date: string;
  location: string;
  results: CompResult[];
}

export type Route = "competitions" | "results" | "rankings" | "history";
