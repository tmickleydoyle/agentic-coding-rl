import type { Entry } from './types'

export function getTrend(allEntries: Entry[], entry: Entry): string {
  const sameMetric = allEntries
    .filter((e) => e.name === entry.name && e.order < entry.order)
    .sort((a, b) => b.order - a.order)
  if (sameMetric.length === 0) return '—'
  const prev = sameMetric[0]
  if (entry.value > prev.value) return '↑'
  if (entry.value < prev.value) return '↓'
  return '→'
}

export function getLatestPerMetric(entries: Entry[]): Set<number> {
  const latestMap = new Map<string, Entry>()
  entries.forEach((e) => {
    const existing = latestMap.get(e.name)
    if (!existing || e.order > existing.order) {
      latestMap.set(e.name, e)
    }
  })
  const ids = new Set<number>()
  latestMap.forEach((e) => ids.add(e.id))
  return ids
}
