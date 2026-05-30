'use client'
import { useApp } from '../components/AppStateProvider'
import type { Booking } from '../lib/types'

export function useRoomSchedule() {
  // TODO: derive bookingsForRoom(roomId) (sorted), hasConflict(...), and bookingsByRoom
  // from the shared rooms/bookings state.
  useApp()
  const bookingsForRoom = (_roomId: string): Booking[] => []
  const hasConflict = (_roomId: string, _start: number, _end: number, _ignoreId?: string): boolean => false
  const bookingsByRoom: Record<string, number> = {}
  return { bookingsForRoom, hasConflict, bookingsByRoom }
}
