import type { Course } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `courses` (seed via seedCourses()) + `completedKeys`; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

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

export function findLesson(_courseId: string, _lessonId: string): boolean {
  // TODO: return whether the lesson exists in the course
  return false
}

export function key(courseId: string, lessonId: string): string {
  return `${courseId}:${lessonId}`
}

export function listCompleted(): string[] {
  // TODO: return completed keys
  return []
}

export function markComplete(_courseId: string, _lessonId: string): string[] {
  // TODO: add the key (no duplicates); return completed keys
  return []
}

export function clearComplete(_courseId: string, _lessonId: string): boolean {
  // TODO: remove the key; return whether it existed
  return false
}
