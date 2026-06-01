'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Booking, Category, CategoryFilter, Gig, Route, Theme } from '../lib/types'

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

const SEED_GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Logo design',
    category: 'design',
    price: 80,
    reviews: [
      { id: 'r1', author: 'sam', rating: 5, text: 'Great!' },
      { id: 'r2', author: 'mia', rating: 4, text: 'Solid' },
    ],
  },
  { id: 'g2', title: 'Blog post', category: 'writing', price: 50, reviews: [] },
  {
    id: 'g3',
    title: 'Bug fix',
    category: 'dev',
    price: 120,
    reviews: [{ id: 'r3', author: 'lee', rating: 3, text: 'Ok' }],
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [gigs, setGigs] = useState<Gig[]>(SEED_GIGS)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('gigs')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextBookingId, setNextBookingId] = useState(1)
  const [nextReviewId, setNextReviewId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const select = (id: string) => {
      setSelectedId(id)
      setRoute('detail')
    }

    const book = (gigId: string, name: string): boolean => {
      if (name.trim().length === 0) return false
      const id = `bk${nextBookingId}`
      setNextBookingId((n) => n + 1)
      setBookings((prev) => [...prev, { id, gigId, name: name.trim() }])
      return true
    }

    const addReview = (gigId: string, input: NewReviewInput) => {
      const id = `r${nextReviewId}`
      setNextReviewId((n) => n + 1)
      setGigs((prev) =>
        prev.map((g) =>
          g.id === gigId
            ? { ...g, reviews: [...g.reviews, { id, author: input.author, rating: input.rating, text: input.text }] }
            : g,
        ),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      gigs,
      bookings,
      theme,
      route,
      categoryFilter,
      selectedId,
      select,
      book,
      addReview,
      setCategoryFilter,
      setTheme,
      navigate,
    }
  }, [gigs, bookings, theme, route, categoryFilter, selectedId, nextBookingId, nextReviewId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
