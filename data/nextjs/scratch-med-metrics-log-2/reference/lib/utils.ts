import type { Entry, MetricSummary, Trend } from './types'

export function latestPerMetric(entries: Entry[]): Entry[] {
  const seen = new Map<string, Entry>()
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    seen.set(e.name, e)
  }
  // Return in first-seen order
  const result: Entry[] = []
  const added = new Set<string>()
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    if (!added.has(e.name)) {
      const latest = seen.get(e.name)
      if (latest) result.push(latest)
      added.add(e.name)
    }
  }
  return result
}

export function metricSummaries(entries: Entry[]): MetricSummary[] {
  // collect per-name in insertion order
  const order: string[] = []
  const map = new Map<string, Entry[]>()
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    if (!map.has(e.name)) {
      order.push(e.name)
      map.set(e.name, [])
    }
    const arr = map.get(e.name)
    if (arr) arr.push(e)
  }
  const result: MetricSummary[] = []
  for (let i = 0; i < order.length; i++) {
    const name = order[i]
    const arr = map.get(name) || []
    const count = arr.length
    const latest = arr[arr.length - 1].value
    let trend: Trend = 'steady'
    if (count >= 2) {
      const prev = arr[arr.length - 2].value
      if (latest > prev) trend = 'up'
      else if (latest < prev) trend = 'down'
      else trend = 'steady'
    }
    result.push({ name, latest, count, trend })
  }
  return result
}
