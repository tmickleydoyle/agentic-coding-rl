'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Review, Route } from '../lib/types'

type Ctx = {
  reviews: Review[]
  route: Route
  theme: 'light' | 'dark'
  showUnrespondedOnly: boolean
  navigate: (r: Route) => void
  addReview: (customer: string, rating: number) => void
  toggleResponded: (id: number) => void
  toggleFilter: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [route, setRoute] = useState<Route>('reviews')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showUnrespondedOnly, setShowUnrespondedOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addReview(customer: string, rating: number) {
    const name = customer.trim()
    if (!name) return
    const clampedRating = rating < 1 || rating > 5 ? 1 : Math.round(rating)
    setReviews((r) => [...r, { id: nextId, customer: name, rating: clampedRating, responded: false }])
    setNextId((n) => n + 1)
  }

  function toggleResponded(id: number) {
    setReviews((r) => r.map((rev) => rev.id === id ? { ...rev, responded: !rev.responded } : rev))
  }

  const value: Ctx = {
    reviews,
    route,
    theme,
    showUnrespondedOnly,
    navigate: setRoute,
    addReview,
    toggleResponded,
    toggleFilter: () => setShowUnrespondedOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
