export type Route = 'invoices' | 'summary' | 'settings'
export type Invoice = { id: number; client: string; amount: number; paid: boolean }
