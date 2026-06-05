'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PROPERTIES: Property[] = [
  { id: 'h1', address: '12 Oak St', type: 'house', price: 450000, beds: 3, baths: 2 },
  { id: 'h2', address: '500 Pine Ave', type: 'condo', price: 320000, beds: 2, baths: 1 },
  { id: 'h3', address: '88 Maple Rd', type: 'townhouse', price: 510000, beds: 4, baths: 3 },
  { id: 'h4', address: '7 Birch Ln', type: 'house', price: 615000, beds: 5, baths: 4 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [properties] = useState<Property[]>(SEED_PROPERTIES)
  const [favorites, setFavorites] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('listings')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [bedsFilter, setBedsFilter] = useState<BedsFilter>('all')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  const value = useMemo<AppApi>(() => {
    const isFavorite = (id: string) => favorites.indexOf(id) !== -1

    const toggleFavorite = (id: string) => {
      setFavorites((prev) =>
        prev.indexOf(id) !== -1 ? prev.filter((f) => f !== id) : [...prev, id],
      )
    }

    const navigate = (next: Route) => setRoute(next)

    const openProperty = (id: string) => {
      setSelectedId(id)
      setRoute('property-detail')
    }

    return {
      properties,
      favorites,
      theme,
      route,
      selectedId,
      typeFilter,
      bedsFilter,
      maxPrice,
      isFavorite,
      toggleFavorite,
      setTypeFilter,
      setBedsFilter,
      setMaxPrice,
      setTheme,
      navigate,
      openProperty,
    }
  }, [properties, favorites, theme, route, selectedId, typeFilter, bedsFilter, maxPrice])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useEstate(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useEstate must be used within an AppStateProvider')
  return v
}
