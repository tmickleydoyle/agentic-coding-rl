export type Stage = 'intro' | 'pitched' | 'committed'
export type Route = 'investors' | 'summary' | 'settings'
export type Investor = { id: number; firm: string; checkSize: number; stage: Stage }
