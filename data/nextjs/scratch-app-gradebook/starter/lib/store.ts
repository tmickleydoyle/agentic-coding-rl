import type { Student, Grade } from './types';

export let students: Student[] = [];
export const subjects: string[] = ['Math', 'Science', 'English'];
export let grades: Grade[] = [];

export function addStudent(_name: string): Student {
  return { id: 0, name: '' };
}

export function removeStudent(_id: number): boolean {
  return false;
}

export function addGrade(_studentId: number, _subject: string, _score: number, _maxScore: number): Grade {
  return { id: 0, studentId: 0, subject: '', score: 0, maxScore: 100 };
}

export function __reset(): void {
  students = [];
  grades = [];
}
