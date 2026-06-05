'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Review, Route } from '../lib/types'

type Ctx = {
  reviews: Review[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addReview: (customer: string, rating: number) => void
  toggleResponded: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('reviews')
  const [nextId, setNextId] = useState(1)

  function addReview(customer: string, rating: number) {
    const name = customer.trim()
    if (!name) return
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return
    setReviews((r) => [...r, { id: nextId, customer: name, rating, responded: false }])
    setNextId((n) => n + 1)
  }

  function toggleResponded(id: number) {
    setReviews((rs) =>
      rs.map((r) => (r.id === id ? { ...r, responded: !r.responded } : r)),
    )
  }

  const value: Ctx = {
    reviews,
    theme,
    route,
    navigate: setRoute,
    addReview,
    toggleResponded,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
