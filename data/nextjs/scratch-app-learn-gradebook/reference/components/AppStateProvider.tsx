'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Assignment, Grades, Route, Student, Theme } from '../lib/types'
import { seedAssignments, seedGrades, seedStudents } from '../lib/seed'
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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => seedStudents())
  const [assignments, setAssignments] = useState<Assignment[]>(() => seedAssignments())
  const [grades, setGrades] = useState<Grades>(() => seedGrades())
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('students')
  const [nextStudentId, setNextStudentId] = useState(4)
  const [nextAssignmentId, setNextAssignmentId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const getGrade = (studentId: string, assignmentId: string) =>
      grades[gradeKey(studentId, assignmentId)]

    const setGrade = (studentId: string, assignmentId: string, score: number) => {
      if (Number.isNaN(score)) return
      const clamped = Math.max(0, Math.min(100, score))
      setGrades((prev) => ({ ...prev, [gradeKey(studentId, assignmentId)]: clamped }))
    }

    const clearGrade = (studentId: string, assignmentId: string) => {
      setGrades((prev) => {
        const next = { ...prev }
        delete next[gradeKey(studentId, assignmentId)]
        return next
      })
    }

    const addStudent = (name: string) => {
      if (name.trim().length === 0) return
      const id = `s${nextStudentId}`
      setNextStudentId((n) => n + 1)
      setStudents((prev) => [...prev, { id, name: name.trim() }])
    }

    const addAssignment = (title: string) => {
      if (title.trim().length === 0) return
      const id = `a${nextAssignmentId}`
      setNextAssignmentId((n) => n + 1)
      setAssignments((prev) => [...prev, { id, title: title.trim() }])
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      students,
      assignments,
      grades,
      theme,
      route,
      gradeKey,
      getGrade,
      setGrade,
      clearGrade,
      addStudent,
      addAssignment,
      setTheme,
      navigate,
    }
  }, [students, assignments, grades, theme, route, nextStudentId, nextAssignmentId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
