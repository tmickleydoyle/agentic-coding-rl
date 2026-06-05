export function getTrend(prev: number | null, current: number): string {
  if (prev === null) return '—'
  if (current > prev) return '▲'
  if (current < prev) return '▼'
  return '—'
}
