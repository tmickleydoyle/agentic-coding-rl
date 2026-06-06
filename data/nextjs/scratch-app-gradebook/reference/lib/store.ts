import type { Student, Grade } from './types';

export let students: Student[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Martinez' },
  { id: 3, name: 'Carol White' },
];

export const subjects: string[] = ['Math', 'Science', 'English'];

export let grades: Grade[] = [
  { id: 1, studentId: 1, subject: 'Math', score: 92, maxScore: 100 },
  { id: 2, studentId: 1, subject: 'Science', score: 85, maxScore: 100 },
  { id: 3, studentId: 2, subject: 'Math', score: 78, maxScore: 100 },
  { id: 4, studentId: 3, subject: 'English', score: 95, maxScore: 100 },
];

let nextStudentId = 4;
let nextGradeId = 5;

export function addStudent(name: string): Student {
  const student: Student = { id: nextStudentId++, name: name.trim() };
  students.push(student);
  return student;
}

export function removeStudent(id: number): boolean {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  students.splice(idx, 1);
  grades = grades.filter((g) => g.studentId !== id);
  return true;
}

export function addGrade(studentId: number, subject: string, score: number, maxScore: number): Grade {
  const grade: Grade = { id: nextGradeId++, studentId, subject, score, maxScore };
  grades.push(grade);
  return grade;
}

export function __reset(): void {
  students = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Martinez' },
    { id: 3, name: 'Carol White' },
  ];
  grades = [
    { id: 1, studentId: 1, subject: 'Math', score: 92, maxScore: 100 },
    { id: 2, studentId: 1, subject: 'Science', score: 85, maxScore: 100 },
    { id: 3, studentId: 2, subject: 'Math', score: 78, maxScore: 100 },
    { id: 4, studentId: 3, subject: 'English', score: 95, maxScore: 100 },
  ];
  nextStudentId = 4;
  nextGradeId = 5;
}
