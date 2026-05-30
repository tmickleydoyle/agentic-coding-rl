'use client'
import { useApp } from '../components/AppStateProvider'
import type { Rsvp } from '../lib/types'

export function useResponses() {
  // TODO: derive tally(eventId) ({ yes, no, maybe, pending } counts) and totalHeadcount
  // (sum of headcounts across all events) from the shared events state.
  useApp()
  const tally = (_eventId: string): Record<Rsvp, number> => ({
    yes: 0,
    no: 0,
    maybe: 0,
    pending: 0,
  })
  const totalHeadcount = 0
  return { tally, totalHeadcount }
}
