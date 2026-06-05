import type { Course, Enrollment } from './types'
import { seedCourses } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let courses: Course[] = []
let enrollments: Enrollment[] = []

function seed(): void {
  courses = seedCourses()
  enrollments = []
}

seed()

export function __reset(): void {
  seed()
}

export function listCourses(): Course[] {
  return courses.slice()
}

export function findCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}

export function listEnrollments(): Enrollment[] {
  return enrollments.map((e) => ({ ...e, completedLessonIds: e.completedLessonIds.slice() }))
}

export function findEnrollment(courseId: string): Enrollment | undefined {
  return enrollments.find((e) => e.courseId === courseId)
}

export function createEnrollment(courseId: string): Enrollment {
  const enrollment: Enrollment = { courseId, completedLessonIds: [] }
  enrollments.push(enrollment)
  return enrollment
}

export function toggleLesson(courseId: string, lessonId: string): Enrollment | undefined {
  const e = enrollments.find((en) => en.courseId === courseId)
  if (!e) return undefined
  if (e.completedLessonIds.includes(lessonId)) {
    e.completedLessonIds = e.completedLessonIds.filter((id) => id !== lessonId)
  } else {
    e.completedLessonIds = [...e.completedLessonIds, lessonId]
  }
  return e
}

export function deleteEnrollment(courseId: string): boolean {
  const idx = enrollments.findIndex((e) => e.courseId === courseId)
  if (idx === -1) return false
  enrollments.splice(idx, 1)
  return true
}
