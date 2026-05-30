'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Course, Route, Theme } from '../lib/types'

type AppApi = {
  courses: Course[]
  theme: Theme
  route: Route
  completedKeys: string[]
  selectedCourseId: string | null
  selectedLessonId: string | null
  lessonKey: (courseId: string, lessonId: string) => string
  isComplete: (courseId: string, lessonId: string) => boolean
  openCourse: (courseId: string) => void
  playLesson: (courseId: string, lessonId: string) => void
  markComplete: (courseId: string, lessonId: string) => void
  toggleComplete: (courseId: string, lessonId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  courses: [],
  theme: 'light',
  route: 'courses',
  completedKeys: [],
  selectedCourseId: null,
  selectedLessonId: null,
  lessonKey: (courseId, lessonId) => `${courseId}:${lessonId}`,
  isComplete: () => false,
  openCourse: () => {},
  playLesson: () => {},
  markComplete: () => {},
  toggleComplete: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold courses/completedKeys/theme/route/selectedCourseId/selectedLessonId in
  // state (seed courses via seedCourses()), implement the actions, and provide them via
  // AppContext. The STUB below mounts the app but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
