export type QuoteStatus = 'sent' | 'won' | 'lost'
export type Route = 'quotes' | 'dashboard' | 'settings'
export type Quote = { id: number; client: string; amount: number; status: QuoteStatus }
