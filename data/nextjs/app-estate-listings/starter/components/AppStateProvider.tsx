'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  BedsFilter,
  Property,
  Route,
  Theme,
  TypeFilter,
} from '../lib/types'

type AppApi = {
  properties: Property[]
  favorites: string[]
  theme: Theme
  route: Route
  selectedId: string | null
  typeFilter: TypeFilter
  bedsFilter: BedsFilter
  maxPrice: number | null
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  setTypeFilter: (filter: TypeFilter) => void
  setBedsFilter: (filter: BedsFilter) => void
  setMaxPrice: (price: number | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
  openProperty: (id: string) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  properties: [],
  favorites: [],
  theme: 'light',
  route: 'listings',
  selectedId: null,
  typeFilter: 'all',
  bedsFilter: 'all',
  maxPrice: null,
  isFavorite: () => false,
  toggleFavorite: () => {},
  setTypeFilter: () => {},
  setBedsFilter: () => {},
  setMaxPrice: () => {},
  setTheme: () => {},
  navigate: () => {},
  openProperty: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold properties/favorites/theme/route/selectedId/filters in state (seed 4
  // properties), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useEstate(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useEstate must be used within an AppStateProvider')
  return v
}
