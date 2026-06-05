'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Review, Route } from '../lib/types'

type Ctx = {
  reviews: Review[]
  showUnrespondedOnly: boolean
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addReview: (customer: string, rating: number) => void
  markResponded: (id: number) => void
  toggleShowUnrespondedOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Review[] = [
  { id: 1, customer: 'Alice', rating: 5, responded: false },
  { id: 2, customer: 'Bob', rating: 3, responded: true },
  { id: 3, customer: 'Carol', rating: 4, responded: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(SEED)
  const [showUnrespondedOnly, setShowUnrespondedOnly] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('reviews')
  const [nextId, setNextId] = useState(4)

  function addReview(customer: string, rating: number) {
    const name = customer.trim()
    if (!name) return
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return
    setReviews((r) => [...r, { id: nextId, customer: name, rating, responded: false }])
    setNextId((n) => n + 1)
  }

  function markResponded(id: number) {
    setReviews((r) =>
      r.map((rev) => (rev.id === id ? { ...rev, responded: true } : rev)),
    )
  }

  const value: Ctx = {
    reviews,
    showUnrespondedOnly,
    theme,
    route,
    navigate: setRoute,
    addReview,
    markResponded,
    toggleShowUnrespondedOnly: () => setShowUnrespondedOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
