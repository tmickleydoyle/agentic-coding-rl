export type Route = 'experiments' | 'variants' | 'results' | 'settings'

export type Experiment = { id: number; name: string }
export type Variant = {
  id: number
  experimentId: number
  name: string
  visitors: number
  conversions: number
}

export function rate(visitors: number, conversions: number): number {
  if (visitors <= 0) return 0
  return Math.round((conversions / visitors) * 100)
}
