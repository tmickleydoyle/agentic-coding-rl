'use client'
import { useApp } from '../components/AppStateProvider'
import type { Course, Lesson } from '../lib/types'

export type Progress = {
  completed: number
  total: number
  percent: number
}

export function findCourse(_courses: Course[], _id: string | null): Course | undefined {
  // TODO: look up a course by id
  return undefined
}

export function allLessons(_course: Course): Lesson[] {
  // TODO: flatten lessons across modules
  return []
}

export function findLesson(_course: Course, _lessonId: string | null): Lesson | undefined {
  // TODO: find a lesson within a course
  return undefined
}

export function courseProgress(_course: Course, _completedKeys: string[]): Progress {
  // TODO: compute completed/total/percent for the course
  return { completed: 0, total: 0, percent: 0 }
}

export function useSelectedCourse(): Course | undefined {
  // TODO: return the currently selected course
  void useApp
  return undefined
}
