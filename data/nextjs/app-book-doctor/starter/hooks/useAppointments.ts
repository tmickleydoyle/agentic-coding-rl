'use client'
import { useApp } from '../components/AppStateProvider'
import type { Appointment } from '../lib/types'

export function useAppointments() {
  // TODO: derive upcoming (date >= today), past (date < today), and freeSlots(providerId)
  // from the shared appointments/providers state.
  useApp()
  const upcoming: Appointment[] = []
  const past: Appointment[] = []
  const freeSlots = (_providerId: string): string[] => []
  return { upcoming, past, freeSlots }
}
