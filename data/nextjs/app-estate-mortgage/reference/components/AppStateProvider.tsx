'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Property, Route, Theme } from '../lib/types'

type AppApi = {
  properties: Property[]
  saved: string[]
  theme: Theme
  route: Route
  rate: number
  termYears: number
  downPayment: number
  isSaved: (id: string) => boolean
  toggleSaved: (id: string) => void
  setRate: (rate: number) => void
  setTermYears: (years: number) => void
  setDownPayment: (amount: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PROPERTIES: Property[] = [
  { id: 'p1', address: '12 Oak St', price: 450000 },
  { id: 'p2', address: '500 Pine Ave', price: 320000 },
  { id: 'p3', address: '88 Maple Rd', price: 510000 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [properties] = useState<Property[]>(SEED_PROPERTIES)
  const [saved, setSaved] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('properties')
  const [rate, setRate] = useState<number>(5)
  const [termYears, setTermYears] = useState<number>(30)
  const [downPayment, setDownPayment] = useState<number>(0)

  const value = useMemo<AppApi>(() => {
    const isSaved = (id: string) => saved.indexOf(id) !== -1

    const toggleSaved = (id: string) => {
      setSaved((prev) =>
        prev.indexOf(id) !== -1 ? prev.filter((s) => s !== id) : [...prev, id],
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      properties,
      saved,
      theme,
      route,
      rate,
      termYears,
      downPayment,
      isSaved,
      toggleSaved,
      setRate,
      setTermYears,
      setDownPayment,
      setTheme,
      navigate,
    }
  }, [properties, saved, theme, route, rate, termYears, downPayment])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useMortgage(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useMortgage must be used within an AppStateProvider')
  return v
}
