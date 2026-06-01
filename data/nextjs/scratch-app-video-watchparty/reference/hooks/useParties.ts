'use client'
import { useApp } from '../components/AppStateProvider'
import type { Filter, Party } from '../lib/types'
import { NOW } from '../lib/types'

export function findParty(parties: Party[], id: string | null): Party | undefined {
  if (!id) return undefined
  return parties.find((p) => p.id === id)
}

export function statusOf(party: Party): Filter {
  return party.time > NOW ? 'upcoming' : 'past'
}

export function filterParties(parties: Party[], filter: Filter): Party[] {
  return parties.filter((p) => statusOf(p) === filter)
}

export function useMyParties(): Party[] {
  const { parties } = useApp()
  return parties.filter((p) => p.rsvped)
}
