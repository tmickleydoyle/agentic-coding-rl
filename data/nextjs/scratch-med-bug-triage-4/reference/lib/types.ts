export type Severity = 'low' | 'medium' | 'high'
export type Status = 'open' | 'closed'
export type Route = 'bugs' | 'stats' | 'settings'
export type Bug = { id: number; title: string; severity: Severity; status: Status }
