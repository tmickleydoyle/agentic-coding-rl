'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: SubsApi = {
  subscriptions: [],
  theme: 'light',
  route: 'dashboard',
  addSubscription: () => {},
  cancelSubscription: () => {},
  removeSubscription: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function SubsProvider({ children }: { children: ReactNode }) {
  // TODO: hold subscriptions/theme/route in state (seed 4 subscriptions), implement the
  // actions, and provide them through SubsContext. The STUB below makes the app mount but
  // does nothing — replace it with real state + actions.
  return <SubsContext.Provider value={STUB}>{children}</SubsContext.Provider>
}

export function useSubs(): SubsApi {
  const v = useContext(SubsContext)
  if (!v) throw new Error('useSubs must be used within a SubsProvider')
  return v
}
