export type Status = 'pending' | 'delivered'
export type Route = 'deliverables' | 'summary' | 'settings'
export type Deliverable = { id: number; name: string; due: string; status: Status }
