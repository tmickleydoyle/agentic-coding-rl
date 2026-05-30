'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Category, Item, Route, Theme, Trip } from '../lib/types'

type NewItemInput = {
  tripId: string
  name: string
  category: Category
}

type PackingApi = {
  trips: Trip[]
  items: Item[]
  theme: Theme
  route: Route
  selectedTripId: string | null
  addItem: (input: NewItemInput) => void
  togglePacked: (id: string) => void
  removeItem: (id: string) => void
  selectTrip: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PackingContext = createContext<PackingApi | null>(null)

const STUB: PackingApi = {
  trips: [],
  items: [],
  theme: 'light',
  route: 'trips',
  selectedTripId: null,
  addItem: () => {},
  togglePacked: () => {},
  removeItem: () => {},
  selectTrip: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function PackingProvider({ children }: { children: ReactNode }) {
  // TODO: hold trips/items/theme/route/selectedTripId in state (seed 2 trips + 4 items),
  // implement the actions, and provide them through PackingContext. Replace the STUB.
  return <PackingContext.Provider value={STUB}>{children}</PackingContext.Provider>
}

export function usePacking(): PackingApi {
  const v = useContext(PackingContext)
  if (!v) throw new Error('usePacking must be used within a PackingProvider')
  return v
}
