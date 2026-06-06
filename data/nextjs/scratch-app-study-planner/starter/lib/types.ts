export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface Session {
  id: string;
  subjectId: string;
  date: string;
  durationMinutes: number;
  notes: string;
}

export type Route = 'home' | 'subjects' | 'sessions' | 'stats';
