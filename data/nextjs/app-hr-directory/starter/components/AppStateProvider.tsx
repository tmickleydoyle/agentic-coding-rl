'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Employee, Route, Theme } from '../lib/types'

type AppApi = {
  employees: Employee[]
  theme: Theme
  route: Route
  query: string
  departmentFilter: string
  selectedId: string | null
  setQuery: (q: string) => void
  setDepartmentFilter: (d: string) => void
  selectEmployee: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  employees: [],
  theme: 'light',
  route: 'directory',
  query: '',
  departmentFilter: 'all',
  selectedId: null,
  setQuery: () => {},
  setDepartmentFilter: () => {},
  selectEmployee: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold employees/theme/route/query/filter/selectedId in state (seed 5 employees),
  // implement actions (selectEmployee navigates to profile), provide through AppContext.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
