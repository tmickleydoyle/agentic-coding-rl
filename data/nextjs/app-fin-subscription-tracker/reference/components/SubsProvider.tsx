'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Cycle, Route, Subscription, Theme } from '../lib/types'

type NewSubInput = {
  name: string
  cost: number
  cycle: Cycle
  nextRenewal: string
}

type SubsApi = {
  subscriptions: Subscription[]
  theme: Theme
  route: Route
  addSubscription: (input: NewSubInput) => void
  cancelSubscription: (id: string) => void
  removeSubscription: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const SubsContext = createContext<SubsApi | null>(null)

const SEED_SUBS: Subscription[] = [
  { id: 's1', name: 'Netflix', cost: 15, cycle: 'monthly', nextRenewal: '2026-06-05', active: true },
  { id: 's2', name: 'Spotify', cost: 10, cycle: 'monthly', nextRenewal: '2026-06-20', active: true },
  { id: 's3', name: 'Amazon Prime', cost: 120, cycle: 'annual', nextRenewal: '2026-06-02', active: true },
  { id: 's4', name: 'Old Gym', cost: 30, cycle: 'monthly', nextRenewal: '2026-06-01', active: false },
]

export function SubsProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(SEED_SUBS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [nextId, setNextId] = useState(5)

  const value = useMemo<SubsApi>(() => {
    const addSubscription = (input: NewSubInput) => {
      const id = `s${nextId}`
      setNextId((n) => n + 1)
      setSubscriptions((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          cost: input.cost,
          cycle: input.cycle,
          nextRenewal: input.nextRenewal,
          active: true,
        },
      ])
    }

    const cancelSubscription = (id: string) => {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: false } : s)),
      )
    }

    const removeSubscription = (id: string) => {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      subscriptions,
      theme,
      route,
      addSubscription,
      cancelSubscription,
      removeSubscription,
      setTheme,
      navigate,
    }
  }, [subscriptions, theme, route, nextId])

  return <SubsContext.Provider value={value}>{children}</SubsContext.Provider>
}

export function useSubs(): SubsApi {
  const v = useContext(SubsContext)
  if (!v) throw new Error('useSubs must be used within a SubsProvider')
  return v
}
