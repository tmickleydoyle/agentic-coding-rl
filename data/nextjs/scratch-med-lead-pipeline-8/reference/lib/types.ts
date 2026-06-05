export type Stage = 'new' | 'demo' | 'won'
export type Route = 'leads' | 'summary' | 'settings'
export type Lead = { id: number; company: string; stage: Stage; dealValue: number }
