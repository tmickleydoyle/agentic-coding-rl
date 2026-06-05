export type Route = 'inventory' | 'summary' | 'settings'
export type Product = {
  id: number
  name: string
  onHand: number
  reorderPoint: number
}
