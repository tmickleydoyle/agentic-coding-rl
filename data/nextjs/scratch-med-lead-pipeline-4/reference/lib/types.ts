export type Stage = 'new' | 'demo' | 'won'
export type Route = 'leads' | 'dashboard' | 'settings'
export type Lead = { id: number; company: string; stage: Stage; value: number }
