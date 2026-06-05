export type Route = 'items' | 'check' | 'summary'
export type Item = { id: number; name: string; price: number }
export type Line = { id: number; itemId: number; qty: number }
