'use client'
import { useApp } from '../components/AppStateProvider'
import type { Day, Entry } from '../lib/types'

export function totalsByProject(_entries: Entry[]): Record<string, number> {
  // TODO: sum hours per project id
  return {}
}

export function weekTotal(_entries: Entry[]): number {
  // TODO: grand total of all entry hours
  return 0
}

export function entriesForDay(_entries: Entry[], _day: Day): Entry[] {
  // TODO: filter entries by day
  return []
}

export function submittedCount(_entries: Entry[]): number {
  // TODO: count submitted entries
  return 0
}

export function useTimesheet() {
  const { entries } = useApp()
  return {
    totalsByProject: totalsByProject(entries),
    weekTotal: weekTotal(entries),
    submittedCount: submittedCount(entries),
  }
}
