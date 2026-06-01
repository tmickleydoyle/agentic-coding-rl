'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { MoodEntry, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type MoodApi = {
  entries: MoodEntry[]
  theme: Theme
  route: Route
  today: string
  logMood: (input: { date: string; score: number; triggers?: string[] }) => void
  removeEntry: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const MoodContext = createContext<MoodApi | null>(null)

const SEED_ENTRIES: MoodEntry[] = [
  { id: 'm1', date: '2026-05-25', score: 4, triggers: ['sleep'] },
  { id: 'm2', date: '2026-05-26', score: 2, triggers: ['work', 'stress'] },
  { id: 'm3', date: '2026-05-27', score: 5, triggers: ['exercise'] },
]

export function MoodProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<MoodEntry[]>(SEED_ENTRIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [today] = useState(TODAY)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<MoodApi>(() => {
    const logMood = (input: { date: string; score: number; triggers?: string[] }) => {
      const triggers = input.triggers ?? []
      setEntries((prev) => {
        const existing = prev.find((e) => e.date === input.date)
        if (existing) {
          return prev.map((e) =>
            e.date === input.date
              ? { ...e, score: input.score, triggers: triggers.slice() }
              : e,
          )
        }
        const id = `m${nextId}`
        setNextId((n) => n + 1)
        return [...prev, { id, date: input.date, score: input.score, triggers: triggers.slice() }]
      })
    }

    const removeEntry = (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return { entries, theme, route, today, logMood, removeEntry, setTheme, navigate }
  }, [entries, theme, route, today, nextId])

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>
}

export function useMood(): MoodApi {
  const v = useContext(MoodContext)
  if (!v) throw new Error('useMood must be used within a MoodProvider')
  return v
}
