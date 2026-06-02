export type Status = 'pending' | 'delivered'
export type Route = 'deliverables' | 'summary' | 'settings'
export type FilterType = 'all' | 'pending' | 'delivered'
export type Deliverable = { id: number; name: string; due: string; status: Status }
