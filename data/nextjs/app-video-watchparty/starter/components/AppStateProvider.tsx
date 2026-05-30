'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Filter, Party, Route, Theme } from '../lib/types'

type AppApi = {
  parties: Party[]
  theme: Theme
  route: Route
  filter: Filter
  selectedPartyId: string | null
  partyStatus: (party: Party) => Filter
  openParty: (partyId: string) => void
  toggleRsvp: (partyId: string) => void
  queueVideo: (partyId: string, title: string) => void
  removeFromQueue: (partyId: string, index: number) => void
  createParty: (title: string, time: number) => void
  setFilter: (filter: Filter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  parties: [],
  theme: 'light',
  route: 'parties',
  filter: 'upcoming',
  selectedPartyId: null,
  partyStatus: () => 'past',
  openParty: () => {},
  toggleRsvp: () => {},
  queueVideo: () => {},
  removeFromQueue: () => {},
  createParty: () => {},
  setFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold parties/theme/route/filter/selectedPartyId in state (seed via seedParties()),
  // implement the actions, and provide them via AppContext. The STUB below mounts the app
  // but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
