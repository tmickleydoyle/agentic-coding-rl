'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EventItem, Invite, Route, Rsvp, Theme } from '../lib/types'

type AppApi = {
  events: EventItem[]
  theme: Theme
  route: Route
  selectedEventId: string | null
  selectedInviteId: string | null
  selectEvent: (id: string) => void
  selectInvite: (eventId: string, inviteId: string) => void
  headcount: (eventId: string) => number
  respond: (
    eventId: string,
    inviteId: string,
    status: Rsvp,
    extraGuests: number,
  ) => boolean
  addEvent: (name: string, date: string) => string | null
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function seedEvents(): EventItem[] {
  return [
    {
      id: 'e1',
      name: 'Launch Party',
      date: '2026-09-10',
      invites: [
        { id: 'i1', guest: 'Ada', status: 'yes', extraGuests: 2 },
        { id: 'i2', guest: 'Grace', status: 'maybe', extraGuests: 0 },
        { id: 'i3', guest: 'Linus', status: 'pending', extraGuests: 0 },
      ],
    },
    {
      id: 'e2',
      name: 'Team Offsite',
      date: '2026-10-01',
      invites: [{ id: 'i4', guest: 'Edsger', status: 'no', extraGuests: 0 }],
    },
  ]
}

function headcountOf(invites: Invite[]): number {
  return invites.reduce(
    (acc, i) => (i.status === 'yes' ? acc + 1 + i.extraGuests : acc),
    0,
  )
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(seedEvents)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('events')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedInviteId, setSelectedInviteId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const headcount = (eventId: string): number => {
      const event = events.find((e) => e.id === eventId)
      if (!event) return 0
      return headcountOf(event.invites)
    }

    const selectEvent = (id: string) => {
      setSelectedEventId(id)
      setRoute('responses')
    }

    const selectInvite = (eventId: string, inviteId: string) => {
      setSelectedEventId(eventId)
      setSelectedInviteId(inviteId)
      setRoute('invite-detail')
    }

    const respond = (
      eventId: string,
      inviteId: string,
      status: Rsvp,
      extraGuests: number,
    ): boolean => {
      const event = events.find((e) => e.id === eventId)
      if (!event) return false
      const invite = event.invites.find((i) => i.id === inviteId)
      if (!invite) return false
      if (!Number.isInteger(extraGuests) || extraGuests < 0) return false
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? {
                ...e,
                invites: e.invites.map((i) =>
                  i.id === inviteId ? { ...i, status, extraGuests } : i,
                ),
              }
            : e,
        ),
      )
      return true
    }

    const addEvent = (name: string, date: string): string | null => {
      if (name.trim().length === 0) return null
      const id = `e${nextId}`
      setNextId((n) => n + 1)
      setEvents((prev) => [
        ...prev,
        { id, name: name.trim(), date, invites: [] },
      ])
      return id
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      events,
      theme,
      route,
      selectedEventId,
      selectedInviteId,
      selectEvent,
      selectInvite,
      headcount,
      respond,
      addEvent,
      setTheme,
      navigate,
    }
  }, [events, theme, route, selectedEventId, selectedInviteId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
