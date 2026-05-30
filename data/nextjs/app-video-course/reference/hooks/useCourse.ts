'use client'
import { useApp } from '../components/AppStateProvider'
import type { Course, Lesson } from '../lib/types'

export type Progress = {
  completed: number
  total: number
  percent: number
}

export function findCourse(courses: Course[], id: string | null): Course | undefined {
  if (!id) return undefined
  return courses.find((c) => c.id === id)
}

export function allLessons(course: Course): Lesson[] {
  const out: Lesson[] = []
  course.modules.forEach((m) => {
    m.lessons.forEach((l) => out.push(l))
  })
  return out
}

export function findLesson(course: Course, lessonId: string | null): Lesson | undefined {
  if (!lessonId) return undefined
  return allLessons(course).find((l) => l.id === lessonId)
}

export function courseProgress(course: Course, completedKeys: string[]): Progress {
  const lessons = allLessons(course)
  const total = lessons.length
  let completed = 0
  lessons.forEach((l) => {
    if (completedKeys.includes(`${course.id}:${l.id}`)) completed += 1
  })
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, percent }
}

export function useSelectedCourse(): Course | undefined {
  const { courses, selectedCourseId } = useApp()
  return findCourse(courses, selectedCourseId)
}
