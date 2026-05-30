'use client'
import { useApp } from '../components/AppStateProvider'
import type { FollowUp } from '../lib/types'

export function dueToday(_followups: FollowUp[]): FollowUp[] {
  // TODO: open follow-ups whose dueDate equals TODAY
  return []
}

export function overdue(_followups: FollowUp[]): FollowUp[] {
  // TODO: open follow-ups whose dueDate is before TODAY
  return []
}

export function openFollowUps(_followups: FollowUp[]): FollowUp[] {
  // TODO: not-done follow-ups
  return []
}

export function doneFollowUps(_followups: FollowUp[]): FollowUp[] {
  // TODO: done follow-ups
  return []
}

export function byDueDate(_followups: FollowUp[]): FollowUp[] {
  // TODO: a copy sorted by dueDate ascending
  return []
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
