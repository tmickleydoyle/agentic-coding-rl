import type { Cohort } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let cohorts: Cohort[] = []
let nextCohortId = 1

function seed(): void {
  cohorts = [
    { id: 'c1', month: 'Jan', size: 200, retention: [100, 60, 40, 20] },
    { id: 'c2', month: 'Feb', size: 150, retention: [100, 80, 50, 30] },
    { id: 'c3', month: 'Mar', size: 100, retention: [100, 50, 30, 10] },
    { id: 'c4', month: 'Apr', size: 50, retention: [100, 70, 60, 40] },
  ]
  nextCohortId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listCohorts(filter?: { minSize?: number | null }): Cohort[] {
  let out = cohorts.map((c) => ({ ...c, retention: c.retention.slice() }))
  const minSize = filter?.minSize
  if (typeof minSize === 'number') out = out.filter((c) => c.size >= minSize)
  return out
}

export function averages(input: Cohort[]): number[] {
  const out = [0, 0, 0, 0]
  if (input.length === 0) return out
  for (let p = 0; p < 4; p++) {
    let sum = 0
    input.forEach((c) => {
      sum += c.retention[p] ?? 0
    })
    out[p] = Math.round(sum / input.length)
  }
  return out
}

export function createCohort(input: { month: string; size: number; retention?: number[] }): Cohort {
  const cohort: Cohort = {
    id: `c${nextCohortId++}`,
    month: input.month,
    size: input.size,
    retention: input.retention ? input.retention.slice() : [100, 0, 0, 0],
  }
  cohorts.push(cohort)
  return cohort
}

export function deleteCohort(id: string): boolean {
  const idx = cohorts.findIndex((c) => c.id === id)
  if (idx === -1) return false
  cohorts.splice(idx, 1)
  return true
}
