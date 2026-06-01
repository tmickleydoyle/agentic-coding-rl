'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Course, Route, Theme } from '../lib/types'
import { seedCourses } from '../lib/seed'

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

function key(courseId: string, lessonId: string): string {
  return `${courseId}:${lessonId}`
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [courses] = useState<Course[]>(() => seedCourses())
  const [completedKeys, setCompletedKeys] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('courses')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const isComplete = (courseId: string, lessonId: string) =>
      completedKeys.includes(key(courseId, lessonId))

    const openCourse = (courseId: string) => {
      setSelectedCourseId(courseId)
      setRoute('course-detail')
    }

    const playLesson = (courseId: string, lessonId: string) => {
      setSelectedCourseId(courseId)
      setSelectedLessonId(lessonId)
      setRoute('player')
    }

    const markComplete = (courseId: string, lessonId: string) => {
      const k = key(courseId, lessonId)
      setCompletedKeys((prev) => (prev.includes(k) ? prev : [...prev, k]))
    }

    const toggleComplete = (courseId: string, lessonId: string) => {
      const k = key(courseId, lessonId)
      setCompletedKeys((prev) =>
        prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      courses,
      theme,
      route,
      completedKeys,
      selectedCourseId,
      selectedLessonId,
      lessonKey: key,
      isComplete,
      openCourse,
      playLesson,
      markComplete,
      toggleComplete,
      setTheme,
      navigate,
    }
  }, [courses, completedKeys, theme, route, selectedCourseId, selectedLessonId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
