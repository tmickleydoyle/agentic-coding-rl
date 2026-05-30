'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Contact, FollowUp, Route, Theme } from '../lib/types'

type NewFollowUp = {
  title: string
  contactId: string
  dueDate: string
}

type AppApi = {
  contacts: Contact[]
  followups: FollowUp[]
  theme: Theme
  route: Route
  addFollowUp: (input: NewFollowUp) => void
  toggleFollowUp: (id: string) => void
  removeFollowUp: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Ada Byron' },
  { id: 'c2', name: 'Grace Hopper' },
  { id: 'c3', name: 'Linus T' },
]

const SEED_FOLLOWUPS: FollowUp[] = [
  { id: 't1', title: 'Call Ada', contactId: 'c1', dueDate: '2026-05-30', done: false },
  { id: 't2', title: 'Email Grace', contactId: 'c2', dueDate: '2026-06-01', done: false },
  { id: 't3', title: 'Demo for Ada', contactId: 'c1', dueDate: '2026-06-05', done: false },
  { id: 't4', title: 'Send quote', contactId: 'c2', dueDate: '2026-06-01', done: true },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [contacts] = useState<Contact[]>(SEED_CONTACTS)
  const [followups, setFollowUps] = useState<FollowUp[]>(SEED_FOLLOWUPS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [nextId, setNextId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const addFollowUp = (input: NewFollowUp) => {
      const id = `t${nextId}`
      setNextId((n) => n + 1)
      setFollowUps((prev) => [...prev, { id, ...input, done: false }])
    }

    const toggleFollowUp = (id: string) => {
      setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, done: !f.done } : f)))
    }

    const removeFollowUp = (id: string) => {
      setFollowUps((prev) => prev.filter((f) => f.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      contacts,
      followups,
      theme,
      route,
      addFollowUp,
      toggleFollowUp,
      removeFollowUp,
      setTheme,
      navigate,
    }
  }, [contacts, followups, theme, route, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
