'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  houses: [],
  theme: 'light',
  route: 'schedule',
  currentHouseId: null,
  registerVisitor: () => {},
  addFeedback: () => {},
  selectHouse: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold houses/theme/route/currentHouseId in state (seed 3 houses), implement the
  // actions, and provide them through AppContext. The STUB below makes the app mount but
  // does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
