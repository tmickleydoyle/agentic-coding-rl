'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Appointment, Provider, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type BookInput = {
  providerId: string
  date: string
  patient: string
}

type AppApi = {
  providers: Provider[]
  appointments: Appointment[]
  today: string
  theme: Theme
  route: Route
  selectedProviderId: string | null
  selectProvider: (id: string) => void
  availableSlots: (providerId: string) => string[]
  book: (input: BookInput) => boolean
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PROVIDERS: Provider[] = [
  { id: 'p1', name: 'Dr. Ada Lovelace', specialty: 'Cardiology', slots: ['2026-06-10', '2026-06-12'] },
  { id: 'p2', name: 'Dr. Grace Hopper', specialty: 'Dermatology', slots: ['2026-05-20', '2026-06-15'] },
  { id: 'p3', name: 'Dr. Alan Turing', specialty: 'Neurology', slots: ['2026-06-20'] },
]

const SEED_APPOINTMENTS: Appointment[] = [
  { id: 'a1', providerId: 'p1', date: '2026-06-10', patient: 'Sam' },
  { id: 'a2', providerId: 'p2', date: '2026-05-20', patient: 'Pat' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [providers] = useState<Provider[]>(SEED_PROVIDERS)
  const [appointments, setAppointments] = useState<Appointment[]>(SEED_APPOINTMENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('providers')
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const availableSlots = (providerId: string): string[] => {
      const provider = providers.find((p) => p.id === providerId)
      if (!provider) return []
      return provider.slots.filter(
        (s) => !appointments.some((a) => a.providerId === providerId && a.date === s),
      )
    }

    const selectProvider = (id: string) => {
      setSelectedProviderId(id)
      setRoute('book')
    }

    const book = (input: BookInput): boolean => {
      const provider = providers.find((p) => p.id === input.providerId)
      if (!provider) return false
      if (!provider.slots.includes(input.date)) return false
      const taken = appointments.some(
        (a) => a.providerId === input.providerId && a.date === input.date,
      )
      if (taken) return false
      const id = `a${nextId}`
      setNextId((n) => n + 1)
      setAppointments((prev) => [
        ...prev,
        { id, providerId: input.providerId, date: input.date, patient: input.patient },
      ])
      return true
    }

    const cancel = (id: string) => {
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      providers,
      appointments,
      today: TODAY,
      theme,
      route,
      selectedProviderId,
      selectProvider,
      availableSlots,
      book,
      cancel,
      setTheme,
      navigate,
    }
  }, [providers, appointments, theme, route, selectedProviderId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
