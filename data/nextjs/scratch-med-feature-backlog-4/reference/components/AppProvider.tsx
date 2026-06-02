'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Feature, Priority, Route, Status } from '../lib/types'

const STATUS_ORDER: Status[] = ['idea', 'building', 'shipped']

const SEED: Feature[] = [
  { id: 1, title: 'OAuth login', priority: 'P0', status: 'idea' },
  { id: 2, title: 'CSV export', priority: 'P1', status: 'building' },
  { id: 3, title: 'Dark mode', priority: 'P2', status: 'shipped' },
]

type Ctx = {
  features: Feature[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addFeature: (title: string, priority: Priority) => void
  advanceFeature: (id: number) => void
  deleteFeature: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('backlog')
  const [nextId, setNextId] = useState(4)

  function addFeature(title: string, priority: Priority) {
    const t = title.trim()
    if (!t) return
    setFeatures((f) => [...f, { id: nextId, title: t, priority, status: 'idea' }])
    setNextId((n) => n + 1)
  }

  function advanceFeature(id: number) {
    setFeatures((f) =>
      f.map((feat) => {
        if (feat.id !== id) return feat
        const idx = STATUS_ORDER.indexOf(feat.status)
        if (idx === STATUS_ORDER.length - 1) return feat
        return { ...feat, status: STATUS_ORDER[idx + 1] }
      }),
    )
  }

  function deleteFeature(id: number) {
    setFeatures((f) => f.filter((feat) => feat.id !== id))
  }

  const value: Ctx = {
    features,
    theme,
    route,
    navigate: setRoute,
    addFeature,
    advanceFeature,
    deleteFeature,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
