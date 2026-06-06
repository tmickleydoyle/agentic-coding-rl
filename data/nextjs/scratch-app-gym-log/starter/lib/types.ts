export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
}

export type Route = "sessions" | "exercises" | "history" | "stats";
