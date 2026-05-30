'use client'
import { useApp } from '../components/AppStateProvider'
import type { Entry } from '../lib/types'

export function entriesForDate(_entries: Entry[], _date: string): Entry[] {
  // TODO: filter entries by date
  return []
}

export function entriesForMember(_entries: Entry[], _memberId: string): Entry[] {
  // TODO: filter entries by memberId
  return []
}

export function blockerCount(_entries: Entry[]): number {
  // TODO: count entries with a non-null blocker
  return 0
}

export function dates(_entries: Entry[]): string[] {
  // TODO: sorted unique list of dates
  return []
}

export function useStandup() {
  const { entries } = useApp()
  return { entriesForDate, entriesForMember, blockerCount, dates, entries }
}
