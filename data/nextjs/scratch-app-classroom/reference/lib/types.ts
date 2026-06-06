export interface Student {
  id: number;
  name: string;
}

export interface Assignment {
  id: number;
  name: string;
  dueDate: string;
  submittedBy: number[];
}

export interface ClassSchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface Classroom {
  name: string;
  teacher: string;
  room: string;
  period: number;
  schedule: ClassSchedule;
}

export type Route = 'home' | 'roster' | 'schedule' | 'assignments';

export interface AppState {
  route: Route;
  classroom: Classroom;
  students: Student[];
  assignments: Assignment[];
}
