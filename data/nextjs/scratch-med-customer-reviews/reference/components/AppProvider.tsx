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
  toggleShowUnrespondedOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Review[] = [
  { id: 1, customer: 'Alice', rating: 5, responded: true },
  { id: 2, customer: 'Bob', rating: 3, responded: false },
  { id: 3, customer: 'Carol', rating: 4, responded: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(SEED)
  const [route, setRoute] = useState<Route>('reviews')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showUnrespondedOnly, setShowUnrespondedOnly] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addReview(customer: string, rating: number) {
    const c = customer.trim()
    if (!c) return
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) return
    setReviews((r) => [...r, { id: nextId, customer: c, rating, responded: false }])
    setNextId((n) => n + 1)
  }

  function toggleResponded(id: number) {
    setReviews((rs) => rs.map((r) => r.id === id ? { ...r, responded: !r.responded } : r))
  }

  const value: Ctx = {
    reviews,
    route,
    theme,
    showUnrespondedOnly,
    navigate: setRoute,
    addReview,
    toggleResponded,
    toggleShowUnrespondedOnly: () => setShowUnrespondedOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
