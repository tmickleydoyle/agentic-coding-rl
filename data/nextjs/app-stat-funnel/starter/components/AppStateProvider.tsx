'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Segment, Step, Theme } from '../lib/types'

type AppApi = {
  steps: Step[]
  theme: Theme
  route: Route
  segment: Segment
  selectedStepId: string | null
  setSegment: (segment: Segment) => void
  selectStep: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  steps: [],
  theme: 'light',
  route: 'funnel',
  segment: 'all',
  selectedStepId: null,
  setSegment: () => {},
  selectStep: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold steps/theme/route/segment/selection in state (seed 4 ordered steps),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
