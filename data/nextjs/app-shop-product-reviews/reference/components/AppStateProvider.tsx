'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Product, Review, Route, SortBy, Theme } from '../lib/types'

type NewReviewInput = {
  productId: string
  rating: number
  text: string
}

type AppApi = {
  products: Product[]
  reviews: Review[]
  theme: Theme
  route: Route
  selectedId: string | null
  sortBy: SortBy
  selectProduct: (id: string) => void
  addReview: (input: NewReviewInput) => void
  removeReview: (id: string) => void
  setSortBy: (sort: SortBy) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Wireless Mouse', category: 'accessories' },
  { id: 'p2', name: 'Mechanical Keyboard', category: 'accessories' },
  { id: 'p3', name: 'Standing Desk', category: 'furniture' },
]

const SEED_REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', rating: 5, text: 'Great mouse', createdAt: 1 },
  { id: 'r2', productId: 'p1', rating: 3, text: 'A bit small', createdAt: 2 },
  { id: 'r3', productId: 'p2', rating: 4, text: 'Clicky and nice', createdAt: 3 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(SEED_PRODUCTS)
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('products')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [nextId, setNextId] = useState(4)
  const [nextCreatedAt, setNextCreatedAt] = useState(4)

  const value = useMemo<AppApi>(() => {
    const selectProduct = (id: string) => {
      setSelectedId(id)
      setRoute('product-reviews')
    }

    const addReview = (input: NewReviewInput) => {
      const id = `r${nextId}`
      const createdAt = nextCreatedAt
      setNextId((n) => n + 1)
      setNextCreatedAt((n) => n + 1)
      setReviews((prev) => [
        ...prev,
        { id, productId: input.productId, rating: input.rating, text: input.text, createdAt },
      ])
    }

    const removeReview = (id: string) => {
      setReviews((prev) => prev.filter((r) => r.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      products,
      reviews,
      theme,
      route,
      selectedId,
      sortBy,
      selectProduct,
      addReview,
      removeReview,
      setSortBy,
      setTheme,
      navigate,
    }
  }, [products, reviews, theme, route, selectedId, sortBy, nextId, nextCreatedAt])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useReviews(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useReviews must be used within an AppStateProvider')
  return v
}
