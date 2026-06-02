export type Severity = 'Low' | 'Medium' | 'High'
export type BugStatus = 'open' | 'closed'
export type StatusFilter = 'All' | 'Open' | 'Closed'
export type Route = 'bugs' | 'stats' | 'settings'
export type Bug = { id: number; title: string; severity: Severity; status: BugStatus }
