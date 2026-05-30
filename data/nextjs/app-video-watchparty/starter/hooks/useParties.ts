'use client'
import { useApp } from '../components/AppStateProvider'
import type { Filter, Party } from '../lib/types'

export function findParty(_parties: Party[], _id: string | null): Party | undefined {
  // TODO: look up a party by id
  return undefined
}

export function statusOf(_party: Party): Filter {
  // TODO: 'upcoming' if time > NOW else 'past'
  return 'past'
}

export function filterParties(_parties: Party[], _filter: Filter): Party[] {
  // TODO: parties matching the filter
  return []
}

export function useMyParties(): Party[] {
  // TODO: return rsvped parties
  void useApp
  return []
}
