'use client'
import { useApp } from '../components/AppStateProvider'
import type { Kpi } from '../lib/types'

export type Trend = 'up' | 'down' | 'flat'

export function isOnTrack(kpi: Kpi): boolean {
  return kpi.higherIsBetter ? kpi.current >= kpi.target : kpi.current <= kpi.target
}

export function trendOf(kpi: Kpi): Trend {
  if (kpi.current > kpi.previous) return 'up'
  if (kpi.current < kpi.previous) return 'down'
  return 'flat'
}

export function changePct(kpi: Kpi): number {
  if (kpi.previous === 0) return 0
  return Math.round(((kpi.current - kpi.previous) / kpi.previous) * 1000) / 10
}

export function countOnTrack(kpis: Kpi[]): number {
  let n = 0
  kpis.forEach((k) => {
    if (isOnTrack(k)) n += 1
  })
  return n
}

export function useKpis() {
  const { kpis } = useApp()
  const onTrack = countOnTrack(kpis)
  const offTrack = kpis.length - onTrack
  return { kpis, onTrack, offTrack }
}
