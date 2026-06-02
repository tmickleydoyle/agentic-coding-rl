'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Campaign, Route } from '../lib/types'

type Ctx = {
  campaigns: Campaign[]
  route: Route
  theme: 'light' | 'dark'
  activeOnly: boolean
  navigate: (r: Route) => void
  addCampaign: (name: string, channel: string, spend: string, conversions: string) => void
  toggleTheme: () => void
  toggleActiveOnly: () => void
}

export const GrowthContext = createContext<Ctx | null>(null)

export function GrowthProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [route, setRoute] = useState<Route>('campaigns')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeOnly, setActiveOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addCampaign(name: string, channel: string, spend: string, conversions: string) {
    const sp = parseFloat(spend)
    const cv = parseInt(conversions, 10)
    if (!isFinite(sp) || sp < 0) return
    if (!Number.isFinite(cv) || cv < 0) return
    setCampaigns((c) => [
      ...c,
      { id: nextId, name: name.trim(), channel, spend: sp, conversions: cv },
    ])
    setNextId((n) => n + 1)
  }

  const value: Ctx = {
    campaigns,
    route,
    theme,
    activeOnly,
    navigate: setRoute,
    addCampaign,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleActiveOnly: () => setActiveOnly((s) => !s),
  }
  return <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>
}
