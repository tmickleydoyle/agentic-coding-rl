export interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  credits: number;
  enrolled: boolean;
}

export interface Progress {
  courseId: number;
  completed: number;
  total: number;
  lastActivity: string;
}

export type Route = 'home' | 'courses' | 'profile' | 'progress';
