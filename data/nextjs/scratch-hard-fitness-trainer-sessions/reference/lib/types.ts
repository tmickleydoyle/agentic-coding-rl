export type Route = 'trainers' | 'sessions' | 'utilization' | 'settings'
export type Trainer = { id: number; name: string; cap: number }
export type Session = { id: number; trainerId: number; client: string; hours: number }
