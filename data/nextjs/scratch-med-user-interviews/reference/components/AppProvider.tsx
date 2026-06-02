'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Interview, Route } from '../lib/types'

type Ctx = {
  interviews: Interview[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInterview: (participant: string, segment: string, takeaway: string) => void
  deleteInterview: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Interview[] = [
  { id: 1, participant: 'Alice', segment: 'SMB', takeaway: 'Needs faster onboarding' },
  { id: 2, participant: 'Bob', segment: 'Enterprise', takeaway: 'Wants SSO support' },
  { id: 3, participant: 'Carol', segment: 'SMB', takeaway: 'Price is a concern' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [interviews, setInterviews] = useState<Interview[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('interviews')
  const [nextId, setNextId] = useState(4)

  function addInterview(participant: string, segment: string, takeaway: string) {
    const p = participant.trim()
    const s = segment.trim()
    const t = takeaway.trim()
    if (!p || !s || !t) return
    setInterviews((prev) => [...prev, { id: nextId, participant: p, segment: s, takeaway: t }])
    setNextId((n) => n + 1)
  }

  function deleteInterview(id: number) {
    setInterviews((prev) => prev.filter((i) => i.id !== id))
  }

  const value: Ctx = {
    interviews,
    theme,
    route,
    navigate: setRoute,
    addInterview,
    deleteInterview,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
