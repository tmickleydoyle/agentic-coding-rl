'use client'
import { useApp } from '../components/AppStateProvider'
import { classAverage, letterGrade, studentAverage } from '../lib/grades'
import type { Student } from '../lib/types'

export { classAverage, letterGrade, studentAverage }

export type GradeRow = {
  student: Student
  average: number | null
  letter: string
}

export function useGradebook(): { rows: GradeRow[]; classAvg: number | null } {
  const { students, assignments, grades } = useApp()
  const rows: GradeRow[] = students.map((student) => {
    const average = studentAverage(grades, student, assignments)
    return {
      student,
      average,
      letter: average === null ? '—' : letterGrade(average),
    }
  })
  return { rows, classAvg: classAverage(grades, students, assignments) }
}
