'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Enrollment, Klass, Route, Theme } from '../lib/types'

type AppApi = {
  classes: Klass[]
  enrollments: Enrollment[]
  theme: Theme
  route: Route
  selectedClassId: string | null
  openClass: (id: string) => void
  enroll: (classId: string, student: string) => Enrollment
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_CLASSES: Klass[] = [
  { id: 'c1', name: 'Yoga', capacity: 2 },
  { id: 'c2', name: 'Pottery', capacity: 1 },
  { id: 'c3', name: 'Boxing', capacity: 3 },
]

const SEED_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', classId: 'c1', student: 'Ada', status: 'enrolled' },
  { id: 'e2', classId: 'c2', student: 'Grace', status: 'enrolled' },
  { id: 'e3', classId: 'c2', student: 'Hedy', status: 'waitlisted' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [classes] = useState<Klass[]>(SEED_CLASSES)
  const [enrollments, setEnrollments] = useState<Enrollment[]>(SEED_ENROLLMENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('classes')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const openClass = (id: string) => {
      setSelectedClassId(id)
      setRoute('class-detail')
    }

    const enroll = (classId: string, student: string): Enrollment => {
      const klass = classes.find((c) => c.id === classId)
      const cap = klass ? klass.capacity : 0
      const enrolled = enrollments.filter(
        (e) => e.classId === classId && e.status === 'enrolled',
      ).length
      const status: Enrollment['status'] = enrolled < cap ? 'enrolled' : 'waitlisted'
      const created: Enrollment = { id: `e${nextId}`, classId, student, status }
      setNextId((n) => n + 1)
      setEnrollments((prev) => [...prev, created])
      return created
    }

    const cancel = (id: string) => {
      setEnrollments((prev) => {
        const idx = prev.findIndex((e) => e.id === id)
        if (idx === -1) return prev
        const removed = prev[idx]
        const next = prev.slice(0, idx).concat(prev.slice(idx + 1))
        if (removed.status === 'enrolled') {
          const promoteIdx = next.findIndex(
            (e) => e.classId === removed.classId && e.status === 'waitlisted',
          )
          if (promoteIdx !== -1) {
            next[promoteIdx] = { ...next[promoteIdx], status: 'enrolled' }
          }
        }
        return next
      })
    }

    const navigate = (nextRoute: Route) => setRoute(nextRoute)

    return {
      classes,
      enrollments,
      theme,
      route,
      selectedClassId,
      openClass,
      enroll,
      cancel,
      setTheme,
      navigate,
    }
  }, [classes, enrollments, theme, route, selectedClassId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
