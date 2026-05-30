'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { DateRange, PageStat, Route, Source, Theme } from '../lib/types'

type AppApi = {
  pages: PageStat[]
  sources: Source[]
  theme: Theme
  route: Route
  range: DateRange
  selectedPageId: string | null
  setRange: (range: DateRange) => void
  selectPage: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  pages: [],
  sources: [],
  theme: 'light',
  route: 'overview',
  range: 'all',
  selectedPageId: null,
  setRange: () => {},
  selectPage: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold pages/sources/theme/route/range/selection in state (seed 4 pages + 3
  // sources), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
