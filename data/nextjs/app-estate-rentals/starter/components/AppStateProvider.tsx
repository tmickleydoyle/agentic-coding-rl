'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { AppStatus, Application, Route, Theme, Unit } from '../lib/types'

type NewApplicationInput = {
  unitId: string
  applicant: string
}

type AppApi = {
  units: Unit[]
  applications: Application[]
  theme: Theme
  route: Route
  currentUnitId: string | null
  addApplication: (input: NewApplicationInput) => void
  setAppStatus: (id: string, status: AppStatus) => void
  toggleOccupied: (id: string) => void
  selectUnit: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  units: [],
  applications: [],
  theme: 'light',
  route: 'units',
  currentUnitId: null,
  addApplication: () => {},
  setAppStatus: () => {},
  toggleOccupied: () => {},
  selectUnit: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold units/applications/theme/route/currentUnitId in state (seed 3 units + 3
  // applications), implement the actions (approving an application marks its unit
  // occupied), and provide them through AppContext. The STUB below makes the app mount but
  // does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
