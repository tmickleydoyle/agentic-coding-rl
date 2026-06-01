'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Course, Enrollment, Route, Theme } from '../lib/types'
import { seedCourses } from '../lib/seed'

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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [courses] = useState<Course[]>(() => seedCourses())
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('catalog')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const isEnrolled = (courseId: string) =>
      enrollments.some((e) => e.courseId === courseId)

    const openCourse = (courseId: string) => {
      setSelectedCourseId(courseId)
      setRoute('course-detail')
    }

    const enroll = (courseId: string) => {
      setEnrollments((prev) =>
        prev.some((e) => e.courseId === courseId)
          ? prev
          : [...prev, { courseId, completedLessonIds: [] }],
      )
    }

    const unenroll = (courseId: string) => {
      setEnrollments((prev) => prev.filter((e) => e.courseId !== courseId))
    }

    const toggleLesson = (courseId: string, lessonId: string) => {
      setEnrollments((prev) =>
        prev.map((e) => {
          if (e.courseId !== courseId) return e
          const has = e.completedLessonIds.includes(lessonId)
          return {
            ...e,
            completedLessonIds: has
              ? e.completedLessonIds.filter((id) => id !== lessonId)
              : [...e.completedLessonIds, lessonId],
          }
        }),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      courses,
      enrollments,
      theme,
      route,
      selectedCourseId,
      isEnrolled,
      openCourse,
      enroll,
      unenroll,
      toggleLesson,
      setTheme,
      navigate,
    }
  }, [courses, enrollments, theme, route, selectedCourseId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
