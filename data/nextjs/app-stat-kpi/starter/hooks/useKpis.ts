'use client'
import { useApp } from '../components/AppStateProvider'
import type { Kpi } from '../lib/types'

export type Trend = 'up' | 'down' | 'flat'

export function isOnTrack(_kpi: Kpi): boolean {
  // TODO: current >= target if higherIsBetter, else current <= target
  return false
}

export function trendOf(_kpi: Kpi): Trend {
  // TODO: up/down/flat comparing current to previous
  return 'flat'
}

export function changePct(_kpi: Kpi): number {
  // TODO: percent change vs previous, rounded to 1 dp (0 when previous is 0)
  return 0
}

export function countOnTrack(_kpis: Kpi[]): number {
  // TODO: number of on-track kpis
  return 0
}

export function useKpis() {
  const { kpis } = useApp()
  const onTrack = countOnTrack(kpis)
  const offTrack = kpis.length - onTrack
  return { kpis, onTrack, offTrack }
}
