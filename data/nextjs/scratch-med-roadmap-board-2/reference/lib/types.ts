export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
export type Status = 'Planned' | 'In Progress' | 'Shipped'
export type Route = 'roadmap' | 'stats' | 'settings'
export type RoadmapItem = { id: number; title: string; quarter: Quarter; status: Status }
