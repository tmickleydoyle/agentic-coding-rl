'use client'
import { useApp } from '../components/AppStateProvider'

export function useSchedule() {
  // TODO: derive takenSlots(serviceId), freeSlots(serviceId), and bookingsByService
  // from the shared bookings/services state.
  useApp()
  const takenSlots = (_serviceId: string): string[] => []
  const freeSlots = (_serviceId: string): string[] => []
  const bookingsByService: Record<string, number> = {}
  return { takenSlots, freeSlots, bookingsByService }
}
