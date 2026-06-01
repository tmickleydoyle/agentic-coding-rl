'use client'
import { useApp } from '../components/AppStateProvider'
import type { Course, Enrollment } from '../lib/types'

export type Progress = {
  completed: number
  total: number
  percent: number
}

export function courseProgress(course: Course, enrollment: Enrollment | undefined): Progress {
  const total = course.lessons.length
  const completed = enrollment ? enrollment.completedLessonIds.length : 0
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, percent }
}

export function findCourse(courses: Course[], id: string | null): Course | undefined {
  if (!id) return undefined
  return courses.find((c) => c.id === id)
}

export function useMyCourses(): { course: Course; progress: Progress }[] {
  const { courses, enrollments } = useApp()
  const out: { course: Course; progress: Progress }[] = []
  enrollments.forEach((e) => {
    const course = courses.find((c) => c.id === e.courseId)
    if (course) out.push({ course, progress: courseProgress(course, e) })
  })
  return out
}
