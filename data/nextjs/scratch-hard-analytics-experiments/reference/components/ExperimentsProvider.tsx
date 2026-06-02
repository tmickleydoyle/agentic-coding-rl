'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Experiment, Variant } from '../lib/types'

type Ctx = {
  experiments: Experiment[]
  variants: Variant[]
  route: Route
  theme: 'light' | 'dark'
  hideEmpty: boolean
  addExperiment: (name: string) => void
  addVariant: (experimentId: string, name: string, visitors: string, conversions: string) => void
  navigate: (r: Route) => void
  toggleTheme: () => void
  toggleHideEmpty: () => void
}

export const ExperimentsContext = createContext<Ctx | null>(null)

export function ExperimentsProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [route, setRoute] = useState<Route>('experiments')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideEmpty, setHideEmpty] = useState(false)
  const [nextExp, setNextExp] = useState(1)
  const [nextVar, setNextVar] = useState(1)

  function addExperiment(name: string) {
    const n = name.trim()
    if (!n) return
    setExperiments((e) => [...e, { id: nextExp, name: n }])
    setNextExp((x) => x + 1)
  }

  function addVariant(experimentId: string, name: string, visitors: string, conversions: string) {
    const eid = parseInt(experimentId, 10)
    const n = name.trim()
    if (!n || !isFinite(eid)) return
    const v = parseInt(visitors, 10)
    const c = parseInt(conversions, 10)
    const vis = isFinite(v) && v > 0 ? v : 0
    const conv = isFinite(c) && c > 0 ? c : 0
    if (conv > vis) return
    setVariants((vs) => [
      ...vs,
      { id: nextVar, experimentId: eid, name: n, visitors: vis, conversions: conv },
    ])
    setNextVar((x) => x + 1)
  }

  const value: Ctx = {
    experiments,
    variants,
    route,
    theme,
    hideEmpty,
    addExperiment,
    addVariant,
    navigate: setRoute,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideEmpty: () => setHideEmpty((s) => !s),
  }
  return <ExperimentsContext.Provider value={value}>{children}</ExperimentsContext.Provider>
}
