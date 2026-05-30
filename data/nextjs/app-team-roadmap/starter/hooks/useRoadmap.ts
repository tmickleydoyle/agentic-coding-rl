'use client'
import { useApp } from '../components/AppStateProvider'
import type { Initiative, Status } from '../lib/types'

export function byQuarter(_initiatives: Initiative[]): Record<string, Initiative[]> {
  // TODO: group initiatives by quarterId
  return {}
}

export function countByQuarter(_initiatives: Initiative[]): Record<string, number> {
  // TODO: count initiatives per quarterId
  return {}
}

export function statusTotals(_initiatives: Initiative[]): Record<Status, number> {
  // TODO: count initiatives per status
  return { planned: 0, 'in-progress': 0, done: 0 }
}

export function useRoadmap() {
  const { initiatives } = useApp()
  return {
    byQuarter: byQuarter(initiatives),
    countByQuarter: countByQuarter(initiatives),
    statusTotals: statusTotals(initiatives),
  }
}
