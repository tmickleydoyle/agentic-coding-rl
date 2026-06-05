export type Priority = 'P0' | 'P1' | 'P2'
export type Status = 'idea' | 'building' | 'shipped'
export type Route = 'backlog' | 'stats' | 'settings'
export type Feature = { id: number; title: string; priority: Priority; status: Status }
