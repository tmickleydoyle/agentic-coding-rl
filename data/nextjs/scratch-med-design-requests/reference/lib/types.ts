export type RequestStatus = 'new' | 'in-progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'
export type StatusFilter = 'all' | 'new' | 'in-progress' | 'done'
export type Route = 'queue' | 'stats' | 'settings'
export type Request = { id: number; title: string; priority: Priority; status: RequestStatus }
