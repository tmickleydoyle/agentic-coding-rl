import type { Course } from './types'
import { seedCourses } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let courses: Course[] = []
let completedKeys: string[] = []

function seed(): void {
  courses = seedCourses()
  completedKeys = []
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

export function findLesson(courseId: string, lessonId: string): boolean {
  const course = courses.find((c) => c.id === courseId)
  if (!course) return false
  return course.modules.some((m) => m.lessons.some((l) => l.id === lessonId))
}

export function key(courseId: string, lessonId: string): string {
  return `${courseId}:${lessonId}`
}

export function listCompleted(): string[] {
  return completedKeys.slice()
}

export function markComplete(courseId: string, lessonId: string): string[] {
  const k = key(courseId, lessonId)
  if (!completedKeys.includes(k)) {
    completedKeys = [...completedKeys, k]
  }
  return completedKeys.slice()
}

export function clearComplete(courseId: string, lessonId: string): boolean {
  const k = key(courseId, lessonId)
  if (!completedKeys.includes(k)) return false
  completedKeys = completedKeys.filter((x) => x !== k)
  return true
}
