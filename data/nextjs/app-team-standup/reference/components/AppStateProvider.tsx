'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Entry, Member, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type NewEntryInput = {
  memberId: string
  yesterday: string
  today: string
  blocker?: string | null
}

type AppApi = {
  members: Member[]
  entries: Entry[]
  theme: Theme
  route: Route
  selectedDate: string
  addEntry: (input: NewEntryInput) => void
  selectDate: (date: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_MEMBERS: Member[] = [
  { id: 'm1', name: 'Ada' },
  { id: 'm2', name: 'Grace' },
  { id: 'm3', name: 'Linus' },
]

const SEED_ENTRIES: Entry[] = [
  { id: 'e1', memberId: 'm1', date: '2026-05-28', yesterday: 'Drafted spec', today: 'Implement API', blocker: 'Waiting on review' },
  { id: 'e2', memberId: 'm2', date: '2026-05-28', yesterday: 'Fixed bug', today: 'Write tests', blocker: null },
  { id: 'e3', memberId: 'm1', date: TODAY, yesterday: 'Implement API', today: 'Review PRs', blocker: null },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [members] = useState<Member[]>(SEED_MEMBERS)
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [selectedDate, setSelectedDate] = useState<string>(TODAY)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addEntry = (input: NewEntryInput) => {
      const id = `e${nextId}`
      setNextId((n) => n + 1)
      const rawBlocker = input.blocker
      const blocker =
        typeof rawBlocker === 'string' && rawBlocker.trim().length > 0 ? rawBlocker.trim() : null
      setEntries((prev) => [
        ...prev,
        {
          id,
          memberId: input.memberId,
          date: TODAY,
          yesterday: input.yesterday,
          today: input.today,
          blocker,
        },
      ])
    }

    const selectDate = (date: string) => setSelectedDate(date)
    const navigate = (next: Route) => setRoute(next)

    return {
      members,
      entries,
      theme,
      route,
      selectedDate,
      addEntry,
      selectDate,
      setTheme,
      navigate,
    }
  }, [members, entries, theme, route, selectedDate, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
