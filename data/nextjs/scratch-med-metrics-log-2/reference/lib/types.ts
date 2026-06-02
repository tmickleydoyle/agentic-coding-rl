export type Route = 'log' | 'dashboard' | 'settings'
export type Entry = { index: number; name: string; value: number }
export type Trend = 'up' | 'down' | 'steady'
export type MetricSummary = {
  name: string
  latest: number
  count: number
  trend: Trend
}
