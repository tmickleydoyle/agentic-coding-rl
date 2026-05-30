'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Property, Route, Theme } from '../lib/types'

type AppApi = {
  properties: Property[]
  saved: string[]
  theme: Theme
  route: Route
  rate: number
  termYears: number
  downPayment: number
  isSaved: (id: string) => boolean
  toggleSaved: (id: string) => void
  setRate: (rate: number) => void
  setTermYears: (years: number) => void
  setDownPayment: (amount: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  properties: [],
  saved: [],
  theme: 'light',
  route: 'properties',
  rate: 5,
  termYears: 30,
  downPayment: 0,
  isSaved: () => false,
  toggleSaved: () => {},
  setRate: () => {},
  setTermYears: () => {},
  setDownPayment: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold properties/saved/theme/route/rate/termYears/downPayment in state (seed 3
  // properties), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useMortgage(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useMortgage must be used within an AppStateProvider')
  return v
}
