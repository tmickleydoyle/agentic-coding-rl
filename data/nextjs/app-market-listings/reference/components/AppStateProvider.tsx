'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_LISTINGS: Listing[] = [
  { id: 'l1', title: 'iPhone 12', category: 'electronics', price: 400, seller: 'alice', description: 'Used phone, good condition.' },
  { id: 'l2', title: 'Oak desk', category: 'furniture', price: 150, seller: 'bob', description: 'Solid oak writing desk.' },
  { id: 'l3', title: 'Road bike', category: 'vehicles', price: 220, seller: 'carol', description: 'Lightweight road bike.' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS)
  const [favorites, setFavorites] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('browse')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addListing = (input: NewListingInput) => {
      const id = `l${nextId}`
      setNextId((n) => n + 1)
      setListings((prev) => [...prev, { ...input, id }])
    }

    const toggleFavorite = (id: string) => {
      setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
    }

    const select = (id: string) => {
      setSelectedId(id)
      setRoute('detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      listings,
      favorites,
      theme,
      route,
      categoryFilter,
      selectedId,
      addListing,
      toggleFavorite,
      select,
      setCategoryFilter,
      setTheme,
      navigate,
    }
  }, [listings, favorites, theme, route, categoryFilter, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
