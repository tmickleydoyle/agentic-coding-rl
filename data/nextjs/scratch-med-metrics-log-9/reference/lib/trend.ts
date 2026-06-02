// Returns the trend symbol for a metric given all its values in insertion order
export function getTrend(values: number[]): string {
  if (values.length <= 1) return '—'
  const last = values[values.length - 1]
  const prev = values[values.length - 2]
  if (last > prev) return '▲'
  if (last < prev) return '▼'
  return '—'
}
