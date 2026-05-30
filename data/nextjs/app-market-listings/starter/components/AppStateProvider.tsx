'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  Category,
  CategoryFilter,
  Listing,
  Route,
  Theme,
} from '../lib/types'

type NewListingInput = {
  title: string
  category: Category
  price: number
  seller: string
  description: string
}

type AppApi = {
  listings: Listing[]
  favorites: string[]
  theme: Theme
  route: Route
  categoryFilter: CategoryFilter
  selectedId: string | null
  addListing: (input: NewListingInput) => void
  toggleFavorite: (id: string) => void
  select: (id: string) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  listings: [],
  favorites: [],
  theme: 'light',
  route: 'browse',
  categoryFilter: 'all',
  selectedId: null,
  addListing: () => {},
  toggleFavorite: () => {},
  select: () => {},
  setCategoryFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold listings/favorites/theme/route/filter/selectedId in state (seed 3 listings),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
