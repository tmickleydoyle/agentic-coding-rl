export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type BugStatus = 'open' | 'closed'
export type Route = 'bugs' | 'stats' | 'settings'
export type Bug = { id: number; title: string; severity: Severity; status: BugStatus }
