'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Activity, ActivityKind, Company, Contact, Route, Theme } from '../lib/types'

type AppApi = {
  companies: Company[]
  contacts: Contact[]
  activities: Activity[]
  theme: Theme
  route: Route
  selectedContactId: string | null
  addTag: (contactId: string, tag: string) => void
  removeTag: (contactId: string, tag: string) => void
  logActivity: (input: { contactId: string; kind: ActivityKind; text: string }) => void
  selectContact: (contactId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_COMPANIES: Company[] = [
  { id: 'co1', name: 'Acme' },
  { id: 'co2', name: 'Globex' },
]

const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Ada Byron', companyId: 'co1', tags: ['vip', 'lead'] },
  { id: 'c2', name: 'Grace Hopper', companyId: 'co1', tags: ['lead'] },
  { id: 'c3', name: 'Linus T', companyId: 'co2', tags: [] },
]

const SEED_ACTIVITIES: Activity[] = [
  { id: 'a1', contactId: 'c1', kind: 'call', text: 'Intro call' },
  { id: 'a2', contactId: 'c1', kind: 'email', text: 'Sent deck' },
  { id: 'a3', contactId: 'c2', kind: 'note', text: 'Warm lead' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [companies] = useState<Company[]>(SEED_COMPANIES)
  const [contacts, setContacts] = useState<Contact[]>(SEED_CONTACTS)
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('contacts')
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [nextActId, setNextActId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addTag = (contactId: string, tag: string) => {
      const clean = tag.trim()
      if (!clean) return
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId && !c.tags.includes(clean)
            ? { ...c, tags: [...c.tags, clean] }
            : c,
        ),
      )
    }

    const removeTag = (contactId: string, tag: string) => {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId ? { ...c, tags: c.tags.filter((t) => t !== tag) } : c,
        ),
      )
    }

    const logActivity = (input: { contactId: string; kind: ActivityKind; text: string }) => {
      const id = `a${nextActId}`
      setNextActId((n) => n + 1)
      setActivities((prev) => [...prev, { id, ...input }])
    }

    const selectContact = (contactId: string) => {
      setSelectedContactId(contactId)
      setRoute('contact-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      companies,
      contacts,
      activities,
      theme,
      route,
      selectedContactId,
      addTag,
      removeTag,
      logActivity,
      selectContact,
      setTheme,
      navigate,
    }
  }, [companies, contacts, activities, theme, route, selectedContactId, nextActId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
