'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, FitnessClass, Booking } from '../lib/types'

type Ctx = {
  classes: FitnessClass[]
  bookings: Booking[]
  theme: 'light' | 'dark'
  hideFull: boolean
  route: Route
  navigate: (r: Route) => void
  addClass: (name: string, capacity: string) => void
  book: (classId: string, member: string) => void
  cancel: (bookingId: number) => void
  toggleTheme: () => void
  toggleHideFull: () => void
}

export const StudioContext = createContext<Ctx | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<FitnessClass[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideFull, setHideFull] = useState(false)
  const [route, setRoute] = useState<Route>('classes')
  const [nextClassId, setNextClassId] = useState(1)
  const [nextBookingId, setNextBookingId] = useState(1)

  function addClass(name: string, capacity: string) {
    const cap = parseInt(capacity, 10)
    const trimmed = name.trim()
    if (!trimmed || !isFinite(cap) || cap <= 0) return
    setClasses((c) => [...c, { id: nextClassId, name: trimmed, capacity: cap }])
    setNextClassId((n) => n + 1)
  }

  function book(classId: string, member: string) {
    const cid = parseInt(classId, 10)
    const trimmed = member.trim()
    const cls = classes.find((c) => c.id === cid)
    if (!cls || !trimmed) return
    const confirmed = bookings.filter((b) => b.classId === cid && !b.waitlisted).length
    const waitlisted = confirmed >= cls.capacity
    setBookings((b) => [...b, { id: nextBookingId, classId: cid, member: trimmed, waitlisted }])
    setNextBookingId((n) => n + 1)
  }

  function cancel(bookingId: number) {
    setBookings((prev) => {
      const target = prev.find((b) => b.id === bookingId)
      if (!target) return prev
      let remaining = prev.filter((b) => b.id !== bookingId)
      // If a confirmed seat opened up, promote the earliest waitlisted booking for that class.
      if (!target.waitlisted) {
        const promote = remaining.find((b) => b.classId === target.classId && b.waitlisted)
        if (promote) {
          remaining = remaining.map((b) => (b.id === promote.id ? { ...b, waitlisted: false } : b))
        }
      }
      return remaining
    })
  }

  const value: Ctx = {
    classes,
    bookings,
    theme,
    hideFull,
    route,
    navigate: setRoute,
    addClass,
    book,
    cancel,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideFull: () => setHideFull((s) => !s),
  }
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
