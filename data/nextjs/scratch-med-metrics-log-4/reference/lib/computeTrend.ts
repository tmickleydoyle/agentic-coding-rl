import type { Entry } from './types'

// Returns a map of seq -> trend symbol for the latest entry of each metric.
// Only the most recent entry per metric name gets a symbol.
export function computeTrend(entries: Entry[]): Map<number, string> {
  const result = new Map<number, string>()
  // Group entries by name, keeping order
  const byName = new Map<string, Entry[]>()
  entries.forEach((e) => {
    if (!byName.has(e.name)) byName.set(e.name, [])
    byName.get(e.name)!.push(e)
  })
  byName.forEach((group) => {
    if (group.length < 1) return
    const latest = group[group.length - 1]
    if (group.length === 1) {
      result.set(latest.seq, '–')
    } else {
      const prev = group[group.length - 2]
      if (latest.value > prev.value) result.set(latest.seq, '↑')
      else if (latest.value < prev.value) result.set(latest.seq, '↓')
      else result.set(latest.seq, '–')
    }
  })
  return result
}
