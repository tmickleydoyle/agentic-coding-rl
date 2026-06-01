'use client'
import { useApp } from '../components/AppStateProvider'
import { TODAY } from '../lib/types'
import type { FollowUp } from '../lib/types'

export function dueToday(followups: FollowUp[]): FollowUp[] {
  return followups.filter((f) => !f.done && f.dueDate === TODAY)
}

export function overdue(followups: FollowUp[]): FollowUp[] {
  return followups.filter((f) => !f.done && f.dueDate < TODAY)
}

export function openFollowUps(followups: FollowUp[]): FollowUp[] {
  return followups.filter((f) => !f.done)
}

export function doneFollowUps(followups: FollowUp[]): FollowUp[] {
  return followups.filter((f) => f.done)
}

export function byDueDate(followups: FollowUp[]): FollowUp[] {
  return followups.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export function useFollowUps() {
  const { followups } = useApp()
  return {
    today: dueToday(followups),
    overdue: overdue(followups),
    open: openFollowUps(followups),
    done: doneFollowUps(followups),
  }
}
