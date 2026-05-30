'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Course, Enrollment, Route, Theme } from '../lib/types'

type AppApi = {
  courses: Course[]
  enrollments: Enrollment[]
  theme: Theme
  route: Route
  selectedCourseId: string | null
  isEnrolled: (courseId: string) => boolean
  openCourse: (courseId: string) => void
  enroll: (courseId: string) => void
  unenroll: (courseId: string) => void
  toggleLesson: (courseId: string, lessonId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  courses: [],
  enrollments: [],
  theme: 'light',
  route: 'catalog',
  selectedCourseId: null,
  isEnrolled: () => false,
  openCourse: () => {},
  enroll: () => {},
  unenroll: () => {},
  toggleLesson: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold courses/enrollments/theme/route/selectedCourseId in state (seed via
  // seedCourses()), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
