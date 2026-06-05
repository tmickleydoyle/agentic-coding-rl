export type Status = 'planned' | 'in-progress' | 'shipped'
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
export type Route = 'roadmap' | 'stats' | 'settings'
export type Item = { id: number; title: string; quarter: Quarter; status: Status }
