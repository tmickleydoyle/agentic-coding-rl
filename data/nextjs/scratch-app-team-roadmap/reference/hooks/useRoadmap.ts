'use client'
import { useApp } from '../components/AppStateProvider'
import type { Initiative, Status } from '../lib/types'

export function byQuarter(initiatives: Initiative[]): Record<string, Initiative[]> {
  const out: Record<string, Initiative[]> = {}
  initiatives.forEach((i) => {
    if (!out[i.quarterId]) out[i.quarterId] = []
    out[i.quarterId].push(i)
  })
  return out
}

export function countByQuarter(initiatives: Initiative[]): Record<string, number> {
  const out: Record<string, number> = {}
  initiatives.forEach((i) => {
    out[i.quarterId] = (out[i.quarterId] ?? 0) + 1
  })
  return out
}

export function statusTotals(initiatives: Initiative[]): Record<Status, number> {
  const out: Record<Status, number> = { planned: 0, 'in-progress': 0, done: 0 }
  initiatives.forEach((i) => {
    out[i.status] += 1
  })
  return out
}

export function useRoadmap() {
  const { initiatives } = useApp()
  return {
    byQuarter: byQuarter(initiatives),
    countByQuarter: countByQuarter(initiatives),
    statusTotals: statusTotals(initiatives),
  }
}
