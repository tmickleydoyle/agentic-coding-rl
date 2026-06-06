export interface Tutor {
  id: number;
  name: string;
  subject: string;
  rating: number;
  available: boolean;
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Session {
  id: number;
  tutorId: number;
  studentName: string;
  date: string;
  time: string;
  duration: number;
  status: SessionStatus;
}

export type Route = 'home' | 'sessions' | 'tutors' | 'booking';
