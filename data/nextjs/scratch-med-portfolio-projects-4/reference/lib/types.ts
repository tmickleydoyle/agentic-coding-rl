export type Status = 'live' | 'draft'
export type Route = 'projects' | 'stats' | 'settings'
export type Project = { id: number; title: string; category: string; status: Status }
