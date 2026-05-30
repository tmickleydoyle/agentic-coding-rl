import type { Course, Enrollment } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `courses` + `enrollments`; seed courses from seedCourses();
// provide __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCourses(): Course[] {
  // TODO: return all courses
  return []
}

export function findCourse(_id: string): Course | undefined {
  // TODO: look up a course by id
  return undefined
}

export function listEnrollments(): Enrollment[] {
  // TODO: return all enrollments
  return []
}

export function findEnrollment(_courseId: string): Enrollment | undefined {
  // TODO: look up an enrollment by courseId
  return undefined
}

export function createEnrollment(_courseId: string): Enrollment {
  // TODO: append a new enrollment with an empty completed list and return it
  return { courseId: '', completedLessonIds: [] }
}

export function toggleLesson(_courseId: string, _lessonId: string): Enrollment | undefined {
  // TODO: toggle the lesson in the enrollment; return it or undefined if not enrolled
  return undefined
}

export function deleteEnrollment(_courseId: string): boolean {
  // TODO: remove the enrollment; return whether it existed
  return false
}
