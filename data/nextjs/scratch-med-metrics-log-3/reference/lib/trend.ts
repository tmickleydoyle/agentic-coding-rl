export function getTrend(current: number, previous: number): string {
  if (current > previous) return '↑'
  if (current < previous) return '↓'
  return '→'
}
