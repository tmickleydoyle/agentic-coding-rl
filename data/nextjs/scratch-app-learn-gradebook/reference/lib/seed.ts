import type { Assignment, Grades, Student } from './types'

export function seedStudents(): Student[] {
  return [
    { id: 's1', name: 'Ada' },
    { id: 's2', name: 'Linus' },
    { id: 's3', name: 'Grace' },
  ]
}

export function seedAssignments(): Assignment[] {
  return [
    { id: 'a1', title: 'Quiz' },
    { id: 'a2', title: 'Project' },
  ]
}

export function seedGrades(): Grades {
  return {
    's1:a1': 95,
    's1:a2': 85,
    's2:a1': 72,
    's3:a1': 50,
  }
}
