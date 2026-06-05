export type Stage = 'lead' | 'qualified' | 'won'
export type Route = 'contacts' | 'pipeline' | 'reports' | 'settings'
export type Contact = { id: number; name: string; company: string; amount: number; stage: Stage }
