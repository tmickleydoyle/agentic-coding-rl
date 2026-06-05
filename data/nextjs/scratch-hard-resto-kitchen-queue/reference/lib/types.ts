export type Route = 'queue' | 'board' | 'stats'
export type Stage = 'Queued' | 'Cooking' | 'Ready' | 'Served'
export const STAGES: Stage[] = ['Queued', 'Cooking', 'Ready', 'Served']
export type Ticket = { id: number; num: number; table: number; item: string; stage: Stage }
