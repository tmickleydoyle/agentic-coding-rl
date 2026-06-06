import type { Student, AttendanceRecord, AttendanceStatus } from './types';
export let students: Student[] = [];
export let records: AttendanceRecord[] = [];
export function addStudent(_name: string): Student { return { id: 0, name: '' }; }
export function removeStudent(_id: number): boolean { return false; }
export function saveAttendance(_date: string, _entries: { studentId: number; status: AttendanceStatus }[]): AttendanceRecord[] { return []; }
export function __reset(): void { students = []; records = []; }
