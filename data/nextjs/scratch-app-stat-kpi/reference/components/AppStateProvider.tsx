'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_KPIS: Kpi[] = [
  { id: 'k1', name: 'Revenue', unit: '$k', current: 120, previous: 100, target: 110, higherIsBetter: true, history: [90, 95, 100, 120] },
  { id: 'k2', name: 'Churn', unit: '%', current: 6, previous: 5, target: 5, higherIsBetter: false, history: [4, 5, 5, 6] },
  { id: 'k3', name: 'NPS', unit: 'pts', current: 42, previous: 45, target: 40, higherIsBetter: true, history: [38, 44, 45, 42] },
  { id: 'k4', name: 'Cost', unit: '$k', current: 80, previous: 90, target: 85, higherIsBetter: false, history: [95, 92, 90, 80] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [kpis, setKpis] = useState<Kpi[]>(SEED_KPIS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const setTarget = (id: string, target: number) => {
      setKpis((prev) => prev.map((k) => (k.id === id ? { ...k, target } : k)))
    }
    const navigate = (next: Route) => setRoute(next)
    const selectKpi = (id: string) => {
      setSelectedId(id)
      setRoute('kpi-detail')
    }
    return { kpis, theme, route, selectedId, setTarget, selectKpi, setTheme, navigate }
  }, [kpis, theme, route, selectedId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
