'use client'
import { useApp } from '../components/AppStateProvider'
import type { Day, Entry } from '../lib/types'

export function totalsByProject(entries: Entry[]): Record<string, number> {
  const out: Record<string, number> = {}
  entries.forEach((e) => {
    out[e.projectId] = (out[e.projectId] ?? 0) + e.hours
  })
  return out
}

export function weekTotal(entries: Entry[]): number {
  return entries.reduce((acc, e) => acc + e.hours, 0)
}

export function entriesForDay(entries: Entry[], day: Day): Entry[] {
  return entries.filter((e) => e.day === day)
}

export function submittedCount(entries: Entry[]): number {
  return entries.filter((e) => e.submitted).length
}

export function useTimesheet() {
  const { entries } = useApp()
  return {
    totalsByProject: totalsByProject(entries),
    weekTotal: weekTotal(entries),
    submittedCount: submittedCount(entries),
  }
}
