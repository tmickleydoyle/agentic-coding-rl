export type Stage = 'new' | 'demo' | 'won'
export type StageFilter = 'All' | Stage
export type Route = 'leads' | 'summary' | 'settings'
export type Lead = { id: number; company: string; stage: Stage; value: number }
