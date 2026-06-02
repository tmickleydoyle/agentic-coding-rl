'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Subscriber } from '../lib/types'
import { PLANS } from '../lib/plans'

type Ctx = {
  subscribers: Subscriber[]
  route: Route
  theme: 'light' | 'dark'
  hideInactive: boolean
  navigate: (r: Route) => void
  addSubscriber: (name: string, planId: string) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  toggleHideInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Subscriber[] = [
  { id: 1, name: 'Alice', planId: 'pro', active: true },
  { id: 2, name: 'Bob', planId: 'starter', active: true },
  { id: 3, name: 'Carol', planId: 'growth', active: true },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SEED)
  const [route, setRoute] = useState<Route>('subscribers')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideInactive, setHideInactive] = useState(false)
  const [nextId, setNextId] = useState(10)

  function addSubscriber(name: string, planId: string) {
    const n = name.trim()
    if (!n) return
    setSubscribers((s) => [...s, { id: nextId, name: n, planId, active: true }])
    setNextId((x) => x + 1)
  }

  function toggleActive(id: number) {
    setSubscribers((s) => s.map((sub) => sub.id === id ? { ...sub, active: !sub.active } : sub))
  }

  const value: Ctx = {
    subscribers,
    route,
    theme,
    hideInactive,
    navigate: setRoute,
    addSubscriber,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideInactive: () => setHideInactive((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
