import type { Entry, MetricRow } from './types'

export function getLatestPerMetric(entries: Entry[]): MetricRow[] {
  // collect entries per metric in order
  const map: { [name: string]: number[] } = {}
  const order: string[] = []

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    if (!map[e.name]) {
      map[e.name] = []
      order.push(e.name)
    }
    map[e.name].push(e.value)
  }

  const rows: MetricRow[] = []
  for (let i = 0; i < order.length; i++) {
    const name = order[i]
    const vals = map[name]
    const latestValue = vals[vals.length - 1]
    let trend: '▲' | '▼' | '—' = '—'
    if (vals.length >= 2) {
      const prev = vals[vals.length - 2]
      if (latestValue > prev) trend = '▲'
      else if (latestValue < prev) trend = '▼'
      else trend = '—'
    }
    rows.push({ name, latestValue, trend })
  }

  return rows
}
