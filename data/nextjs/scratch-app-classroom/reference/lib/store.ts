import type { Classroom, Student, Assignment } from './types';

export const classroom: Classroom = {
  name: 'Math 101',
  teacher: 'Ms. Smith',
  room: 'A204',
  period: 2,
  schedule: { days: ['Mon', 'Wed', 'Fri'], startTime: '09:00', endTime: '09:50' },
};

export let students: Student[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Martinez' },
  { id: 3, name: 'Carol White' },
  { id: 4, name: 'David Lee' },
];

export let assignments: Assignment[] = [
  { id: 1, name: 'Homework 1', dueDate: '2024-02-01', submittedBy: [] },
  { id: 2, name: 'Quiz 1', dueDate: '2024-02-05', submittedBy: [1, 2] },
];

let nextStudentId = 5;
let nextAssignmentId = 3;

export function addStudent(name: string): Student {
  const student: Student = { id: nextStudentId++, name: name.trim() };
  students.push(student);
  return student;
}

export function removeStudent(id: number): boolean {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  students.splice(idx, 1);
  return true;
}

export function addAssignment(name: string, dueDate: string): Assignment {
  const assignment: Assignment = { id: nextAssignmentId++, name, dueDate, submittedBy: [] };
  assignments.push(assignment);
  return assignment;
}

export function __reset(): void {
  students = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Martinez' },
    { id: 3, name: 'Carol White' },
    { id: 4, name: 'David Lee' },
  ];
  assignments = [
    { id: 1, name: 'Homework 1', dueDate: '2024-02-01', submittedBy: [] },
    { id: 2, name: 'Quiz 1', dueDate: '2024-02-05', submittedBy: [1, 2] },
  ];
  nextStudentId = 5;
  nextAssignmentId = 3;
}
