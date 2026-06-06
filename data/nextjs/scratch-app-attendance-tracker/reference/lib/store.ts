import type { Student, AttendanceRecord, AttendanceStatus } from './types';

export let students: Student[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Martinez' },
  { id: 3, name: 'Carol White' },
  { id: 4, name: 'David Lee' },
];

export let records: AttendanceRecord[] = [
  { id: 1, studentId: 1, date: '2024-01-15', status: 'present' },
  { id: 2, studentId: 2, date: '2024-01-15', status: 'absent' },
  { id: 3, studentId: 3, date: '2024-01-15', status: 'present' },
  { id: 4, studentId: 4, date: '2024-01-15', status: 'late' },
  { id: 5, studentId: 1, date: '2024-01-16', status: 'present' },
  { id: 6, studentId: 2, date: '2024-01-16', status: 'present' },
];

let nextStudentId = 5;
let nextRecordId = 7;

export function addStudent(name: string): Student {
  const s: Student = { id: nextStudentId++, name: name.trim() };
  students.push(s);
  return s;
}

export function removeStudent(id: number): boolean {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  students.splice(idx, 1);
  records = records.filter((r) => r.studentId !== id);
  return true;
}

export function saveAttendance(date: string, entries: { studentId: number; status: AttendanceStatus }[]): AttendanceRecord[] {
  records = records.filter((r) => r.date !== date);
  const newRecords = entries.map((e) => ({ id: nextRecordId++, studentId: e.studentId, date, status: e.status }));
  records.push(...newRecords);
  return newRecords;
}

export function __reset(): void {
  students = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Martinez' },
    { id: 3, name: 'Carol White' },
    { id: 4, name: 'David Lee' },
  ];
  records = [
    { id: 1, studentId: 1, date: '2024-01-15', status: 'present' },
    { id: 2, studentId: 2, date: '2024-01-15', status: 'absent' },
    { id: 3, studentId: 3, date: '2024-01-15', status: 'present' },
    { id: 4, studentId: 4, date: '2024-01-15', status: 'late' },
    { id: 5, studentId: 1, date: '2024-01-16', status: 'present' },
    { id: 6, studentId: 2, date: '2024-01-16', status: 'present' },
  ];
  nextStudentId = 5;
  nextRecordId = 7;
}
