'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Part, Route, Series, Theme } from '../lib/types'

type NewPartInput = {
  seriesId: string
  title: string
}

type AppApi = {
  series: Series[]
  parts: Part[]
  theme: Theme
  route: Route
  currentSeriesId: string | null
  addPart: (input: NewPartInput) => void
  markRead: (id: string) => void
  toggleRead: (id: string) => void
  selectSeries: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  series: [],
  parts: [],
  theme: 'light',
  route: 'series',
  currentSeriesId: null,
  addPart: () => {},
  markRead: () => {},
  toggleRead: () => {},
  selectSeries: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold series/parts/theme/route/currentSeriesId in state (seed 2 series + 6 parts),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
