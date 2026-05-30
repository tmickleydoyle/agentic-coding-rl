import type { Kpi } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `kpis`; seed them; provide __reset() to re-seed.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listKpis(): Kpi[] {
  // TODO: return all kpis
  return []
}

export function findKpi(_id: string): Kpi | undefined {
  // TODO: look up a kpi by id
  return undefined
}

export function setTarget(_id: string, _target: number): Kpi | undefined {
  // TODO: update the kpi's target and return it, or undefined if absent
  return undefined
}
