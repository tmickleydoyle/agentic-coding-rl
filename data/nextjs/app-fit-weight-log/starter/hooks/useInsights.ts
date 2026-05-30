'use client'
import { useWeight } from '../components/WeightProvider'
import type { Trend, WeightEntry } from '../lib/types'

export function trendOf(_current: number, _previous: number | null): Trend {
  // TODO: 'up' | 'down' | 'same' vs the previous value.
  return 'same'
}

export function withTrends(entries: WeightEntry[]): { entry: WeightEntry; trend: Trend }[] {
  // TODO: tag each entry with its trend vs the previous entry.
  return entries.map((e) => ({ entry: e, trend: 'same' as Trend }))
}

export function goalProgress(_entries: WeightEntry[], _goal: number): number {
  // TODO: percent from the first entry toward the goal, clamped 0..100.
  return 0
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
