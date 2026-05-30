'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Kpi, Route, Theme } from '../lib/types'

type AppApi = {
  kpis: Kpi[]
  theme: Theme
  route: Route
  selectedId: string | null
  setTarget: (id: string, target: number) => void
  selectKpi: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  kpis: [],
  theme: 'light',
  route: 'dashboard',
  selectedId: null,
  setTarget: () => {},
  selectKpi: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold kpis/theme/route/selectedId in state (seed 4 KPIs), implement actions
  // (selectKpi navigates to kpi-detail, setTarget updates a target), provide via AppContext.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
