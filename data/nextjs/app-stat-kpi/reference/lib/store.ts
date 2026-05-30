import type { Kpi } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Static seed data; tests call __reset() in beforeEach for isolation.

let kpis: Kpi[] = []

function seed(): void {
  kpis = [
    { id: 'k1', name: 'Revenue', unit: '$k', current: 120, previous: 100, target: 110, higherIsBetter: true, history: [90, 95, 100, 120] },
    { id: 'k2', name: 'Churn', unit: '%', current: 6, previous: 5, target: 5, higherIsBetter: false, history: [4, 5, 5, 6] },
    { id: 'k3', name: 'NPS', unit: 'pts', current: 42, previous: 45, target: 40, higherIsBetter: true, history: [38, 44, 45, 42] },
    { id: 'k4', name: 'Cost', unit: '$k', current: 80, previous: 90, target: 85, higherIsBetter: false, history: [95, 92, 90, 80] },
  ]
}

seed()

export function __reset(): void {
  seed()
}

export function listKpis(): Kpi[] {
  return kpis.slice()
}

export function findKpi(id: string): Kpi | undefined {
  return kpis.find((k) => k.id === id)
}

export function setTarget(id: string, target: number): Kpi | undefined {
  const kpi = kpis.find((k) => k.id === id)
  if (!kpi) return undefined
  kpi.target = target
  return kpi
}
