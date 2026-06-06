import type { Tutor, Session, SessionStatus } from './types';

export let tutors: Tutor[] = [
  { id: 1, name: 'Dr. Allen', subject: 'Math', rating: 4.8, available: true },
  { id: 2, name: 'Prof. Baker', subject: 'Science', rating: 4.5, available: true },
  { id: 3, name: 'Ms. Clark', subject: 'English', rating: 4.9, available: false },
];

export let sessions: Session[] = [
  { id: 1, tutorId: 1, studentName: 'Alice', date: '2024-02-01', time: '14:00', duration: 60, status: 'completed' },
  { id: 2, tutorId: 2, studentName: 'Bob', date: '2024-02-03', time: '10:00', duration: 45, status: 'scheduled' },
  { id: 3, tutorId: 1, studentName: 'Carol', date: '2024-02-05', time: '15:00', duration: 60, status: 'scheduled' },
];

let nextSessionId = 4;

export function bookSession(tutorId: number, studentName: string, date: string, time: string, duration: number): Session | null {
  const tutor = tutors.find((t) => t.id === tutorId);
  if (!tutor || !tutor.available) return null;
  const session: Session = { id: nextSessionId++, tutorId, studentName, date, time, duration, status: 'scheduled' };
  sessions.push(session);
  return session;
}

export function updateSessionStatus(id: number, status: SessionStatus): Session | null {
  const session = sessions.find((s) => s.id === id);
  if (!session) return null;
  session.status = status;
  return session;
}

export function __reset(): void {
  tutors = [
    { id: 1, name: 'Dr. Allen', subject: 'Math', rating: 4.8, available: true },
    { id: 2, name: 'Prof. Baker', subject: 'Science', rating: 4.5, available: true },
    { id: 3, name: 'Ms. Clark', subject: 'English', rating: 4.9, available: false },
  ];
  sessions = [
    { id: 1, tutorId: 1, studentName: 'Alice', date: '2024-02-01', time: '14:00', duration: 60, status: 'completed' },
    { id: 2, tutorId: 2, studentName: 'Bob', date: '2024-02-03', time: '10:00', duration: 45, status: 'scheduled' },
    { id: 3, tutorId: 1, studentName: 'Carol', date: '2024-02-05', time: '15:00', duration: 60, status: 'scheduled' },
  ];
  nextSessionId = 4;
}
