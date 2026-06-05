export type Priority = 'low' | 'medium' | 'high'
export type Status = 'new' | 'in-progress' | 'done'
export type Route = 'queue' | 'stats' | 'settings'
export type Request = { id: number; title: string; priority: Priority; status: Status }
