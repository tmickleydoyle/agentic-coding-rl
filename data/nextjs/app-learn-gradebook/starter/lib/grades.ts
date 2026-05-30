import type { Assignment, Grades, Student } from './types'

export function gradeKey(studentId: string, assignmentId: string): string {
  return `${studentId}:${assignmentId}`
}

export function letterGrade(avg: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (avg >= 90) return 'A'
  if (avg >= 80) return 'B'
  if (avg >= 70) return 'C'
  if (avg >= 60) return 'D'
  return 'F'
}

export function studentAverage(
  grades: Grades,
  student: Student,
  assignments: Assignment[],
): number | null {
  const scores: number[] = []
  assignments.forEach((a) => {
    const v = grades[gradeKey(student.id, a.id)]
    if (typeof v === 'number') scores.push(v)
  })
  if (scores.length === 0) return null
  const sum = scores.reduce((acc, n) => acc + n, 0)
  return Math.round(sum / scores.length)
}

export function classAverage(
  grades: Grades,
  students: Student[],
  assignments: Assignment[],
): number | null {
  const avgs: number[] = []
  students.forEach((s) => {
    const a = studentAverage(grades, s, assignments)
    if (a !== null) avgs.push(a)
  })
  if (avgs.length === 0) return null
  const sum = avgs.reduce((acc, n) => acc + n, 0)
  return Math.round(sum / avgs.length)
}
