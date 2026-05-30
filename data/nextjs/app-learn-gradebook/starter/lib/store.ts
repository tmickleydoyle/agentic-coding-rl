import type { Assignment, Student } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level students/assignments/grades + id counters; seed from seed*();
// provide __reset(). Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listStudents(): Student[] {
  // TODO: return all students
  return []
}

export function findStudent(_id: string): Student | undefined {
  // TODO: look up a student by id
  return undefined
}

export function studentAverageById(_id: string): number | null {
  // TODO: compute the student's average (lib/grades studentAverage) or null
  return null
}

export function createStudent(_name: string): Student {
  // TODO: append a student with a fresh id and return it
  return { id: '', name: '' }
}

export function listAssignments(): Assignment[] {
  // TODO: return all assignments
  return []
}

export function findAssignment(_id: string): Assignment | undefined {
  // TODO: look up an assignment by id
  return undefined
}

export function createAssignment(_title: string): Assignment {
  // TODO: append an assignment with a fresh id and return it
  return { id: '', title: '' }
}

export function setGrade(_studentId: string, _assignmentId: string, _score: number): { key: string; score: number } {
  // TODO: clamp 0-100 and record the grade; return { key, score }
  return { key: '', score: 0 }
}
