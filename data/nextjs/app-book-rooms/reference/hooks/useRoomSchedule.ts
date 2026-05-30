'use client'
import { useApp } from '../components/AppStateProvider'
import type { Booking } from '../lib/types'
import { overlaps } from '../lib/types'

export function conflictExists(
  bookings: Booking[],
  roomId: string,
  start: number,
  end: number,
  ignoreId?: string,
): boolean {
  return bookings.some(
    (b) => b.roomId === roomId && b.id !== ignoreId && overlaps(b.start, b.end, start, end),
  )
}

export function useRoomSchedule() {
  const { bookings, rooms } = useApp()

  const bookingsForRoom = (roomId: string): Booking[] =>
    bookings.filter((b) => b.roomId === roomId).slice().sort((a, b) => a.start - b.start)

  const hasConflict = (roomId: string, start: number, end: number, ignoreId?: string): boolean =>
    conflictExists(bookings, roomId, start, end, ignoreId)

  const bookingsByRoom: Record<string, number> = {}
  rooms.forEach((r) => {
    bookingsByRoom[r.id] = 0
  })
  bookings.forEach((b) => {
    bookingsByRoom[b.roomId] = (bookingsByRoom[b.roomId] ?? 0) + 1
  })

  return { bookingsForRoom, hasConflict, bookingsByRoom }
}
