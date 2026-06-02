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

const SEED: Review[] = [
  { id: 1, customer: 'Alice', rating: 5, responded: false },
  { id: 2, customer: 'Bob', rating: 3, responded: false },
  { id: 3, customer: 'Carol', rating: 4, responded: true },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('reviews')
  const [nextId, setNextId] = useState(4)

  function addReview(customer: string, rating: number) {
    const c = customer.trim()
    if (!c) return
    const r = Math.max(1, Math.min(5, rating))
    setReviews((prev) => [...prev, { id: nextId, customer: c, rating: r, responded: false }])
    setNextId((n) => n + 1)
  }

  function toggleResponded(id: number) {
    setReviews((prev) =>
      prev.map((rev) => (rev.id === id ? { ...rev, responded: !rev.responded } : rev)),
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
