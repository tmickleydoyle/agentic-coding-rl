'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Filter, Party, Route, Theme } from '../lib/types'
import { NOW } from '../lib/types'
import { seedParties } from '../lib/seed'

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

function status(party: Party): Filter {
  return party.time > NOW ? 'upcoming' : 'past'
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [parties, setParties] = useState<Party[]>(() => seedParties())
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('parties')
  const [filter, setFilter] = useState<Filter>('upcoming')
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const openParty = (partyId: string) => {
      setSelectedPartyId(partyId)
      setRoute('party-detail')
    }

    const toggleRsvp = (partyId: string) => {
      setParties((prev) =>
        prev.map((p) => (p.id === partyId ? { ...p, rsvped: !p.rsvped } : p)),
      )
    }

    const queueVideo = (partyId: string, title: string) => {
      const t = title.trim()
      if (!t) return
      setParties((prev) =>
        prev.map((p) => (p.id === partyId ? { ...p, queue: [...p.queue, t] } : p)),
      )
    }

    const removeFromQueue = (partyId: string, index: number) => {
      setParties((prev) =>
        prev.map((p) =>
          p.id === partyId
            ? { ...p, queue: p.queue.filter((_, i) => i !== index) }
            : p,
        ),
      )
    }

    const createParty = (title: string, time: number) => {
      const t = title.trim()
      if (!t) return
      setParties((prev) => [
        ...prev,
        { id: `p${prev.length + 1}`, title: t, time, rsvped: false, queue: [] },
      ])
      setRoute('parties')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      parties,
      theme,
      route,
      filter,
      selectedPartyId,
      partyStatus: status,
      openParty,
      toggleRsvp,
      queueVideo,
      removeFromQueue,
      createParty,
      setFilter,
      setTheme,
      navigate,
    }
  }, [parties, theme, route, filter, selectedPartyId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
