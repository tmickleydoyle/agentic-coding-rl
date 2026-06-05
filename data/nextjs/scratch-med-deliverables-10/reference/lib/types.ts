export type Status = 'pending' | 'delivered'
export type Route = 'deliverables' | 'summary' | 'settings'
export type Deliverable = { id: number; item: string; due: string; status: Status }
