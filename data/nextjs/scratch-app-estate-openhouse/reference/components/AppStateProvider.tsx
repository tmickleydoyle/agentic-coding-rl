'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { House, Route, Theme } from '../lib/types'

type FeedbackInput = {
  visitor: string
  rating: number
  note: string
}

type AppApi = {
  houses: House[]
  theme: Theme
  route: Route
  currentHouseId: string | null
  registerVisitor: (houseId: string, name: string) => void
  addFeedback: (houseId: string, feedback: FeedbackInput) => void
  selectHouse: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_HOUSES: House[] = [
  {
    id: 'h1',
    address: '12 Oak St',
    time: '10:00',
    visitors: [{ name: 'Ada' }, { name: 'Lee' }],
    feedback: [{ visitor: 'Ada', rating: 5, note: 'Bright' }],
  },
  {
    id: 'h2',
    address: '9 Pine Ave',
    time: '11:30',
    visitors: [{ name: 'Sam' }],
    feedback: [],
  },
  {
    id: 'h3',
    address: '4 Elm Rd',
    time: '13:00',
    visitors: [],
    feedback: [],
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [houses, setHouses] = useState<House[]>(SEED_HOUSES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('schedule')
  const [currentHouseId, setCurrentHouseId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const registerVisitor = (houseId: string, name: string) => {
      setHouses((prev) =>
        prev.map((h) =>
          h.id === houseId ? { ...h, visitors: [...h.visitors, { name }] } : h,
        ),
      )
    }

    const addFeedback = (houseId: string, feedback: FeedbackInput) => {
      setHouses((prev) =>
        prev.map((h) =>
          h.id === houseId ? { ...h, feedback: [...h.feedback, feedback] } : h,
        ),
      )
    }

    const selectHouse = (id: string) => setCurrentHouseId(id)
    const navigate = (next: Route) => setRoute(next)

    return {
      houses,
      theme,
      route,
      currentHouseId,
      registerVisitor,
      addFeedback,
      selectHouse,
      setTheme,
      navigate,
    }
  }, [houses, theme, route, currentHouseId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
