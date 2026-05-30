'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Booking, CategoryFilter, Gig, Route, Theme } from '../lib/types'

type NewReviewInput = {
  author: string
  rating: number
  text: string
}

type AppApi = {
  gigs: Gig[]
  bookings: Booking[]
  theme: Theme
  route: Route
  categoryFilter: CategoryFilter
  selectedId: string | null
  select: (id: string) => void
  book: (gigId: string, name: string) => boolean
  addReview: (gigId: string, input: NewReviewInput) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  gigs: [],
  bookings: [],
  theme: 'light',
  route: 'gigs',
  categoryFilter: 'all',
  selectedId: null,
  select: () => {},
  book: () => false,
  addReview: () => {},
  setCategoryFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold gigs/bookings/theme/route/filter/selectedId in state (seed 3 gigs),
  // implement select, book (blank name rejected), addReview, navigate. The STUB below makes
  // the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
