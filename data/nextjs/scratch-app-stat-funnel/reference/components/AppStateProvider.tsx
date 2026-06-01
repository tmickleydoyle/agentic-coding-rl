'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_STEPS: Step[] = [
  { id: 'st1', name: 'Visit', order: 1, counts: { all: 1000, mobile: 600, desktop: 400 } },
  { id: 'st2', name: 'Signup', order: 2, counts: { all: 500, mobile: 250, desktop: 250 } },
  { id: 'st3', name: 'Activate', order: 3, counts: { all: 300, mobile: 120, desktop: 180 } },
  { id: 'st4', name: 'Purchase', order: 4, counts: { all: 120, mobile: 40, desktop: 80 } },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [steps] = useState<Step[]>(
    SEED_STEPS.slice().sort((a, b) => a.order - b.order),
  )
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('funnel')
  const [segment, setSegment] = useState<Segment>('all')
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const selectStep = (id: string) => {
      setSelectedStepId(id)
      setRoute('steps')
    }
    const navigate = (next: Route) => setRoute(next)
    return {
      steps,
      theme,
      route,
      segment,
      selectedStepId,
      setSegment,
      selectStep,
      setTheme,
      navigate,
    }
  }, [steps, theme, route, segment, selectedStepId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
