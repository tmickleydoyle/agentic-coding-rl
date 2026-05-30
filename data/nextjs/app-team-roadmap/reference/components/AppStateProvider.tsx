'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Initiative, Quarter, Route, Status, Theme } from '../lib/types'

type NewInitiativeInput = {
  title: string
  quarterId: string
}

type AppApi = {
  quarters: Quarter[]
  initiatives: Initiative[]
  theme: Theme
  route: Route
  selectedId: string | null
  addInitiative: (input: NewInitiativeInput) => void
  moveInitiative: (id: string, quarterId: string) => void
  setStatus: (id: string, status: Status) => void
  selectInitiative: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_QUARTERS: Quarter[] = [
  { id: 'q1', label: 'Q1' },
  { id: 'q2', label: 'Q2' },
  { id: 'q3', label: 'Q3' },
  { id: 'q4', label: 'Q4' },
]

const SEED_INITIATIVES: Initiative[] = [
  { id: 'i1', title: 'Launch beta', quarterId: 'q1', status: 'in-progress' },
  { id: 'i2', title: 'Mobile app', quarterId: 'q1', status: 'planned' },
  { id: 'i3', title: 'SSO support', quarterId: 'q2', status: 'done' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [quarters] = useState<Quarter[]>(SEED_QUARTERS)
  const [initiatives, setInitiatives] = useState<Initiative[]>(SEED_INITIATIVES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('roadmap')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addInitiative = (input: NewInitiativeInput) => {
      const id = `i${nextId}`
      setNextId((n) => n + 1)
      setInitiatives((prev) => [
        ...prev,
        { id, title: input.title, quarterId: input.quarterId, status: 'planned' },
      ])
    }

    const moveInitiative = (id: string, quarterId: string) => {
      setInitiatives((prev) => prev.map((i) => (i.id === id ? { ...i, quarterId } : i)))
    }

    const setStatus = (id: string, status: Status) => {
      setInitiatives((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    }

    const selectInitiative = (id: string) => {
      setSelectedId(id)
      setRoute('initiative-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      quarters,
      initiatives,
      theme,
      route,
      selectedId,
      addInitiative,
      moveInitiative,
      setStatus,
      selectInitiative,
      setTheme,
      navigate,
    }
  }, [quarters, initiatives, theme, route, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
