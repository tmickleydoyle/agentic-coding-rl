'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Ada Lovelace', title: 'CEO', department: 'Executive', email: 'ada@co.com', managerId: null },
  { id: 'e2', name: 'Alan Turing', title: 'VP Engineering', department: 'Engineering', email: 'alan@co.com', managerId: 'e1' },
  { id: 'e3', name: 'Grace Hopper', title: 'Engineer', department: 'Engineering', email: 'grace@co.com', managerId: 'e2' },
  { id: 'e4', name: 'Katherine Johnson', title: 'Sales Lead', department: 'Sales', email: 'kat@co.com', managerId: 'e1' },
  { id: 'e5', name: 'Mary Jackson', title: 'Sales Rep', department: 'Sales', email: 'mary@co.com', managerId: 'e4' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [employees] = useState<Employee[]>(SEED_EMPLOYEES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('directory')
  const [query, setQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const navigate = (next: Route) => setRoute(next)
    const selectEmployee = (id: string) => {
      setSelectedId(id)
      setRoute('profile')
    }
    return {
      employees,
      theme,
      route,
      query,
      departmentFilter,
      selectedId,
      setQuery,
      setDepartmentFilter,
      selectEmployee,
      setTheme,
      navigate,
    }
  }, [employees, theme, route, query, departmentFilter, selectedId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
