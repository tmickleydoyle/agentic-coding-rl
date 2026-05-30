'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Cohort, Route, SizeFilter, Theme } from '../lib/types'

type AppApi = {
  cohorts: Cohort[]
  theme: Theme
  route: Route
  sizeFilter: SizeFilter
  selectedCohortId: string | null
  setSizeFilter: (filter: SizeFilter) => void
  selectCohort: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_COHORTS: Cohort[] = [
  { id: 'c1', month: 'Jan', size: 200, retention: [100, 60, 40, 20] },
  { id: 'c2', month: 'Feb', size: 150, retention: [100, 80, 50, 30] },
  { id: 'c3', month: 'Mar', size: 100, retention: [100, 50, 30, 10] },
  { id: 'c4', month: 'Apr', size: 50, retention: [100, 70, 60, 40] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [cohorts] = useState<Cohort[]>(SEED_COHORTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('cohorts')
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all')
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const selectCohort = (id: string) => {
      setSelectedCohortId(id)
      setRoute('retention')
    }
    const navigate = (next: Route) => setRoute(next)
    return {
      cohorts,
      theme,
      route,
      sizeFilter,
      selectedCohortId,
      setSizeFilter,
      selectCohort,
      setTheme,
      navigate,
    }
  }, [cohorts, theme, route, sizeFilter, selectedCohortId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
