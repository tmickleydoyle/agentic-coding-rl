export type Stage = 'intro' | 'pitched' | 'committed'
export type Route = 'investors' | 'dashboard' | 'settings'
export type Investor = { id: number; firm: string; stage: Stage; checkSize: number }
