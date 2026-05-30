'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  companies: [],
  contacts: [],
  activities: [],
  theme: 'light',
  route: 'contacts',
  selectedContactId: null,
  addTag: () => {},
  removeTag: () => {},
  logActivity: () => {},
  selectContact: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold companies/contacts/activities/theme/route/selectedContactId in state
  // (seed 2 companies + 3 contacts + 3 activities), implement the actions, and provide
  // them through AppContext. The STUB below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
