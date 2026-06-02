export type Route = 'funnels' | 'steps' | 'analysis' | 'settings'

export type Funnel = { id: number; name: string }
export type Step = { id: number; funnelId: number; name: string; users: number }

export function pct(part: number, whole: number): number {
  if (whole <= 0) return 0
  return Math.round((part / whole) * 100)
}
