'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Sale, Route } from '../lib/types'

type Ctx = {
  sales: Sale[]
  theme: 'light' | 'dark'
  hideZeroTip: boolean
  route: Route
  navigate: (r: Route) => void
  addSale: (client: string, service: string, tip: string) => void
  toggleTheme: () => void
  toggleHideZeroTip: () => void
}
export const SalonContext = createContext<Ctx | null>(null)

export function SalonProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideZeroTip, setHideZeroTip] = useState(false)
  const [route, setRoute] = useState<Route>('sales')
  const [nextId, setNextId] = useState(1)

  function addSale(client: string, service: string, tip: string) {
    const name = client.trim()
    if (!name) return
    const t = parseFloat(tip)
    const tipVal = !isFinite(t) || t < 0 ? 0 : t
    setSales((s) => [...s, { id: nextId, client: name, service, tip: tipVal }])
    setNextId((n) => n + 1)
  }

  const value: Ctx = {
    sales,
    theme,
    hideZeroTip,
    route,
    navigate: setRoute,
    addSale,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideZeroTip: () => setHideZeroTip((s) => !s),
  }
  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>
}
