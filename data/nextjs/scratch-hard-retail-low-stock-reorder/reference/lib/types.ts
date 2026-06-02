export type Route = 'inventory' | 'restock' | 'report'
export type Item = { id: number; name: string; onHand: number; reorder: number; target: number }
