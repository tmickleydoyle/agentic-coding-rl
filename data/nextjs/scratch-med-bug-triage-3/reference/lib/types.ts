export type Severity = 'low' | 'medium' | 'high'
export type BugStatus = 'open' | 'closed'
export type FilterStatus = 'all' | 'open' | 'closed'
export type Route = 'bugs' | 'stats' | 'settings'
export type Bug = { id: number; title: string; severity: Severity; status: BugStatus }
