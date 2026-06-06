import type { Classroom, Student, Assignment } from './types';

export const classroom: Classroom = {
  name: 'Math 101',
  teacher: 'Ms. Smith',
  room: 'A204',
  period: 2,
  schedule: { days: ['Mon', 'Wed', 'Fri'], startTime: '09:00', endTime: '09:50' },
};

export let students: Student[] = [];
export let assignments: Assignment[] = [];

export function addStudent(_name: string): Student {
  return { id: 0, name: '' };
}

export function removeStudent(_id: number): boolean {
  return false;
}

export function addAssignment(_name: string, _dueDate: string): Assignment {
  return { id: 0, name: '', dueDate: '', submittedBy: [] };
}

export function __reset(): void {
  students = [];
  assignments = [];
}
