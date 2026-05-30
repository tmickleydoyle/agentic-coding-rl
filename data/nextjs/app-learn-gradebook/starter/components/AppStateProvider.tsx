'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Assignment, Grades, Route, Student, Theme } from '../lib/types'
import { gradeKey } from '../lib/grades'

type AppApi = {
  students: Student[]
  assignments: Assignment[]
  grades: Grades
  theme: Theme
  route: Route
  gradeKey: (studentId: string, assignmentId: string) => string
  getGrade: (studentId: string, assignmentId: string) => number | undefined
  setGrade: (studentId: string, assignmentId: string, score: number) => void
  clearGrade: (studentId: string, assignmentId: string) => void
  addStudent: (name: string) => void
  addAssignment: (title: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  students: [],
  assignments: [],
  grades: {},
  theme: 'light',
  route: 'students',
  gradeKey,
  getGrade: () => undefined,
  setGrade: () => {},
  clearGrade: () => {},
  addStudent: () => {},
  addAssignment: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold students/assignments/grades/theme/route + id counters in state (seed via
  // seed*()), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
