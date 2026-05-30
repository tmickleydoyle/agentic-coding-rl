'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  classes: [],
  enrollments: [],
  theme: 'light',
  route: 'classes',
  selectedClassId: null,
  openClass: () => {},
  enroll: () => ({ id: '', classId: '', student: '', status: 'enrolled' }),
  cancel: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold classes/enrollments/theme/route/selectedClassId in state (seed 3 classes +
  // 3 enrollments), implement openClass/enroll/cancel/navigate with capacity, waitlisting,
  // and promote-on-cancel, and provide them through AppContext. The STUB below mounts but
  // does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
