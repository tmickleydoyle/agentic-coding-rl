'use client'
import { useApp } from '../components/AppStateProvider'
import type { Entry } from '../lib/types'

export function entriesForDate(entries: Entry[], date: string): Entry[] {
  return entries.filter((e) => e.date === date)
}

export function entriesForMember(entries: Entry[], memberId: string): Entry[] {
  return entries.filter((e) => e.memberId === memberId)
}

export function blockerCount(entries: Entry[]): number {
  return entries.filter((e) => e.blocker !== null).length
}

export function dates(entries: Entry[]): string[] {
  const set: Record<string, true> = {}
  entries.forEach((e) => {
    set[e.date] = true
  })
  return Object.keys(set).sort()
}

export function useStandup() {
  const { entries } = useApp()
  return { entriesForDate, entriesForMember, blockerCount, dates, entries }
}
