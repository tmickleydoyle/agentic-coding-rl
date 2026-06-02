'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Referral, Route } from '../lib/types'

type Ctx = {
  referrals: Referral[]
  route: Route
  theme: 'light' | 'dark'
  convertedOnly: boolean
  navigate: (r: Route) => void
  addReferral: (referrer: string, source: string, invites: string, signups: string) => void
  toggleTheme: () => void
  toggleConvertedOnly: () => void
}

export const GrowthContext = createContext<Ctx | null>(null)

export function GrowthProvider({ children }: { children: ReactNode }) {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [route, setRoute] = useState<Route>('referrals')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [convertedOnly, setConvertedOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addReferral(referrer: string, source: string, invites: string, signups: string) {
    const inv = parseInt(invites, 10)
    const sg = parseInt(signups, 10)
    if (!Number.isFinite(inv) || inv < 0) return
    if (!Number.isFinite(sg) || sg < 0) return
    setReferrals((r) => [
      ...r,
      { id: nextId, referrer: referrer.trim(), source, invites: inv, signups: sg },
    ])
    setNextId((n) => n + 1)
  }

  const value: Ctx = {
    referrals,
    route,
    theme,
    convertedOnly,
    navigate: setRoute,
    addReferral,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleConvertedOnly: () => setConvertedOnly((s) => !s),
  }
  return <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>
}
