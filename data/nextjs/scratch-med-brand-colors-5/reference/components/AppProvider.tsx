'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Color, Route } from '../lib/types'

type Ctx = {
  colors: Color[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addColor: (name: string, hex: string) => void
  removeColor: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Color[] = [
  { id: 1, name: 'Primary', hex: '#0057ff' },
  { id: 2, name: 'Secondary', hex: '#ff5700' },
  { id: 3, name: 'Neutral', hex: '#f0f0f0' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<Color[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('palette')
  const [nextId, setNextId] = useState(4)

  function addColor(name: string, hex: string) {
    const n = name.trim()
    const h = hex.trim()
    if (!n || !h) return
    if (!h.startsWith('#')) return
    setColors((c) => [...c, { id: nextId, name: n, hex: h }])
    setNextId((i) => i + 1)
  }

  function removeColor(id: number) {
    setColors((c) => c.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    colors,
    theme,
    route,
    navigate: setRoute,
    addColor,
    removeColor,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
