'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Destination, Route, Theme } from '../lib/types'

type NewDestinationInput = { name: string; country: string; continent: string; notes?: string }

type AppApi = {
  destinations: Destination[]
  theme: Theme
  route: Route
  continentFilter: string
  selectedId: string | null
  addDestination: (input: NewDestinationInput) => void
  toggleVisited: (id: string) => void
  setContinentFilter: (c: string) => void
  selectDestination: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: real state — seed 5 destinations, theme/route/continentFilter/selectedId, and
  // implement addDestination/toggleVisited/setContinentFilter/selectDestination/setTheme/navigate.
  const value: AppApi = {
    destinations: [],
    theme: 'light',
    route: 'list',
    continentFilter: 'all',
    selectedId: null,
    addDestination: () => {},
    toggleVisited: () => {},
    setContinentFilter: () => {},
    selectDestination: () => {},
    setTheme: () => {},
    navigate: () => {},
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
