'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_UNITS: Unit[] = [
  { id: 'u1', label: 'A1', rent: 1200, occupied: true },
  { id: 'u2', label: 'A2', rent: 1500, occupied: false },
  { id: 'u3', label: 'B1', rent: 1800, occupied: false },
]

const SEED_APPLICATIONS: Application[] = [
  { id: 'a1', unitId: 'u2', applicant: 'Ada', status: 'pending' },
  { id: 'a2', unitId: 'u2', applicant: 'Lee', status: 'rejected' },
  { id: 'a3', unitId: 'u3', applicant: 'Sam', status: 'pending' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Unit[]>(SEED_UNITS)
  const [applications, setApplications] = useState<Application[]>(SEED_APPLICATIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('units')
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addApplication = (input: NewApplicationInput) => {
      const id = `a${nextId}`
      setNextId((n) => n + 1)
      setApplications((prev) => [
        ...prev,
        { id, unitId: input.unitId, applicant: input.applicant, status: 'pending' },
      ])
    }

    const setAppStatus = (id: string, status: AppStatus) => {
      setApplications((prev) => {
        const app = prev.find((a) => a.id === id)
        if (app && status === 'approved') {
          setUnits((us) =>
            us.map((u) => (u.id === app.unitId ? { ...u, occupied: true } : u)),
          )
        }
        return prev.map((a) => (a.id === id ? { ...a, status } : a))
      })
    }

    const toggleOccupied = (id: string) => {
      setUnits((prev) =>
        prev.map((u) => (u.id === id ? { ...u, occupied: !u.occupied } : u)),
      )
    }

    const selectUnit = (id: string) => setCurrentUnitId(id)
    const navigate = (next: Route) => setRoute(next)

    return {
      units,
      applications,
      theme,
      route,
      currentUnitId,
      addApplication,
      setAppStatus,
      toggleOccupied,
      selectUnit,
      setTheme,
      navigate,
    }
  }, [units, applications, theme, route, currentUnitId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
