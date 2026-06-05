'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Blast, Route } from '../lib/types'

type Ctx = {
  blasts: Blast[]
  route: Route
  theme: 'light' | 'dark'
  openedOnly: boolean
  navigate: (r: Route) => void
  addBlast: (subject: string, list: string, sent: string, opens: string, clicks: string) => void
  toggleTheme: () => void
  toggleOpenedOnly: () => void
}

export const GrowthContext = createContext<Ctx | null>(null)

export function GrowthProvider({ children }: { children: ReactNode }) {
  const [blasts, setBlasts] = useState<Blast[]>([])
  const [route, setRoute] = useState<Route>('blasts')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [openedOnly, setOpenedOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addBlast(subject: string, list: string, sent: string, opens: string, clicks: string) {
    const s = parseInt(sent, 10)
    const o = parseInt(opens, 10)
    const c = parseInt(clicks, 10)
    if (![s, o, c].every((n) => Number.isFinite(n) && n >= 0)) return
    setBlasts((b) => [
      ...b,
      { id: nextId, subject: subject.trim(), list, sent: s, opens: o, clicks: c },
    ])
    setNextId((n) => n + 1)
  }

  const value: Ctx = {
    blasts,
    route,
    theme,
    openedOnly,
    navigate: setRoute,
    addBlast,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleOpenedOnly: () => setOpenedOnly((s) => !s),
  }
  return <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>
}
