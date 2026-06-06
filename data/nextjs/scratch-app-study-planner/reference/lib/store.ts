import { Subject, Session } from './types';

let subjects: Subject[] = [
  { id: 's1', name: 'Math', color: '#4f46e5' },
  { id: 's2', name: 'History', color: '#059669' },
];

let sessions: Session[] = [
  { id: 'ss1', subjectId: 's1', date: '2024-01-15', durationMinutes: 45, notes: 'Chapter 3' },
  { id: 'ss2', subjectId: 's2', date: '2024-01-15', durationMinutes: 30, notes: 'WWI overview' },
];

let nextSubjectId = 3;
let nextSessionId = 3;

export function getSubjects(): Subject[] {
  return subjects;
}

export function addSubject(name: string, color: string): Subject {
  const existing = subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (existing) throw new Error('Duplicate subject name');
  const subject: Subject = { id: `s${nextSubjectId++}`, name, color };
  subjects.push(subject);
  return subject;
}

export function deleteSubject(id: string): void {
  subjects = subjects.filter(s => s.id !== id);
  sessions = sessions.filter(s => s.subjectId !== id);
}

export function getSessions(): Session[] {
  return sessions;
}

export function addSession(subjectId: string, date: string, durationMinutes: number, notes: string): Session {
  if (durationMinutes <= 0) throw new Error('Duration must be positive');
  const session: Session = { id: `ss${nextSessionId++}`, subjectId, date, durationMinutes, notes };
  sessions.push(session);
  return session;
}

export function deleteSession(id: string): void {
  sessions = sessions.filter(s => s.id !== id);
}

export function __reset(): void {
  subjects = [
    { id: 's1', name: 'Math', color: '#4f46e5' },
    { id: 's2', name: 'History', color: '#059669' },
  ];
  sessions = [
    { id: 'ss1', subjectId: 's1', date: '2024-01-15', durationMinutes: 45, notes: 'Chapter 3' },
    { id: 'ss2', subjectId: 's2', date: '2024-01-15', durationMinutes: 30, notes: 'WWI overview' },
  ];
  nextSubjectId = 3;
  nextSessionId = 3;
}
