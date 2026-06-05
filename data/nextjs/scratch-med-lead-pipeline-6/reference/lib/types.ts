export type Stage = 'new' | 'demo' | 'won'
export type Route = 'leads' | 'pipeline' | 'settings'
export type Lead = { id: number; company: string; stage: Stage; value: number }
