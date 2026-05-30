'use client'
import { useApp } from '../components/AppStateProvider'
import type { Cohort, SizeFilter } from '../lib/types'

export function applyFilter(cohorts: Cohort[], filter: SizeFilter): Cohort[] {
  if (filter === 'all') return cohorts.slice()
  return cohorts.filter((c) => c.size >= 100)
}

export function averages(cohorts: Cohort[]): number[] {
  const out = [0, 0, 0, 0]
  if (cohorts.length === 0) return out
  for (let p = 0; p < 4; p++) {
    let sum = 0
    cohorts.forEach((c) => {
      sum += c.retention[p] ?? 0
    })
    out[p] = Math.round(sum / cohorts.length)
  }
  return out
}

export function retainedUsers(cohort: Cohort, period: number): number {
  return Math.round((cohort.size * (cohort.retention[period] ?? 0)) / 100)
}

export function bestCohortId(cohorts: Cohort[], period: number): string {
  let bestId = ''
  let best = -1
  cohorts.forEach((c) => {
    const v = c.retention[period] ?? 0
    if (v > best) {
      best = v
      bestId = c.id
    }
  })
  return bestId
}

export function useCohorts() {
  const { cohorts, sizeFilter } = useApp()
  const filtered = applyFilter(cohorts, sizeFilter)
  return {
    cohorts: filtered,
    averages: averages(filtered),
    bestAtM3: bestCohortId(filtered, 3),
  }
}
