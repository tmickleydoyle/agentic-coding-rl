export interface Student {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  studentId: number;
  subject: string;
  score: number;
  maxScore: number;
}

export type Route = 'home' | 'students' | 'grades' | 'reports';

export interface AppState {
  route: Route;
  students: Student[];
  grades: Grade[];
  subjects: string[];
}
