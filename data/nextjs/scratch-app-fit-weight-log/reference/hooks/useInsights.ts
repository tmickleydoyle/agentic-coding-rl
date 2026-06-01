'use client'
import { useWeight } from '../components/WeightProvider'
import type { Trend, WeightEntry } from '../lib/types'

// Trend of a value compared to a previous value.
export function trendOf(current: number, previous: number | null): Trend {
  if (previous === null) return 'same'
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'same'
}

// Each entry tagged with its trend vs the chronologically previous entry.
export function withTrends(entries: WeightEntry[]): { entry: WeightEntry; trend: Trend }[] {
  return entries.map((e, i) => ({
    entry: e,
    trend: trendOf(e.weight, i === 0 ? null : entries[i - 1].weight),
  }))
}

// Goal progress percent from the first entry toward the goal, 0..100.
export function goalProgress(entries: WeightEntry[], goal: number): number {
  if (entries.length === 0) return 0
  const start = entries[0].weight
  const current = entries[entries.length - 1].weight
  const denom = start - goal
  if (denom === 0) return 100
  const pct = ((start - current) / denom) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
}

export function useInsights() {
  const { entries, goal } = useWeight()
  const latest = entries.length === 0 ? null : entries[entries.length - 1]
  const previous = entries.length < 2 ? null : entries[entries.length - 2]
  const latestTrend: Trend = latest ? trendOf(latest.weight, previous ? previous.weight : null) : 'same'
  const start = entries.length === 0 ? 0 : entries[0].weight
  const changeFromStart = latest ? Math.round((latest.weight - start) * 10) / 10 : 0
  const progress = goalProgress(entries, goal)
  const reached = latest !== null && latest.weight <= goal
  return { latest, latestTrend, changeFromStart, progress, reached, tagged: withTrends(entries) }
}
