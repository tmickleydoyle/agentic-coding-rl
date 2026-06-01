'use client'
import { useApp } from '../components/AppStateProvider'
import type { Invite, Rsvp } from '../lib/types'

export function countHeadcount(invites: Invite[]): number {
  return invites.reduce(
    (acc, i) => (i.status === 'yes' ? acc + 1 + i.extraGuests : acc),
    0,
  )
}

export function useResponses() {
  const { events } = useApp()

  const tally = (eventId: string): Record<Rsvp, number> => {
    const out: Record<Rsvp, number> = { yes: 0, no: 0, maybe: 0, pending: 0 }
    const event = events.find((e) => e.id === eventId)
    if (!event) return out
    event.invites.forEach((i) => {
      out[i.status] += 1
    })
    return out
  }

  let totalHeadcount = 0
  events.forEach((e) => {
    totalHeadcount += countHeadcount(e.invites)
  })

  return { tally, totalHeadcount }
}
