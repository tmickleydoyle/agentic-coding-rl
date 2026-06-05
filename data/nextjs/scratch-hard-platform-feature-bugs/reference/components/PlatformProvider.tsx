'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Feature, Bug, Severity } from '../lib/types'

type Ctx = {
  route: Route
  features: Feature[]
  bugs: Bug[]
  navigate: (r: Route) => void
  addFeature: (name: string) => void
  fileBug: (featureId: string, title: string, severity: Severity) => void
  closeBug: (id: number) => void
}

export const PlatformContext = createContext<Ctx | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('features')
  const [features, setFeatures] = useState<Feature[]>([])
  const [bugs, setBugs] = useState<Bug[]>([])
  const [nextFeature, setNextFeature] = useState(1)
  const [nextBug, setNextBug] = useState(1)

  function addFeature(name: string) {
    const n = name.trim()
    if (!n) return
    setFeatures((f) => [...f, { id: nextFeature, name: n }])
    setNextFeature((n) => n + 1)
  }

  function fileBug(featureId: string, title: string, severity: Severity) {
    const t = title.trim()
    const fid = parseInt(featureId, 10)
    if (!t || !isFinite(fid)) return
    if (!features.some((f) => f.id === fid)) return
    setBugs((b) => [...b, { id: nextBug, title: t, featureId: fid, severity, open: true }])
    setNextBug((n) => n + 1)
  }

  function closeBug(id: number) {
    setBugs((b) => b.map((x) => (x.id === id ? { ...x, open: false } : x)))
  }

  const value: Ctx = {
    route,
    features,
    bugs,
    navigate: setRoute,
    addFeature,
    fileBug,
    closeBug,
  }
  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}
