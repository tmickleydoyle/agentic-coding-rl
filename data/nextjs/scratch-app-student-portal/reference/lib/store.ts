import type { Student, Course, Progress } from './types';

export let student: Student = { id: 1, name: 'Alex Rivera', email: 'alex@school.edu', grade: '10th' };

export let courses: Course[] = [
  { id: 1, title: 'Algebra II', instructor: 'Mr. Johnson', credits: 3, enrolled: true },
  { id: 2, title: 'Biology', instructor: 'Ms. Park', credits: 4, enrolled: true },
  { id: 3, title: 'World History', instructor: 'Dr. Chen', credits: 3, enrolled: false },
  { id: 4, title: 'Art Elective', instructor: 'Ms. Torres', credits: 2, enrolled: false },
];

export let progressRecords: Progress[] = [
  { courseId: 1, completed: 6, total: 12, lastActivity: '2024-01-15' },
  { courseId: 2, completed: 3, total: 10, lastActivity: '2024-01-14' },
];

export function updateStudentName(name: string): void {
  student = { ...student, name };
}

export function enrollCourse(courseId: number): boolean {
  const course = courses.find((c) => c.id === courseId);
  if (!course || course.enrolled) return false;
  course.enrolled = true;
  return true;
}

export function dropCourse(courseId: number): boolean {
  const course = courses.find((c) => c.id === courseId);
  if (!course || !course.enrolled) return false;
  course.enrolled = false;
  progressRecords = progressRecords.filter((p) => p.courseId !== courseId);
  return true;
}

export function __reset(): void {
  student = { id: 1, name: 'Alex Rivera', email: 'alex@school.edu', grade: '10th' };
  courses = [
    { id: 1, title: 'Algebra II', instructor: 'Mr. Johnson', credits: 3, enrolled: true },
    { id: 2, title: 'Biology', instructor: 'Ms. Park', credits: 4, enrolled: true },
    { id: 3, title: 'World History', instructor: 'Dr. Chen', credits: 3, enrolled: false },
    { id: 4, title: 'Art Elective', instructor: 'Ms. Torres', credits: 2, enrolled: false },
  ];
  progressRecords = [
    { courseId: 1, completed: 6, total: 12, lastActivity: '2024-01-15' },
    { courseId: 2, completed: 3, total: 10, lastActivity: '2024-01-14' },
  ];
}
