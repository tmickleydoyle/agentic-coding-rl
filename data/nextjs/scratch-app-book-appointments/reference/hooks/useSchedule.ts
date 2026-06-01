'use client'
import { useApp } from '../components/AppStateProvider'
import type { Booking } from '../lib/types'
import { SLOTS } from '../lib/types'

export function isSlotTaken(bookings: Booking[], serviceId: string, slot: string): boolean {
  return bookings.some((b) => b.serviceId === serviceId && b.slot === slot)
}

export function freeSlotsFor(bookings: Booking[], serviceId: string): string[] {
  return SLOTS.filter((s) => !isSlotTaken(bookings, serviceId, s))
}

export function useSchedule() {
  const { bookings, services } = useApp()

  const takenSlots = (serviceId: string): string[] =>
    bookings.filter((b) => b.serviceId === serviceId).map((b) => b.slot)

  const freeSlots = (serviceId: string): string[] => freeSlotsFor(bookings, serviceId)

  const bookingsByService: Record<string, number> = {}
  services.forEach((s) => {
    bookingsByService[s.id] = 0
  })
  bookings.forEach((b) => {
    bookingsByService[b.serviceId] = (bookingsByService[b.serviceId] ?? 0) + 1
  })

  return { takenSlots, freeSlots, bookingsByService }
}
