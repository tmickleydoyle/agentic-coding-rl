'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  products: [],
  reviews: [],
  theme: 'light',
  route: 'products',
  selectedId: null,
  sortBy: 'date',
  selectProduct: () => {},
  addReview: () => {},
  removeReview: () => {},
  setSortBy: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold products/reviews/theme/route/selectedId/sortBy in state (seed 3 products + 3
  // reviews), implement selectProduct/addReview/removeReview/navigate, and provide them
  // through AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useReviews(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useReviews must be used within an AppStateProvider')
  return v
}
