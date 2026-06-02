import type { Entry } from './types'

export function getTrend(allEntries: Entry[], entry: Entry): string {
  // Find all entries for this metric name up to and including this entry
  const sameMetric = allEntries.filter((e) => e.name === entry.name)
  const idx = sameMetric.findIndex((e) => e.id === entry.id)
  if (idx <= 0) return '—'
  const prev = sameMetric[idx - 1]
  if (entry.value > prev.value) return '▲'
  if (entry.value < prev.value) return '▼'
  return '—'
}
