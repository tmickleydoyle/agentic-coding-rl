import type { Student, Course, Progress } from './types';

export let student: Student = { id: 1, name: 'Alex Rivera', email: 'alex@school.edu', grade: '10th' };
export let courses: Course[] = [];
export let progressRecords: Progress[] = [];

export function updateStudentName(_name: string): void {}
export function enrollCourse(_courseId: number): boolean { return false; }
export function dropCourse(_courseId: number): boolean { return false; }
export function __reset(): void { courses = []; progressRecords = []; }
