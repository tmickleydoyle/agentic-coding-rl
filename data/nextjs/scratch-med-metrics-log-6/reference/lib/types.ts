export type Route = 'log' | 'dashboard' | 'settings'
export type Entry = { id: number; name: string; value: number }
export type MetricRow = { name: string; latestValue: number; trend: '▲' | '▼' | '—' }
