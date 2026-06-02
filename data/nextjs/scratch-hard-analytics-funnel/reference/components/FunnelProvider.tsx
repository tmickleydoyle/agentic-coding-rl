'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Funnel, Step } from '../lib/types'

type Ctx = {
  funnels: Funnel[]
  steps: Step[]
  route: Route
  theme: 'light' | 'dark'
  hideEmpty: boolean
  addFunnel: (name: string) => void
  addStep: (funnelId: string, name: string, users: string) => void
  navigate: (r: Route) => void
  toggleTheme: () => void
  toggleHideEmpty: () => void
}

export const FunnelContext = createContext<Ctx | null>(null)

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [route, setRoute] = useState<Route>('funnels')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideEmpty, setHideEmpty] = useState(false)
  const [nextFunnel, setNextFunnel] = useState(1)
  const [nextStep, setNextStep] = useState(1)

  function addFunnel(name: string) {
    const n = name.trim()
    if (!n) return
    setFunnels((f) => [...f, { id: nextFunnel, name: n }])
    setNextFunnel((x) => x + 1)
  }

  function addStep(funnelId: string, name: string, users: string) {
    const fid = parseInt(funnelId, 10)
    const n = name.trim()
    if (!n || !isFinite(fid)) return
    const u = parseInt(users, 10)
    const uu = isFinite(u) && u > 0 ? u : 0
    setSteps((s) => [...s, { id: nextStep, funnelId: fid, name: n, users: uu }])
    setNextStep((x) => x + 1)
  }

  const value: Ctx = {
    funnels,
    steps,
    route,
    theme,
    hideEmpty,
    addFunnel,
    addStep,
    navigate: setRoute,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideEmpty: () => setHideEmpty((s) => !s),
  }
  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>
}
