import type { Enrollment, Klass } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `classes`, `enrollments`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listClasses(): Klass[] {
  // TODO: return all classes
  return []
}

export function findClass(_id: string): Klass | undefined {
  // TODO: look up a class by id
  return undefined
}

export function listEnrollments(_filter?: {
  classId?: string | null
  status?: string | null
}): Enrollment[] {
  // TODO: return enrollments, applying optional classId + status filters
  return []
}

export function enrolledCount(_classId: string): number {
  // TODO: count enrolled (non-waitlisted) enrollments for a class
  return 0
}

export function createEnrollment(_input: { classId: string; student: string }): Enrollment {
  // TODO: append an enrollment; status 'enrolled' if there is room else 'waitlisted'
  return { id: '', classId: '', student: '', status: 'enrolled' }
}

export function deleteEnrollment(_id: string): { ok: boolean; promotedId: string | null } {
  // TODO: remove it; if it was enrolled, promote the oldest waitlisted for that class
  return { ok: false, promotedId: null }
}
