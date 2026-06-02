import type { Entry } from './types'

export function getTrend(allEntries: Entry[], entry: Entry): string {
  // find previous entries for same metric name, in order
  const sameMetric = allEntries.filter((e) => e.name === entry.name && e.order < entry.order)
  if (sameMetric.length === 0) return '—'
  const prev = sameMetric[sameMetric.length - 1]
  if (entry.value > prev.value) return '↑'
  if (entry.value < prev.value) return '↓'
  return '—'
}
