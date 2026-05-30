'use client'
import { useApp } from '../components/AppStateProvider'
import type { Appointment, Provider } from '../lib/types'

export function isUpcoming(appointment: Appointment, today: string): boolean {
  return appointment.date >= today
}

export function openSlots(provider: Provider, appointments: Appointment[]): string[] {
  return provider.slots.filter(
    (s) => !appointments.some((a) => a.providerId === provider.id && a.date === s),
  )
}

export function useAppointments() {
  const { appointments, providers, today } = useApp()

  const upcoming = appointments
    .filter((a) => a.date >= today)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  const past = appointments
    .filter((a) => a.date < today)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  const freeSlots = (providerId: string): string[] => {
    const provider = providers.find((p) => p.id === providerId)
    if (!provider) return []
    return openSlots(provider, appointments)
  }

  return { upcoming, past, freeSlots }
}
