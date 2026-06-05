export type Severity = 'Low' | 'Medium' | 'High'
export type Status = 'open' | 'closed'
export type Route = 'bugs' | 'stats' | 'settings'
export type Bug = { id: number; title: string; severity: Severity; status: Status }
